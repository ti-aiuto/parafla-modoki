function initEditor() {
  const eventTypeTable = {
    defineLabel: "ラベルを定義",
    defineComponentUserFunction: "ユーザ関数を定義",
    executeAction: "アクションを実行",
    putImage: "画像を表示",
    putText: "テキストを表示",
    doNothing: "何もしない",
  };
  const actionTypeTable = {
    eraseLayers: "指定深度を消去",
    stop: "停止",
    gotoAndPlay: "指定位置にジャンプして再生",
    setTextValue: "テキストの表示内容を更新",
  };

  new Vue({
    el: "#vue_root",
    methods: {
      selectStory(key) {
        this.frameEvents = structuredClone(window.frameEventsTyping);

        let frameNumber = 1;
        this.frameEvents.forEach(function (frameEvent) {
          frameEvent["scheduledFrameNumber"] = frameNumber;
          frameNumber += frameEvent.frameCount;
        });
      },
      start() {
        this.started = true;
        main(this.frameEvents);
      },
      eventTypeI18n(event) {
        let content = eventTypeTable[event.type];
        if (event.type === "defineLabel") {
          content += `\n「${event["defineLabel"]["label"]}」`;
        } else if (event.type === "defineComponentUserFunction") {
          content += `\n「${event["defineComponentUserFunction"]["name"]}」`;
        } else if (event.type === "putImage" || event.type === "putText") {
          if (event.lastKeyFrame) {
            content += '\n※アニメーションあり';
          }
          if (event.objectId) {
            content += `\n(オブジェクトID: ${event.objectId} アセットID: ${event.putImage?.assetId || event.putText?.assetId})`;
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
          content += `\n(深度: ${action["eraseLayers"]["depths"].join(',')})`;
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
      frameEventRowStyle(row, index) {
        if (index === this.selectedFrameIndex) {
          return {'color': '#fff', 'background-color': '#0000cd'};
        }

        if (row["type"] === "defineLabel") {
          return {'background-color': "#E6FFE9"};
        }
        if (row["onClickAction"]) {
          return {'background-color': "#FFEEFF"};
        }
      }, 
      assetRowStyle(assetId) {
        if (assetId === this.selectedAssetId) {
          return {'color': '#fff', 'background-color': '#0000cd'};
        }
      },
      selectAsset(assetId) {
        this.selectedAssetId = assetId;
        this.selectedFrameIndex = null;
      }, 
      selectFrameEvent(index) {
        this.selectedAssetId = null;
        this.selectedFrameIndex = index;
      }
    },
    data: {
      frameEvents: null,
      started: false,
      assetsManager: assetsManager,
      selectedAssetId: null,
      selectedFrameIndex: null
    },
    mounted() {
      this.selectStory();
    }
  });
}
