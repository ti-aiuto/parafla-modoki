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
    stop: "停止",
    gotoAndPlay: "指定ラベルにジャンプして再生",
    setTextValue: "テキストの表示内容を更新",
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
        // this.frameEvents = structuredClone(window.frameEventsTyping);
        this.frameEvents = [];
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
        }
        return content;
      },
      resourcePreviewImage(resourceId) {
        return null;
        // return userResources[resourceId]["image"]["source"];
      },
      resourcePreviewText(resourceId) {
        return null;
        // return userResources[resourceId]["text"]["content"];
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
        this.selectedFrameIndex = null;
      },
      selectFrameEvent(frameEvent) {
        this.selectedAssetId = null;
        this.selectedFrameEvent = frameEvent;
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
        }, 50);
      },
      clickCancelEditing() {
        setTimeout(() => {
          this.editingTargetFrameEvent = null;
          this.editingFrameEvent = null;
        }, 50);
      },
      clickNewFrameEvent() {

      },
      onFrameEventTypeChanged() {},
      onFrameEventActionTypeChanged() {},
    },
    data: {
      frameEvents: null,
      started: false,
      assetsManager: assetsManager,
      selectedAssetId: null,
      selectedFrameEvent: null,
      editingTargetFrameEvent: null,
      editingFrameEvent: null,
    },
    mounted() {
      this.selectStory();
    },
  });
}
