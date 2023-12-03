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

  // instance.eraseLayers = function (depths) {
  //   if (depths.includes("all")) {
  //     Object.keys(instance.depthToLayer).forEach(function (eachDepth) {
  //       instance.depthToLayer[eachDepth] = undefined;
  //     });
  //   } else {
  //     depths.forEach(function (eachDepth) {
  //       instance.depthToLayer[eachDepth] = undefined;
  //     });
  //   }
  // };
  // instance.gotoAndPlay = function (destination) {
  //   // TODO: 本当はここでバリデーションが必要
  //   if (typeof destination === "string") {
  //     const label = instance.labelToFrameCount[destination];
  //     console.log("ラベル解決", destination, label);
  //     instance.jumpToFrameCount = Number(label);
  //   } else {
  //     instance.jumpToFrameCount = destination;
  //   }
  //   instance.play();
  // };

  instance.handleAction = function (action) {
    const context = {
      play() {
        controller.play();
      },
      stop() {
        controller.stop();
      },
      gotoAndPlay(destination) {
        controller.gotoAndPlay(destination);
      },
      eraseLayers(depths) {
        controller.eraseLayers(depths);
      },
      setUserVariable(key, value, updateBinding = true) {
        controller.setUserVariable(key, value);
      },
      getUserVariable(key, defaultValue) {
        return controller.getUserVariable(key, defaultValue);
      },
      setTextValue(objectId, value) {
        controller.setTextValue(objectId, value);
      },
      getTextValue(objectId) {
        return controller.getTextValue(objectId);
      },
    };

    // stop, gotoAndPlayはframeCountが1になる
    // defineLabel, eraseLayersはframeCountは0
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
      const depth = event.depth;

      if (event.type === "putImage" || event.type === "putText") {
        let objectBase = null;
        // ここの種別は、画像・テキスト・HTML要素・音声・スプライトなどを想定
        if (event.type === "putImage") {
          objectBase = {
            type: "image",
            image: structuredClone(
              instance.findAssetById(event.putImage.resourceId)["image"]
            ),
            onClickAction: event.onClickAction,
            fullObjectId: instance.generateFullObjectId(
              scheduledFrameEvent.objectId
            ),
          };
        } else if (event.type === "putText") {
          objectBase = {
            type: "text",
            text: structuredClone(
              instance.findAssetById(event.putText.resourceId)["text"]
            ),
            onClickAction: event.onClickAction,
            fullObjectId: instance.generateFullObjectId(
              scheduledFrameEvent.objectId
            ),
          };
        }

        if (scheduledFrameEvent.frameCountInEvent <= 1) {
          // 0または1
          // TODO: ここでdepthあるかの判定
          instance.screenObjectsManager.depthToLayer[depth] = {
            object: {
              ...objectBase,
              layoutOptions: event.layoutOptions,
            },
          };
        } else {
          const before = event.layoutOptions;
          const after = event.lastKeyFrame.layoutOptions;

          // TODO: ここでdepthあるかの判定
          instance.screenObjectsManager.depthToLayer[depth] = {
            object: {
              ...objectBase,
              layoutOptions: {
                x:
                  before.x +
                  (scheduledFrameEvent.frameCountInEvent *
                    (after.x - before.x)) /
                    event.frameCount,
                y:
                  before.y +
                  (scheduledFrameEvent.frameCountInEvent *
                    (after.y - before.y)) /
                    event.frameCount,
                width:
                  before.width +
                  (scheduledFrameEvent.frameCountInEvent *
                    (after.width - before.width)) /
                    event.frameCount,
                height:
                  before.height +
                  (scheduledFrameEvent.frameCountInEvent *
                    (after.height - before.height)) /
                    event.frameCount,
              },
            },
          };
        }
      }

      instance.render();
    });

    instance.currentFrameCount += 1;
  };

  return instance;
};
