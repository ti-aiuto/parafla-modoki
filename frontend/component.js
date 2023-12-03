const Component = function (
  rootController,
  componentSource,
  screenObjectsManager,
  renderer,
  assetsManager
) {
  const instance = {};

  instance.rootController = rootController;
  instance.componentSource = componentSource;
  instance.screenObjectsManager = screenObjectsManager;
  instance.assetsManager = assetsManager;

  instance.currentFrameCount = 1;
  instance.jumpToFrameCount = null;
  instance.lastFrameCount = Math.max.apply(
    null,
    Object.keys(instance.componentSource.scheduledEvents)
  );
  instance.rootInstanceId = "rootDummyHoge";
  instance.renderer = renderer;

  instance.findAssetById = function (id) {
    return instance.assetsManager.find(id);
  };

  instance.play = function () {
    instance.stop();
    instance.timerId = setInterval(this.tick, 50);
  };
  instance.stop = function () {
    clearInterval(instance.timerId);
  };

  instance.generateFullObjectId = function (objectId) {
    return `${instance.rootInstanceId}_${objectId}`;
  };

  instance.eraseLayers = function (depths) {
    instance.screenObjectsManager.eraseLayers(depths);
  };

  instance.gotoAndPlay = function (destination) {
    // TODO: 本当はここでバリデーションが必要
    if (typeof destination === "string") {
      const label = instance.componentSource.labelToFrameNumber[destination];
      console.log("ラベル解決", destination, label);
      instance.jumpToFrameCount = Number(label);
    } else {
      instance.jumpToFrameCount = destination;
    }
    instance.play();
  };

  instance.handleAction = function (action) {
    const context = {
      play() {
        instance.play();
      },
      stop() {
        instance.stop();
      },
      gotoAndPlay(destination) {
        instance.gotoAndPlay(destination);
      },
      eraseLayers(depths) {
        instance.eraseLayers(depths);
      },
      setUserVariable(key, value, updateBinding = true) {
        instance.setUserVariable(key, value);
      },
      getUserVariable(key, defaultValue) {
        return instance.getUserVariable(key, defaultValue);
      },
      setTextValue(objectId, value) {
        instance.setTextValue(objectId, value);
      },
      getTextValue(objectId) {
        return instance.getTextValue(objectId);
      },
    };

    if (action.type === "eraseLayers") {
      context.eraseLayers(action.eraseLayers.depths);
    } else if (action.type === "stop") {
      context.stop();
    } else if (action.type === "play") {
      context.play();
    } else if (action.type === "gotoAndPlay") {
      context.gotoAndPlay(action.gotoAndPlay.destination);
    } else if (action.type === "executeScript") {
      const func = new Function("context", action.executeScript.content);
      func(context);
    } else if (action.type === "putObject") {
      let objectBase = null;
      const putObject = action["putObject"];
      const fullObjectId = instance.generateFullObjectId(putObject.objectId);
      // ここの種別は、画像・テキスト・HTML要素・音声・スプライトなどを想定
      if (putObject.type === "image") {
        objectBase = {
          type: "image",
          image: structuredClone(
            instance.findAssetById(putObject.image.resourceId)["image"]
          ),
          fullObjectId,
        };
      } else if (putObject.type === "text") {
        objectBase = {
          type: "text",
          text: structuredClone(
            instance.findAssetById(putObject.text.resourceId)["text"]
          ),
          fullObjectId,
        };
      }

      const depth = putObject.depth;
      if (putObject.frameCountIndex <= 1) {
        // 0または1
        // TODO: ここでdepthあるかの判定
        instance.screenObjectsManager.depthToLayer[depth] = {
          object: {
            ...objectBase,
            layoutOptions: putObject.layoutOptions,
          },
        };
      } else {
        const before = putObject.layoutOptions;
        const after = putObject.lastKeyFrame.layoutOptions;

        // TODO: ここでdepthあるかの判定
        instance.screenObjectsManager.depthToLayer[depth] = {
          object: {
            ...objectBase,
            layoutOptions: {
              x:
                before.x +
                (putObject.frameCountIndex * (after.x - before.x)) /
                  putObject.frameCount,
              y:
                before.y +
                (putObject.frameCountIndex * (after.y - before.y)) /
                  putObject.frameCount,
              width:
                before.width +
                (putObject.frameCountIndex * (after.width - before.width)) /
                  putObject.frameCount,
              height:
                before.height +
                (putObject.frameCountIndex * (after.height - before.height)) /
                  putObject.frameCount,
            },
          },
        };
      }
      instance.render();

      if (putObject["onClickAction"]) {
        instance.rootController.registerClickAction(
          fullObjectId,
          instance,
          putObject["onClickAction"]
        );
      }
    }
  };

  // instance.setTextValue = function (objectId, value) {
  //   for ({ object } of Object.values(instance.depthToLayer)) {
  //     if (!object) {
  //       continue;
  //     }
  //     if (
  //       object.fullObjectId === instance.generateFullObjectId(objectId)
  //     ) {
  //       object.text.content = value;
  //       break;
  //     }
  //   }
  //   instance.render();
  // };

  // instance.getTextValue = function (objectId) {
  //   for ({ object } of Object.values(instance.depthToLayer)) {
  //     if (!object) {
  //       continue;
  //     }
  //     if (
  //       object.fullObjectId === instance.generateFullObjectId(objectId)
  //     ) {
  //       return object.text.content;
  //     }
  //   }
  //   return undefined;
  // };

  instance.render = function () {
    instance.renderer.render(instance.screenObjectsManager);
  };

  instance.tick = function () {
    // 最後まで行ったら最初に戻る（判定これでいいのかな？）
    if (instance.currentFrameCount > instance.lastFrameCount) {
      instance.currentFrameCount = 1;
    }

    // 飛び先が指定されていたらそっちにいく
    if (instance.jumpToFrameCount !== null) {
      instance.currentFrameCount = instance.jumpToFrameCount;
      instance.jumpToFrameCount = null;
    }

    const currentScheduledFrameEvents =
      instance.componentSource.scheduledEvents[instance.currentFrameCount] ||
      [];

    currentScheduledFrameEvents.forEach(function (scheduledFrameEvent) {
      if (instance.jumpToFrameCount !== null) {
        return; // frameCount>1のイベントよりも前にgotoAndPlayを実行していた場合は先に飛ぶ
      }

      const event = scheduledFrameEvent.event;

      if (event.type === "executeAction") {
        console.log("executeAction", event.executeAction);
        instance.handleAction(event.executeAction);
      }

      if (event.type === "putImage" || event.type === "putText") {
        const putObjectBase = {
          depth: event.depth,
          layoutOptions: event.layoutOptions,
          lastKeyFrame: event.lastKeyFrame,
          frameCount: scheduledFrameEvent.event.frameCount,
          frameCountIndex: scheduledFrameEvent.frameCountInEvent,
          objectId: scheduledFrameEvent.objectId,
          onClickAction: scheduledFrameEvent.event.onClickAction,
        };

        if (event.type === "putImage") {
          instance.handleAction({
            type: "putObject",
            putObject: {
              ...putObjectBase,
              type: "image",
              image: event.putImage,
            },
          });
        } else if (event.type === "putText") {
          instance.handleAction({
            type: "putObject",
            putObject: {
              ...putObjectBase,
              type: "text",
              text: event.putText,
            },
          });
        }
      }
    });

    instance.currentFrameCount += 1;
  };

  return instance;
};
