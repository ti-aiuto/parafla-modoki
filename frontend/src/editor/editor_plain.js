const UI_WAIT_TIME = 50; // 気持ち遅らせたほうが違和感ないので待つ

import {AssetsManager} from '@/sdk/assets-manager';
import {ObjectBuilder} from '@/sdk/object-builder';
import Vue from 'vue';

export function initEditor() {
  const eventTypeTable = {
    defineLabel: 'ラベルを定義',
    rollback: 'ロールバック',
    defineComponentUserFunction: 'ユーザ関数を定義',
    executeAction: 'アクションを実行',
    putImage: '画像を配置',
    putText: 'テキストを配置',
    putAudio: '音声を配置',
    doNothing: '何もしない',
  };
  const actionTypeTable = {
    eraseLayers: '指定深度を消去',
    play: '再生',
    stop: '停止',
    gotoAndPlay: '指定ラベルにジャンプして再生',
    setTextValue: 'テキストの表示内容を更新',
    executeScript: 'スクリプトを実行',
    playAudio: '音声を再生',
    callComponentUserFunction: 'ユーザ関数を呼び出し',
    registerGlobalKeydownListener: 'キー押下リスナーを登録',
    unregisterGlobalKeydownListener: 'キー押下リスナーを登録解除',
    startUserTimer: 'タイマーを開始',
    clearUserTimer: 'タイマーを解除',
  };
  const assetTypeTable = {
    image: '画像',
    text: 'テキスト',
    audio: '音声',
  };

  new Vue({
    el: '#vue_root',
    methods: {
      updateFrameNumbers() {
        let frameNumber = 1;
        this.frameEvents.forEach(frameEvent => {
          frameEvent['scheduledFrameNumber'] = frameNumber;
          if (frameEvent.type === 'rollback') {
            frameNumber -= frameEvent.frameCount;
          } else {
            frameNumber += frameEvent.frameCount;
          }
        });
      },
      loadWorkspace(workspace) {
        console.debug('workspace読込', workspace);
        this.frameEvents = workspace['frameEvents'];
        this.updateFrameNumbers();
        this.assetsManager = new AssetsManager(workspace['allIdToAsset']);
        this.reloadAllAssets();
      },
      start() {
        this.started = true;
      },
      eventTypeI18n(event) {
        let content = eventTypeTable[event.type];
        if (event.type === 'defineLabel') {
          content += `「${event['defineLabel']['label']}」`;
        } else if (event.type === 'defineComponentUserFunction') {
          content += `「${event['defineComponentUserFunction']['name']}」`;
        } else if (event.type === 'putImage' || event.type === 'putText') {
          if (event.lastKeyFrame) {
            content += '\n※アニメーションあり';
          }
          if (event.objectId) {
            content += `\n(オブジェクトID: ${event.objectId} アセットID: ${
              event.putImage?.assetId || event.putText?.assetId
            })`;
          }
        }
        return content;
      },
      actionI18n(action) {
        if (!action) {
          return undefined;
        }
        let content = actionTypeTable[action.type];
        if (action['type'] === 'eraseLayers') {
          content += `\n(深度: ${action['eraseLayers']['depths'].join(',')})`;
        } else if (action['type'] === 'gotoAndPlay') {
          content += `\n(行先: 「${action['gotoAndPlay']['destination']}」)`;
        } else if (action['type'] === 'setTextValue') {
          content += `\n(対象: ${action['setTextValue']['objectId']})`;
        } else if (action['type'] === 'callComponentUserFunction') {
          content += `\n(ユーザ関数名: ${action['callComponentUserFunction']['name']})`;
        } else if (action['type'] === 'registerGlobalKeydownListener') {
          content += `\n(リスナーID: ${action['registerGlobalKeydownListener']['listenerId']})`;
        } else if (action['type'] === 'unregisterGlobalKeydownListener') {
          content += `\n(リスナーID: ${action['unregisterGlobalKeydownListener']['listenerId']})`;
        } else if (action['type'] === 'startUserTimer') {
          content += `\n(リスナーID: ${action['startUserTimer']['listenerId']})`;
        } else if (action['type'] === 'clearUserTimer') {
          content += `\n(リスナーID: ${action['clearUserTimer']['listenerId']})`;
        }
        return content;
      },
      frameEventRowStyle(row) {
        if (row === this.selectedFrameEvent) {
          return {color: '#fff', 'background-color': '#0000cd'};
        }

        if (row['type'] === 'defineLabel') {
          return {'background-color': '#E6FFE9'};
        }
        if (row['onClickAction']) {
          return {'background-color': '#FFEEFF'};
        }
      },
      assetTypeI18n(assetType) {
        return assetTypeTable[assetType];
      },
      assetRowStyle(assetId) {
        if (Number(assetId) === Number(this.selectedAssetId)) {
          return {color: '#fff', 'background-color': '#0000cd'};
        }
      },
      selectAsset(assetId) {
        this.clearSelected();
        this.selectedAssetId = Number(assetId);
        if (this.selectedAsset?.type === 'text') {
          this.updateTextAssetPreview();
        }
      },
      updateTextAssetPreview() {
        const wrapper = this.$refs.textWrapper;
        while (wrapper.firstChild) {
          wrapper.removeChild(wrapper.firstChild);
        }
        const previewElement = document.createElement('div');
        wrapper.appendChild(previewElement);
        this.objectBuilder.updateText(previewElement, this.selectedAsset.text);
      },
      buildFrameEventElement(
        previewElement,
        styleElement,
        frameEvent,
        fullObjectId
      ) {
        if (frameEvent.type === 'putImage') {
          const putImageEvent = frameEvent['putImage'];
          const image = {
            image: this.assetsManager.find(putImageEvent.assetId)?.image, // TODO: なかった場合
            hoverImage: this.assetsManager.find(putImageEvent.hoverAssetId)
              ?.image,
            activeImage: this.assetsManager.find(putImageEvent.activeAssetId)
              ?.image,
          };
          if (!image.image) {
            return;
          }
          this.objectBuilder.initImage(styleElement, fullObjectId, image);
          previewElement.dataset.fullObjectId = fullObjectId;
          previewElement.style.border = 'solid 6px #aaa';
          this.objectBuilder.setLayoutOptionsToElement(
            previewElement,
            frameEvent.layoutOptions
          );
        } else if (frameEvent.type === 'putText') {
          const putTextEvent = frameEvent['putText'];
          const text = this.assetsManager.find(putTextEvent.assetId)?.text; // TODO: なかった場合
          if (!text) {
            return;
          }
          this.objectBuilder.updateText(previewElement, text);
          this.objectBuilder.setLayoutOptionsToElement(
            previewElement,
            frameEvent.layoutOptions
          );
        }
      },
      updateModalEventPreview() {
        if (!this.modalEventPreviewAvailable) {
          return;
        }

        const wrapper = this.$refs.modalEventPreviewWrapper;
        if (!wrapper) {
          return;
        }
        while (wrapper.firstChild) {
          wrapper.removeChild(wrapper.firstChild);
        }
        const previewElement = document.createElement('div');
        const styleElement = document.createElement('style');
        wrapper.appendChild(previewElement);
        wrapper.appendChild(styleElement);
        this.buildFrameEventElement(
          previewElement,
          styleElement,
          this.editingFrameEvent,
          'modal-preview'
        );
      },
      updateEventPreview() {
        const wrapper = this.$refs.eventPreviewWrapper;
        while (wrapper.firstChild) {
          wrapper.removeChild(wrapper.firstChild);
        }
        const previewElement = document.createElement('div');
        const styleElement = document.createElement('style');
        wrapper.appendChild(previewElement);
        wrapper.appendChild(styleElement);
        this.buildFrameEventElement(
          previewElement,
          styleElement,
          this.selectedFrameEvent,
          'left-column-preview'
        );
      },
      selectFrameEvent(frameEvent) {
        this.clearSelected();
        this.selectedFrameEvent = frameEvent;
        this.updateEventPreview();
      },
      openPreview() {
        const previewWindow = open('./preview.html', 'preview');
        // 受け取れてるかわからないので繰り返し送信する
        let count = 0;
        const timerId = setInterval(() => {
          previewWindow.postMessage(
            JSON.stringify(this.generatWorkspaceJson()),
            '*'
          );
          count++;
          if (count >= 5) {
            clearInterval(timerId);
          }
        }, 1000);
      },
      clickEditFrameEvent() {
        if (!this.selectedFrameEvent) {
          return;
        }
        setTimeout(() => {
          this.editingTargetFrameEvent = this.selectedFrameEvent;
          this.editingFrameEvent = structuredClone(this.selectedFrameEvent);

          // 「未選択」の選択状態を正しく表示するためのロジック
          if (this.editingFrameEvent.type === 'putImage') {
            if (!this.editingFrameEvent['putImage'].hoverAssetId) {
              this.$set(this.editingFrameEvent['putImage'], 'hoverAssetId', '');
            }
            if (!this.editingFrameEvent['putImage'].activeAssetId) {
              this.$set(
                this.editingFrameEvent['putImage'],
                'activeAssetId',
                ''
              );
            }
          }
        }, UI_WAIT_TIME);
      },
      clickCancelEditing() {
        setTimeout(() => {
          this.editingTargetFrameEvent = null;
          this.editingFrameEvent = null;
        }, UI_WAIT_TIME);
      },
      clickNewFrameEvent() {
        setTimeout(() => {
          this.editingTargetFrameEvent = null;
          this.editingFrameEvent = {type: null};
        }, UI_WAIT_TIME);
      },
      clickRemoveFrameEvent() {
        if (!this.selectedFrameEvent) {
          return;
        }
        setTimeout(() => {
          if (confirm('選択されたイベントを削除します')) {
            const index = this.frameEvents.indexOf(this.selectedFrameEvent);
            if (index !== -1) {
              this.selectedFrameEvent = null;
              this.frameEvents.splice(index, 1);
              this.updateFrameNumbers();
            }
          }
        }, UI_WAIT_TIME);
      },
      clickMoveUpwardFrameEvent() {
        setTimeout(() => {
          if (!this.canMoveUpwardSelected()) {
            return;
          }
          const selectedIndex = this.frameEvents.indexOf(
            this.selectedFrameEvent
          );
          const prevItem = this.frameEvents[selectedIndex - 1];
          this.$set(
            this.frameEvents,
            selectedIndex - 1,
            this.selectedFrameEvent
          );
          this.$set(this.frameEvents, selectedIndex, prevItem);
          this.updateFrameNumbers();
        }, UI_WAIT_TIME);
      },
      clickMoveDownwardFrameEvent() {
        setTimeout(() => {
          if (!this.canMoveDownwardSelected()) {
            return;
          }
          const selectedIndex = this.frameEvents.indexOf(
            this.selectedFrameEvent
          );
          const nextItem = this.frameEvents[selectedIndex + 1];
          this.$set(
            this.frameEvents,
            selectedIndex + 1,
            this.selectedFrameEvent
          );
          this.$set(this.frameEvents, selectedIndex, nextItem);
          this.updateFrameNumbers();
        }, UI_WAIT_TIME);
      },
      canMoveUpwardSelected() {
        if (!this.selectedFrameEvent || this.frameEvents.length <= 1) {
          return false;
        }
        return this.frameEvents.indexOf(this.selectedFrameEvent) >= 1;
      },
      canMoveDownwardSelected() {
        if (!this.selectedFrameEvent || this.frameEvents.length <= 1) {
          return false;
        }
        return (
          this.frameEvents[this.frameEvents.length - 1] !==
          this.selectedFrameEvent
        );
      },
      clickCopyFrameEvent() {
        if (!this.selectedFrameEvent) {
          return;
        }
        const selectedIndex = this.frameEvents.indexOf(this.selectedFrameEvent);
        this.frameEvents.splice(
          selectedIndex,
          0,
          structuredClone(this.selectedFrameEvent)
        );
        this.updateFrameNumbers();
      },
      buildAction(actionObject, actionType) {
        if (actionType === 'play') {
          this.$set(actionObject, 'play', {});
        } else if (actionType === 'stop') {
          this.$set(actionObject, 'stop', {});
        } else if (actionType === 'eraseLayers') {
          this.$set(actionObject, 'eraseLayers', {depths: [null]});
        } else if (actionType === 'gotoAndPlay') {
          this.$set(actionObject, 'gotoAndPlay', {
            destination: null,
          });
        } else if (actionType === 'setTextValue') {
          this.$set(actionObject, 'setTextValue', {
            objectId: null,
            value: null,
          });
        } else if (actionType === 'executeScript') {
          this.$set(actionObject, 'executeScript', {
            content: null,
          });
        } else if (actionType === 'registerGlobalKeydownListener') {
          this.$set(actionObject, 'registerGlobalKeydownListener', {
            componentUserFunctionName: null,
            listenerId: null,
          });
        } else if (actionType === 'unregisterGlobalKeydownListener') {
          this.$set(actionObject, 'unregisterGlobalKeydownListener', {
            listenerId: null,
          });
        } else if (actionType === 'startUserTimer') {
          this.$set(actionObject, 'startUserTimer', {
            componentUserFunctionName: null,
            listenerId: null,
            interval: null,
          });
        } else if (actionType === 'clearUserTimer') {
          this.$set(actionObject, 'clearUserTimer', {
            listenerId: null,
          });
        } else if (actionType === 'callComponentUserFunction') {
          this.$set(actionObject, 'callComponentUserFunction', {
            name: null,
          });
        }
      },
      extractAction(updatedExecuteAction, actionType, rawUpdatedExecuteAction) {
        if (actionType === 'play') {
          updatedExecuteAction['play'] = {};
        } else if (actionType === 'stop') {
          updatedExecuteAction['stop'] = {};
        } else if (actionType === 'eraseLayers') {
          if (rawUpdatedExecuteAction['eraseLayers']['depths'][0] === 'all') {
            updatedExecuteAction['eraseLayers'] = {depths: ['all']};
          } else {
            // TODO: 本当に数値かチェックしてもいいかも
            updatedExecuteAction['eraseLayers'] = {
              depths: [
                Number(rawUpdatedExecuteAction['eraseLayers']['depths'][0]),
              ],
            };
          }
        } else if (actionType === 'gotoAndPlay') {
          updatedExecuteAction['gotoAndPlay'] = {
            destination: rawUpdatedExecuteAction['gotoAndPlay']['destination'],
          };
        } else if (actionType === 'setTextValue') {
          updatedExecuteAction['setTextValue'] = {
            objectId: rawUpdatedExecuteAction['setTextValue']['objectId'],
            value: rawUpdatedExecuteAction['setTextValue']['value'],
          };
        } else if (actionType === 'executeScript') {
          updatedExecuteAction['executeScript'] = {
            content: rawUpdatedExecuteAction['executeScript']['content'],
          };
        } else if (actionType === 'registerGlobalKeydownListener') {
          updatedExecuteAction['registerGlobalKeydownListener'] = {
            listenerId:
              rawUpdatedExecuteAction['registerGlobalKeydownListener'][
                'listenerId'
              ],
            componentUserFunctionName:
              rawUpdatedExecuteAction['registerGlobalKeydownListener'][
                'componentUserFunctionName'
              ],
          };
        } else if (actionType === 'unregisterGlobalKeydownListener') {
          updatedExecuteAction['unregisterGlobalKeydownListener'] = {
            listenerId:
              rawUpdatedExecuteAction['unregisterGlobalKeydownListener'][
                'listenerId'
              ],
          };
        } else if (actionType === 'startUserTimer') {
          updatedExecuteAction['startUserTimer'] = {
            listenerId: rawUpdatedExecuteAction['startUserTimer']['listenerId'],
            componentUserFunctionName:
              rawUpdatedExecuteAction['startUserTimer'][
                'componentUserFunctionName'
              ],
            interval: rawUpdatedExecuteAction['startUserTimer']['interval'],
          };
        } else if (actionType === 'clearUserTimer') {
          updatedExecuteAction['clearUserTimer'] = {
            listenerId: rawUpdatedExecuteAction['clearUserTimer']['listenerId'],
          };
        } else if (actionType === 'callComponentUserFunction') {
          updatedExecuteAction['callComponentUserFunction'] = {
            name: rawUpdatedExecuteAction['callComponentUserFunction']['name'],
          };
        }
      },
      onFrameEventTypeChanged() {
        const frameEventType = this.editingFrameEvent.type;
        const found =
          this.editingTargetFrameEvent &&
          this.editingTargetFrameEvent[frameEventType];
        if (found) {
          this.$set(
            this.editingFrameEvent,
            frameEventType,
            structuredClone(found)
          );
          return;
        }

        const layoutOptions = {
          x: 0,
          y: 0,
          width: 640,
          height: 480,
          rotate: 0,
          rotateOriginX: 0,
          rotateOriginY: 0,
          opacity: 1,
        };

        if (frameEventType === 'defineLabel') {
          this.$set(this.editingFrameEvent, 'defineLabel', {label: null});
        } else if (frameEventType === 'defineComponentUserFunction') {
          this.$set(this.editingFrameEvent, 'defineComponentUserFunction', {
            name: null,
            content: null,
          });
        } else if (frameEventType === 'executeAction') {
          this.$set(this.editingFrameEvent, 'executeAction', {type: null});
        } else if (frameEventType === 'putImage') {
          this.$set(this.editingFrameEvent, 'putImage', {
            assetId: null,
            hoverAssetId: '',
            activeAssetId: '',
          });
          this.$set(this.editingFrameEvent, 'frameCount', 0);
          this.$set(this.editingFrameEvent, 'depth', 1);
          this.$set(
            this.editingFrameEvent,
            'layoutOptions',
            structuredClone(layoutOptions)
          );
        } else if (frameEventType === 'putText') {
          this.$set(this.editingFrameEvent, 'putText', {assetId: null});
          this.$set(this.editingFrameEvent, 'frameCount', 0);
          this.$set(this.editingFrameEvent, 'depth', 1);
          this.$set(
            this.editingFrameEvent,
            'layoutOptions',
            structuredClone(layoutOptions)
          );
        } else if (frameEventType === 'doNothing') {
          this.$set(this.editingFrameEvent, 'doNothing', {});
          this.$set(this.editingFrameEvent, 'frameCount', 1);
          this.$set(this.editingFrameEvent, 'depth', 1);
        }
      },
      onFrameEventActionTypeChanged() {
        const actionType = this.editingFrameEvent.executeAction.type;
        const found =
          this.editingTargetFrameEvent &&
          this.editingTargetFrameEvent['executeAction'] &&
          this.editingTargetFrameEvent['executeAction'][actionType];
        if (found) {
          this.$set(
            this.editingFrameEvent.executeAction,
            actionType,
            structuredClone(found)
          );
          return;
        }

        this.buildAction(this.editingFrameEvent.executeAction, actionType);
      },
      formatLayoutOptions(layoutOptions) {
        return {
          x: Number(layoutOptions.x),
          y: Number(layoutOptions.y),
          width: Number(layoutOptions.width),
          height: Number(layoutOptions.height),
          rotate: Number(layoutOptions.rotate ?? 0),
          rotateOriginX: Number(layoutOptions.rotateOriginX ?? 0),
          rotateOriginY: Number(layoutOptions.rotateOriginY ?? 0),
          opacity: Number(layoutOptions.opacity ?? 1),
        };
      },
      onSubmit() {
        setTimeout(() => {
          // TODO: ここでいらないプロパティを消せるとよい
          const rawUpdatedFrameEvent = this.editingFrameEvent;
          const updatedFrameEvent = {
            type: rawUpdatedFrameEvent['type'],
            frameCount: 0,
          };
          if (
            ['putImage', 'putText', 'doNothing', 'rollback'].includes(
              this.editingFrameEvent.type
            )
          ) {
            updatedFrameEvent['frameCount'] = Number(
              rawUpdatedFrameEvent['frameCount']
            );
          }
          if (['putImage', 'putText'].includes(this.editingFrameEvent.type)) {
            updatedFrameEvent['depth'] = Number(rawUpdatedFrameEvent['depth']);
            updatedFrameEvent['objectId'] = rawUpdatedFrameEvent['objectId'];
            updatedFrameEvent['layoutOptions'] = this.formatLayoutOptions(
              rawUpdatedFrameEvent['layoutOptions']
            );
            if (
              Number(rawUpdatedFrameEvent['frameCount']) >= 2 &&
              rawUpdatedFrameEvent['lastKeyFrame']
            ) {
              updatedFrameEvent['lastKeyFrame'] = {
                layoutOptions: this.formatLayoutOptions(
                  rawUpdatedFrameEvent['lastKeyFrame']['layoutOptions']
                ),
              };
            }

            if (rawUpdatedFrameEvent['onClickAction']) {
              updatedFrameEvent['onClickAction'] = {
                type: rawUpdatedFrameEvent['onClickAction']['type'],
              };
              this.extractAction(
                updatedFrameEvent['onClickAction'],
                rawUpdatedFrameEvent['onClickAction']['type'],
                rawUpdatedFrameEvent['onClickAction']
              );
            }
          }
          if (['putImage'].includes(this.editingFrameEvent.type)) {
            updatedFrameEvent['putImage'] = {
              assetId: Number(rawUpdatedFrameEvent['putImage']['assetId']),
              hoverAssetId: rawUpdatedFrameEvent['putImage']['hoverAssetId']
                ? Number(rawUpdatedFrameEvent['putImage']['hoverAssetId'])
                : null,
              activeAssetId: rawUpdatedFrameEvent['putImage']['activeAssetId']
                ? Number(rawUpdatedFrameEvent['putImage']['activeAssetId'])
                : null,
            };
          }
          if (['putText'].includes(this.editingFrameEvent.type)) {
            updatedFrameEvent['putText'] = {
              assetId: Number(rawUpdatedFrameEvent['putText']['assetId']),
            };
          }
          if (['defineLabel'].includes(this.editingFrameEvent.type)) {
            updatedFrameEvent['defineLabel'] = {
              label: rawUpdatedFrameEvent['defineLabel']['label'],
            };
          }
          if (
            ['defineComponentUserFunction'].includes(
              this.editingFrameEvent.type
            )
          ) {
            updatedFrameEvent['defineComponentUserFunction'] = {
              name: rawUpdatedFrameEvent['defineComponentUserFunction']['name'],
              content:
                rawUpdatedFrameEvent['defineComponentUserFunction']['content'],
            };
          }

          if (['executeAction'].includes(this.editingFrameEvent.type)) {
            const rawUpdatedExecuteAction =
              this.editingFrameEvent.executeAction;
            const actionType = rawUpdatedExecuteAction['type'];
            const updatedExecuteAction = {
              type: actionType,
            };
            this.extractAction(
              updatedExecuteAction,
              actionType,
              rawUpdatedExecuteAction
            );

            if (['stop', 'gotoAndPlay'].includes(actionType)) {
              updatedFrameEvent['frameCount'] = 1;
            }

            updatedFrameEvent['executeAction'] = updatedExecuteAction;
          }

          if (this.editingTargetFrameEvent) {
            const index = this.frameEvents.indexOf(
              this.editingTargetFrameEvent
            );
            if (index === -1) {
              return alert(
                'エラー：入れ替え対象のイベント定義が見つかりません'
              );
            }
            this.$set(this.frameEvents, index, updatedFrameEvent);

            this.selectedAssetId = null;
          } else {
            this.frameEvents.push(updatedFrameEvent);
          }
          this.updateFrameNumbers();
          this.editingTargetFrameEvent = null;
          this.editingFrameEvent = null;
          this.clearSelected();
          this.selectedFrameEvent = updatedFrameEvent; // 編集中は選択中なので選択中の参照も入れ替える
          this.updateEventPreview();
          console.debug(this.selectedFrameEvent);
        }, UI_WAIT_TIME);
      },
      onClickEnableAnimation() {
        const layoutOptions = this.formatLayoutOptions(
          this.editingFrameEvent['layoutOptions']
        );
        this.$set(this.editingFrameEvent, 'lastKeyFrame', {
          layoutOptions,
        });
      },
      onClickCentering() {
        this.editingFrameEvent.layoutOptions.x = Math.floor(
          (640 - this.editingFrameEvent.layoutOptions.width) / 2
        );
      },
      onClickDisableAnimation() {
        this.$set(this.editingFrameEvent, 'lastKeyFrame', undefined);
      },
      onClickEnableClickAction() {
        this.$set(this.editingFrameEvent, 'onClickAction', {
          type: null,
        });
      },
      onClickDisableClickAction() {
        this.$set(this.editingFrameEvent, 'onClickAction', undefined);
      },
      onOnClickActionTypeChanged() {
        const actionType = this.editingFrameEvent.onClickAction['type'];
        this.buildAction(this.editingFrameEvent.onClickAction, actionType);
      },
      onChangeFrameCount() {
        if (Number(this.editingFrameEvent.frameCount) < 2) {
          this.onClickDisableAnimation();
        }
      },
      clickAddTextAsset() {
        this.editingTargetAsset = null;
        this.editingAsset = {
          type: 'text',
          name: null,
          text: {
            content: null,
            fontSize: 16,
            textColor: '#000000',
            padding: 4,
            lineHeight: 24,
            align: 'left',
            htmlEnabled: false,
          },
        };
      },
      selectImageFile(event) {
        const file = event.target.files[0];
        if (!file) {
          return;
        }
        const fileName = file.name.toLowerCase();
        if (
          !(
            fileName.endsWith('png') ||
            fileName.endsWith('jpg') ||
            fileName.endsWith('jpeg') ||
            fileName.endsWith('svg') ||
            fileName.endsWith('webp') ||
            fileName.endsWith('gif')
          )
        ) {
          return alert('非対応の形式です');
        }
        const reader = new FileReader();
        reader.onload = () => {
          if (!this.selectedAsset?.type === 'image') {
            return;
          }
          this.$set(this.editingAsset.image, 'source', reader.result);
        };
        reader.readAsDataURL(file);
      },
      selectAudioFile(event) {
        const file = event.target.files[0];
        if (!file) {
          return;
        }
        const fileName = file.name.toLowerCase();
        if (
          !(
            fileName.endsWith('mp3')
          )
        ) {
          return alert('非対応の形式です');
        }
        const reader = new FileReader();
        reader.onload = () => {
          if (!this.selectedAsset?.type === 'audio') {
            return;
          }
          this.$set(this.editingAsset.audio, 'source', reader.result);
        };
        reader.readAsDataURL(file);
      },
      clickAddImageAsset() {
        this.editingTargetAsset = null;
        this.editingAsset = {
          type: 'image',
          name: null,
          image: {
            source: null,
          },
        };
      },
      clickAddAudioAsset() {
        this.editingTargetAsset = null;
        this.editingAsset = {
          type: 'audio',
          name: null,
          audio: {
            source: null,
          },
        };
      },
      clickEditAsset() {
        if (!this.selectedAsset) {
          return;
        }
        this.editingTargetAsset = this.selectedAsset;
        this.editingAsset = structuredClone(this.selectedAsset);
        if (this.editingAsset?.text?.borderWidth) {
          this.$set(this.editingAsset.text, 'borderEnabled', true);
        }
      },
      clickEnableBackgroundColor() {
        this.$set(this.editingAsset.text, 'backgroundColor', '#000000');
      },
      clickDisableBackgroundColor() {
        this.$set(this.editingAsset.text, 'backgroundColor', undefined);
      },
      clickEnableBorder() {
        this.$set(this.editingAsset.text, 'borderEnabled', true);
        this.$set(this.editingAsset.text, 'borderStyle', 'solid');
        this.$set(this.editingAsset.text, 'borderWidth', '1');
        this.$set(this.editingAsset.text, 'borderColor', '#000000');
      },
      clickDisableBorder() {
        this.$set(this.editingAsset.text, 'borderEnabled', false);
      },
      clickDeleteAsset() {
        if (!this.selectedAssetId) {
          return;
        }
        const referenedEvent = this.checkAssetReference(this.selectedAssetId);
        if (referenedEvent) {
          alert(
            `選択中のアセットはフレーム番号${referenedEvent.scheduledFrameNumber}で使用中のため削除できません。先にイベントを削除してください。`
          );
          return;
        }
        if (confirm('選択中のアセットを削除します')) {
          this.assetsManager.delete(this.selectedAssetId);
          this.reloadAllAssets();
          this.clearSelected();
        }
      },
      clickCancelEditingAsset() {
        this.editingTargetAsset = null;
        this.editingAsset = null;
      },
      extractTextAsset(target, source) {
        this.$set(target, 'type', 'text');
        this.$set(target, 'name', source.name);
        this.$set(target.text, 'content', source.text.content);
        this.$set(target.text, 'fontSize', Number(source.text.fontSize));
        this.$set(target.text, 'textColor', source.text.textColor);
        this.$set(target.text, 'padding', Number(source.text.padding));
        this.$set(target.text, 'lineHeight', Number(source.text.lineHeight));
        this.$set(target.text, 'backgroundColor', source.text.backgroundColor);
        this.$set(target.text, 'align', source.text.align);
        this.$set(target.text, 'fontFamily', source.text.fontFamily);
        this.$set(
          target.text,
          'htmlEnabled',
          source.text.htmlEnabled === 'true'
        );
        if (source.text.borderEnabled) {
          this.$set(
            target.text,
            'borderWidth',
            Number(source.text.borderWidth)
          );
          this.$set(target.text, 'borderStyle', source.text.borderStyle);
          this.$set(target.text, 'borderColor', source.text.borderColor);
        } else {
          this.$set(target.text, 'borderWidth', undefined);
          this.$set(target.text, 'borderStyle', undefined);
          this.$set(target.text, 'borderColor', undefined);
        }
      },
      extractImageAsset(target, source) {
        this.$set(target, 'type', 'image');
        this.$set(target, 'name', source.name);
        this.$set(target.image, 'source', source.image.source);
      },
      extractAudioAsset(target, source) {
        this.$set(target, 'type', 'audio');
        this.$set(target, 'name', source.name);
        this.$set(target.audio, 'source', source.audio.source);
      },
      onSubmitTextAsset() {
        if (this.editingTargetAsset) {
          this.extractTextAsset(this.editingTargetAsset, this.editingAsset);
          this.assetsManager.update(
            this.selectedAssetId,
            this.editingTargetAsset
          );
          this.selectAsset(this.selectedAssetId);
        } else {
          const newAsset = {text: {}};
          this.extractTextAsset(newAsset, this.editingAsset);
          const newId = this.assetsManager.add(newAsset);
          this.reloadAllAssets();
          this.clearSelected();
          this.selectAsset(newId);
        }
        this.editingTargetAsset = null;
        this.editingAsset = null;
      },
      onSubmitImageAsset() {
        if (this.editingTargetAsset) {
          this.extractImageAsset(this.editingTargetAsset, this.editingAsset);
          this.assetsManager.update(
            this.selectedAssetId,
            this.editingTargetAsset
          );
          this.selectAsset(this.selectedAssetId);
        } else {
          const newAsset = {image: {}};
          this.extractImageAsset(newAsset, this.editingAsset);
          const newId = this.assetsManager.add(newAsset);
          this.reloadAllAssets();
          this.clearSelected();
          this.selectAsset(newId);
        }
        this.editingTargetAsset = null;
        this.editingAsset = null;
      },
      onSubmitAudioAsset() {
        if (this.editingTargetAsset) {
          this.extractAudioAsset(this.editingTargetAsset, this.editingAsset);
          this.assetsManager.update(
            this.selectedAssetId,
            this.editingTargetAsset
          );
          this.selectAsset(this.selectedAssetId);
        } else {
          const newAsset = {audio: {}};
          this.extractAudioAsset(newAsset, this.editingAsset);
          const newId = this.assetsManager.add(newAsset);
          this.reloadAllAssets();
          this.clearSelected();
          this.selectAsset(newId);
        }
        this.editingTargetAsset = null;
        this.editingAsset = null;
      },
      reloadAllAssets() {
        this.allIdToAsset = this.assetsManager.allIdToAsset();
      },
      checkAssetReference(assetId) {
        return this.frameEvents.find(frameEvent => {
          if (frameEvent.putText?.assetId === assetId) {
            return true;
          }
          if (frameEvent.putImage?.assetId === assetId) {
            return true;
          }
          if (frameEvent.putImage?.hoverAssetId === assetId) {
            return true;
          }
          if (frameEvent.putImage?.activeAssetId === assetId) {
            return true;
          }
          return false;
        });
      },
      clearSelected() {
        this.selectedAssetId = null;
        this.selectedFrameEvent = null;
      },
      generatWorkspaceJson() {
        return {
          frameEvents: this.frameEvents,
          allIdToAsset: this.assetsManager.allIdToAsset(),
          settings: {
            width: 640,
            height: 480,
            fps: 20,
          },
        };
      },
      downloadWorkspace() {
        const data = {
          app: 'parahtml',
          version: 1,
          workspace: this.generatWorkspaceJson(),
        };

        const blob = new Blob([JSON.stringify(data, null, '  ')], {
          type: 'application/json',
        });
        this.downloadUrl = URL.createObjectURL(blob);
      },
      selectWorkspaceFile(event) {
        const file = event.target.files[0];
        if (!file) {
          return;
        }
        const fileName = file.name.toLowerCase();
        if (!fileName.endsWith('json')) {
          return alert('非対応の形式です');
        }
        const reader = new FileReader();
        reader.onload = () => {
          const json = JSON.parse(reader.result);
          if (json['app'] !== 'parahtml') {
            alert('非対応の形式です');
          }
          this.loadWorkspace(json['workspace']);
          this.importingWorkspace = false;
        };
        reader.readAsText(file);
      },
      checkScript(scriptContent) {
        try {
          new Function('context', 'args', scriptContent);
          alert('構文エラーはありません');
        } catch (e) {
          alert(`エラー：${e}`);
        }
      },
      calcImageSize() {
        const imageSource = this.assetsManager.find(
          this.editingFrameEvent['putImage']?.assetId
        )?.image?.source;
        if (!imageSource) {
          alert('画像が取得できませんでした');
        }
        return new Promise(resolver => {
          const imageElement = document.createElement('img');
          imageElement.src = imageSource;
          imageElement.onload = function () {
            resolver([imageElement.naturalWidth, imageElement.naturalHeight]);
          };
        });
      },
      async onClickAutoWidth() {
        const size = await this.calcImageSize();
        if (!this.editingFrameEvent.layoutOptions) {
          return;
        }
        const height = this.editingFrameEvent.layoutOptions.height;
        if (height) {
          const width = (Number(height) / size[1]) * size[0];
          this.$set(
            this.editingFrameEvent.layoutOptions,
            'width',
            Math.round(width)
          );
        }
      },
      async onClickAutoHeight() {
        const size = await this.calcImageSize();
        if (!this.editingFrameEvent.layoutOptions) {
          return;
        }
        const width = this.editingFrameEvent.layoutOptions.width;
        if (width) {
          const height = (Number(width) / size[0]) * size[1];
          this.$set(
            this.editingFrameEvent.layoutOptions,
            'height',
            Math.round(height)
          );
        }
      },
    },
    computed: {
      selectedAsset() {
        if (!this.selectedAssetId) {
          return null;
        }
        return this.assetsManager.find(this.selectedAssetId);
      },
      modalEventPreviewAvailable() {
        return ['putImage', 'putText'].includes(this.editingFrameEvent?.type);
      },
      selectedEventPreviewAvailable() {
        return ['putImage', 'putText'].includes(this.selectedFrameEvent?.type);
      },
      textAssetIds() {
        return Object.keys(this.allIdToAsset).filter(
          assetId => this.allIdToAsset[assetId]['type'] === 'text'
        );
      },
      imageAssetIds() {
        return Object.keys(this.allIdToAsset).filter(
          assetId => this.allIdToAsset[assetId]['type'] === 'image'
        );
      },
      allLabelNames() {
        return this.frameEvents
          .map(event => event['defineLabel'] && event['defineLabel']['label'])
          .filter(item => item);
      },
      allUserFunctionNames() {
        return this.frameEvents
          .map(
            event =>
              event['defineComponentUserFunction'] &&
              event['defineComponentUserFunction']['name']
          )
          .filter(item => item);
      },
    },
    data: {
      frameEvents: [],
      started: false,
      assetsManager: new AssetsManager(),
      objectBuilder: new ObjectBuilder(),
      selectedAssetId: null,
      selectedFrameEvent: null,
      editingTargetFrameEvent: null,
      editingFrameEvent: null,
      editingTargetAsset: null,
      editingAsset: null,
      allIdToAsset: {},
      downloadUrl: null,
      importingWorkspace: false,
    },
    watch: {
      editingFrameEvent: {
        deep: true,
        handler() {
          this.updateModalEventPreview();
        },
      },
    },
    mounted() {},
  });
}
