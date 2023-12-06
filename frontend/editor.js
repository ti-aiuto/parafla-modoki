const UI_WAIT_TIME = 50; // 気持ち遅らせたほうが違和感ないので待つ

function initEditor() {
  const eventTypeTable = {
    defineLabel: "ラベルを定義",
    defineComponentUserFunction: "ユーザ関数を定義",
    executeAction: "アクションを実行",
    putImage: "画像を配置",
    putText: "テキストを配置",
    doNothing: "何もしない",
  };
  const actionTypeTable = {
    eraseLayers: "指定深度を消去",
    play: "再生",
    stop: "停止",
    gotoAndPlay: "指定ラベルにジャンプして再生",
    setTextValue: "テキストの表示内容を更新",
    callComponentUserFunction: "ユーザ関数を呼び出し",
    registerGlobalKeydownListener: "キー押下リスナーを登録",
    unregisterGlobalKeydownListener: "キー押下リスナーを登録解除",
    startUserTimer: "タイマーを開始",
    clearUserTimer: "タイマーを解除",
  };

  new Vue({
    el: "#vue_root",
    methods: {
      updateFrameNumbers() {
        let frameNumber = 1;
        this.frameEvents.forEach(function (frameEvent) {
          frameEvent["scheduledFrameNumber"] = frameNumber;
          frameNumber += frameEvent.frameCount;
        });
      },
      selectStory() {
        this.frameEvents = structuredClone(window.frameEventsTyping);
        // this.frameEvents = [];
        this.updateFrameNumbers();
      },
      start() {
        this.started = true;
      },
      eventTypeI18n(event) {
        let content = eventTypeTable[event.type];
        if (event.type === "defineLabel") {
          content += `「${event["defineLabel"]["label"]}」`;
        } else if (event.type === "defineComponentUserFunction") {
          content += `「${event["defineComponentUserFunction"]["name"]}」`;
        } else if (event.type === "putImage" || event.type === "putText") {
          if (event.lastKeyFrame) {
            content += "\n※アニメーションあり";
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
        if (action["type"] === "eraseLayers") {
          content += `\n(深度: ${action["eraseLayers"]["depths"].join(",")})`;
        } else if (action["type"] === "gotoAndPlay") {
          content += `\n(行先: 「${action["gotoAndPlay"]["destination"]}」)`;
        } else if (action["type"] === "setTextValue") {
          content += `\n(対象: ${action["setTextValue"]["objectId"]})`;
        } else if (action["type"] === "callComponentUserFunction") {
          content += `\n(ユーザ関数名: ${action["callComponentUserFunction"]["name"]})`;
        } else if (action["type"] === "registerGlobalKeydownListener") {
          content += `\n(リスナーID: ${action["registerGlobalKeydownListener"]["listenerId"]})`;
        } else if (action["type"] === "unregisterGlobalKeydownListener") {
          content += `\n(リスナーID: ${action["unregisterGlobalKeydownListener"]["listenerId"]})`;
        } else if (action["type"] === "startUserTimer") {
          content += `\n(リスナーID: ${action["startUserTimer"]["listenerId"]})`;
        } else if (action["type"] === "clearUserTimer") {
          content += `\n(リスナーID: ${action["clearUserTimer"]["listenerId"]})`;
        }
        return content;
      },
      frameEventRowStyle(row) {
        if (row === this.selectedFrameEvent) {
          return { color: "#fff", "background-color": "#0000cd" };
        }

        if (row["type"] === "defineLabel") {
          return { "background-color": "#E6FFE9" };
        }
        if (row["onClickAction"]) {
          return { "background-color": "#FFEEFF" };
        }
      },
      assetRowStyle(assetId) {
        if (assetId === this.selectedAssetId) {
          return { color: "#fff", "background-color": "#0000cd" };
        }
      },
      selectAsset(assetId) {
        this.selectedAssetId = assetId;
        this.selectedFrameEvent = null;
        if (this.selectedAsset?.type === "text") {
          this.updateTextAssetPreview();
        }
      },
      updateTextAssetPreview() {
        const wrapper = this.$refs.textWrapper;
        if (wrapper.firstChild) {
          wrapper.removeChild(wrapper.firstChild);
        }
        const previewElement = document.createElement("div");
        wrapper.appendChild(previewElement);
        this.objectBuilder.updateText(previewElement, this.selectedAsset.text);
      },
      buildFrameEventElement(previewElement, styleElement, frameEvent, fullObjectId) {
        if (frameEvent.type === "putImage") {
          const putImageEvent = frameEvent["putImage"];
          const image = {
            image: this.assetsManager.find(putImageEvent.assetId)?.image, // TODO: なかった場合
            hoverImage: this.assetsManager.find(putImageEvent.hoverAssetId)
              ?.image,
            activeImage: this.assetsManager.find(putImageEvent.activeAssetId)
              ?.image,
          };
          if (!image.image) {
            return alert("画像不明");
          }
          this.objectBuilder.initImage(styleElement, fullObjectId, image);
          previewElement.dataset.fullObjectId = fullObjectId;
          this.objectBuilder.setLayoutOptionsToElement(
            previewElement,
            frameEvent.layoutOptions
          );
        } else if (frameEvent.type === "putText") {
          const putTextEvent = frameEvent["putText"];
          const text = this.assetsManager.find(putTextEvent.assetId)?.text; // TODO: なかった場合
          if (!text) {
            return alert("画像不明");
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
        const previewElement = document.createElement("div");
        const styleElement = document.createElement("style");
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
        const previewElement = document.createElement("div");
        const styleElement = document.createElement("style");
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
        this.selectedAssetId = null;
        this.selectedFrameEvent = frameEvent;
        this.updateEventPreview();
      },
      openPreview() {
        const previewWindow = open("./preview.html", "preview");
        // 受け取れてるかわからないので繰り返し送信する
        let count = 0;
        const timerId = setInterval(() => {
          previewWindow.postMessage(JSON.stringify(this.frameEvents), "*");
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
          this.editingFrameEvent = { type: null };
        }, UI_WAIT_TIME);
      },
      clickRemoveFrameEvent() {
        if (!this.selectedFrameEvent) {
          return;
        }
        setTimeout(() => {
          if (confirm("選択されたイベントを削除します")) {
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
      buildAction(actionObject, actionType) {
        if (actionType === "play") {
          this.$set(actionObject, "play", {});
        } else if (actionType === "stop") {
          this.$set(actionObject, "stop", {});
        } else if (actionType === "eraseLayers") {
          this.$set(actionObject, "eraseLayers", { depths: [null] });
        } else if (actionType === "gotoAndPlay") {
          this.$set(actionObject, "gotoAndPlay", {
            destination: null,
          });
        } else if (actionType === "setTextValue") {
          this.$set(actionObject, "setTextValue", {
            objectId: null,
            value: null,
          });
        } else if (actionType === "registerGlobalKeydownListener") {
          this.$set(actionObject, "registerGlobalKeydownListener", {
            componentUserFunctionName: null,
            listenerId: null,
          });
        } else if (actionType === "unregisterGlobalKeydownListener") {
          this.$set(actionObject, "unregisterGlobalKeydownListener", {
            listenerId: null,
          });
        } else if (actionType === "startUserTimer") {
          this.$set(actionObject, "startUserTimer", {
            componentUserFunctionName: null,
            listenerId: null,
            interval: null,
          });
        } else if (actionType === "clearUserTimer") {
          this.$set(actionObject, "clearUserTimer", {
            listenerId: null,
          });
        } else if (actionType === "callComponentUserFunction") {
          this.$set(actionObject, "callComponentUserFunction", {
            name: null,
          });
        }
      },
      extractAction(updatedExecuteAction, actionType, rawUpdatedExecuteAction) {
        if (actionType === "play") {
          updatedExecuteAction["play"] = {};
        } else if (actionType === "stop") {
          updatedExecuteAction["stop"] = {};
        } else if (actionType === "eraseLayers") {
          if (rawUpdatedExecuteAction["eraseLayers"]["depths"][0] === "all") {
            updatedExecuteAction["eraseLayers"] = { depths: ["all"] };
          } else {
            // TODO: 本当に数値かチェックしてもいいかも
            updatedExecuteAction["eraseLayers"] = {
              depths: [
                Number(rawUpdatedExecuteAction["eraseLayers"]["depths"][0]),
              ],
            };
          }
        } else if (actionType === "gotoAndPlay") {
          updatedExecuteAction["gotoAndPlay"] = {
            destination: rawUpdatedExecuteAction["gotoAndPlay"]["destination"],
          };
        } else if (actionType === "setTextValue") {
          updatedExecuteAction["setTextValue"] = {
            objectId: rawUpdatedExecuteAction["setTextValue"]["objectId"],
            value: rawUpdatedExecuteAction["setTextValue"]["value"],
          };
        } else if (actionType === "registerGlobalKeydownListener") {
          updatedExecuteAction["registerGlobalKeydownListener"] = {
            listenerId:
              rawUpdatedExecuteAction["registerGlobalKeydownListener"][
                "listenerId"
              ],
            componentUserFunctionName:
              rawUpdatedExecuteAction["registerGlobalKeydownListener"][
                "componentUserFunctionName"
              ],
          };
        } else if (actionType === "unregisterGlobalKeydownListener") {
          updatedExecuteAction["unregisterGlobalKeydownListener"] = {
            listenerId:
              rawUpdatedExecuteAction["unregisterGlobalKeydownListener"][
                "listenerId"
              ],
          };
        } else if (actionType === "startUserTimer") {
          updatedExecuteAction["startUserTimer"] = {
            listenerId: rawUpdatedExecuteAction["startUserTimer"]["listenerId"],
            componentUserFunctionName:
              rawUpdatedExecuteAction["startUserTimer"][
                "componentUserFunctionName"
              ],
            interval: rawUpdatedExecuteAction["startUserTimer"]["interval"],
          };
        } else if (actionType === "clearUserTimer") {
          updatedExecuteAction["clearUserTimer"] = {
            listenerId: rawUpdatedExecuteAction["clearUserTimer"]["listenerId"],
          };
        } else if (actionType === "callComponentUserFunction") {
          updatedExecuteAction["callComponentUserFunction"] = {
            name: rawUpdatedExecuteAction["callComponentUserFunction"]["name"],
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
        };

        if (frameEventType === "defineLabel") {
          this.$set(this.editingFrameEvent, "defineLabel", { label: null });
        } else if (frameEventType === "defineComponentUserFunction") {
          this.$set(this.editingFrameEvent, "defineComponentUserFunction", {
            name: null,
            content: null,
          });
        } else if (frameEventType === "executeAction") {
          this.$set(this.editingFrameEvent, "executeAction", { type: null });
        } else if (frameEventType === "putImage") {
          this.$set(this.editingFrameEvent, "putImage", {
            assetId: null,
            hoverAssetId: null,
            activeAssetId: null,
          });
          this.$set(this.editingFrameEvent, "frameCount", 0);
          this.$set(this.editingFrameEvent, "depth", 1);
          this.$set(
            this.editingFrameEvent,
            "layoutOptions",
            structuredClone(layoutOptions)
          );
        } else if (frameEventType === "putText") {
          this.$set(this.editingFrameEvent, "putText", { assetId: null });
          this.$set(this.editingFrameEvent, "frameCount", 0);
          this.$set(this.editingFrameEvent, "depth", 1);
          this.$set(
            this.editingFrameEvent,
            "layoutOptions",
            structuredClone(layoutOptions)
          );
        } else if (frameEventType === "doNothing") {
          this.$set(this.editingFrameEvent, "doNothing", {});
          this.$set(this.editingFrameEvent, "frameCount", 1);
          this.$set(this.editingFrameEvent, "depth", 1);
        }
      },
      onFrameEventActionTypeChanged() {
        const actionType = this.editingFrameEvent.executeAction.type;
        const found =
          this.editingTargetFrameEvent &&
          this.editingTargetFrameEvent["executeAction"] &&
          this.editingTargetFrameEvent["executeAction"][actionType];
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
      onSubmit() {
        setTimeout(() => {
          // TODO: ここでいらないプロパティを消せるとよい
          const rawUpdatedFrameEvent = this.editingFrameEvent;
          const updatedFrameEvent = {
            type: rawUpdatedFrameEvent["type"],
            frameCount: 0,
          };
          if (
            ["putImage", "putObject", "doNothing"].includes(
              this.editingFrameEvent.type
            )
          ) {
            updatedFrameEvent["frameCount"] = Number(
              rawUpdatedFrameEvent["frameCount"]
            );
          }
          if (["putImage", "putText"].includes(this.editingFrameEvent.type)) {
            updatedFrameEvent["depth"] = Number(rawUpdatedFrameEvent["depth"]);
            updatedFrameEvent["objectId"] = rawUpdatedFrameEvent["objectId"];
            updatedFrameEvent["layoutOptions"] = structuredClone(
              rawUpdatedFrameEvent["layoutOptions"]
            );
            if (
              Number(rawUpdatedFrameEvent["frameCount"]) >= 2 &&
              rawUpdatedFrameEvent["lastKeyFrame"]
            ) {
              updatedFrameEvent["lastKeyFrame"] = structuredClone(
                rawUpdatedFrameEvent["lastKeyFrame"]["layoutOptions"]
              );
            }

            if (rawUpdatedFrameEvent["onClickAction"]) {
              updatedFrameEvent["onClickAction"] = {
                type: rawUpdatedFrameEvent["onClickAction"]["type"],
              };
              this.extractAction(
                updatedFrameEvent["onClickAction"],
                rawUpdatedFrameEvent["onClickAction"]["type"],
                rawUpdatedFrameEvent["onClickAction"]
              );
            }
          }
          if (["putImage"].includes(this.editingFrameEvent.type)) {
            updatedFrameEvent["putImage"] = {
              assetId: rawUpdatedFrameEvent["putImage"]["assetId"],
              hoverAssetId: rawUpdatedFrameEvent["putImage"]["hoverAssetId"],
              activeAassetId:
                rawUpdatedFrameEvent["putImage"]["activeAassetId"],
            };
          }
          if (["putText"].includes(this.editingFrameEvent.type)) {
            updatedFrameEvent["putText"] = {
              assetId: rawUpdatedFrameEvent["putText"]["assetId"],
            };
          }
          if (["defineLabel"].includes(this.editingFrameEvent.type)) {
            updatedFrameEvent["defineLabel"] = {
              label: rawUpdatedFrameEvent["defineLabel"]["label"],
            };
          }
          if (
            ["defineComponentUserFunction"].includes(
              this.editingFrameEvent.type
            )
          ) {
            updatedFrameEvent["defineComponentUserFunction"] = {
              name: rawUpdatedFrameEvent["defineComponentUserFunction"]["name"],
              content:
                rawUpdatedFrameEvent["defineComponentUserFunction"]["content"],
            };
          }

          if (["executeAction"].includes(this.editingFrameEvent.type)) {
            const rawUpdatedExecuteAction =
              this.editingFrameEvent.executeAction;
            const actionType = rawUpdatedExecuteAction["type"];
            const updatedExecuteAction = {
              type: actionType,
            };
            this.extractAction(
              updatedExecuteAction,
              actionType,
              rawUpdatedExecuteAction
            );

            if (["stop", "gotoAndPlay"].includes(actionType)) {
              updatedFrameEvent["frameCount"] = 1;
            }

            updatedFrameEvent["executeAction"] = updatedExecuteAction;
          }

          if (this.editingTargetFrameEvent) {
            const index = this.frameEvents.indexOf(
              this.editingTargetFrameEvent
            );
            if (index === -1) {
              return alert(
                "エラー：入れ替え対象のイベント定義が見つかりません"
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
          this.selectedFrameEvent = updatedFrameEvent; // 編集中は選択中なので選択中の参照も入れ替える
        }, UI_WAIT_TIME);
      },
      onClickEnableAnimation() {
        const layoutOptions = {
          x: 0,
          y: 0,
          width: 640,
          height: 480,
        };
        this.$set(this.editingFrameEvent, "lastKeyFrame", {
          layoutOptions,
        });
      },
      onClickDisableAnimation() {
        this.$set(this.editingFrameEvent, "lastKeyFrame", undefined);
      },
      onClickEnableClickAction() {
        this.$set(this.editingFrameEvent, "onClickAction", {
          type: null,
        });
      },
      onClickDisableClickAction() {
        this.$set(this.editingFrameEvent, "onClickAction", undefined);
      },
      onOnClickActionTypeChanged() {
        const actionType = this.editingFrameEvent.onClickAction["type"];
        this.buildAction(this.editingFrameEvent.onClickAction, actionType);
      },
      onChangeFrameCount() {
        if (Number(this.editingFrameEvent.frameCount) < 2) {
          this.onClickDisableAnimation();
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
        return ["putImage", "putText"].includes(this.editingFrameEvent?.type);
      },
      selectedEventPreviewAvailable() {
        return ["putImage", "putText"].includes(this.selectedFrameEvent?.type);
      }
    },
    data: {
      frameEvents: null,
      started: false,
      assetsManager: assetsManager,
      objectBuilder: new ObjectBuilder(),
      selectedAssetId: null,
      selectedFrameEvent: null,
      editingTargetFrameEvent: null,
      editingFrameEvent: null,
    },
    watch: {
      editingFrameEvent: {
        deep: true,
        handler() {
          this.updateModalEventPreview();
        },
      },
    },
    mounted() {
      this.selectStory();
    },
  });
}
