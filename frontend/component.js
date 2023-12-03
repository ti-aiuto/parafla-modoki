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
  instance.componentUserVariables = {};
  instance.componentUserFunctions = {};

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
    // 各種購読中イベントの解除
    instance.screenObjectsManager
      .findLayersByDepths(depths)
      .forEach(function (layer) {
        if (layer.object) {
          instance.rootController.unregisterClickAction(
            layer.object.fullObjectId
          );
        }
      });
    instance.screenObjectsManager.eraseLayers(depths);
    instance.render();
  };

  instance.gotoAndPlay = function (destination) {
    // TODO: 本当はここでバリデーションが必要
    if (typeof destination === "string") {
      const label = instance.componentSource.labelToFrameNumber[destination];
      console.debug("ラベル解決", destination, label);
      instance.jumpToFrameCount = Number(label);
    } else {
      instance.jumpToFrameCount = destination;
    }
    instance.play();
  };

  instance.setComponentUserVariable = function (key, value) {
    instance.componentUserVariables[key] = JSON.stringify(value);
    console.debug("ユーザ変数設定", key, instance.componentUserVariables[key]);
  };
  instance.getComponentUserVariable = function (key, defaultValue = undefined) {
    console.debug(
      "ユーザ変数取得",
      key,
      instance.componentUserVariables[key],
      defaultValue
    );
    if (instance.componentUserVariables[key] !== undefined) {
      return JSON.parse(instance.componentUserVariables[key]);
    } else {
      return defaultValue;
    }
  };

  instance.defineComponentUserFunction = function (name, content) {
    console.debug("ユーザ関数定義", name, content);
    instance.componentUserFunctions[name] = content;
  };

  instance.callComponentUserFunction = function (name, args = {}) {
    console.debug("ユーザ関数呼び出し", name);
    const content = instance.componentUserFunctions[name];
    const func = new Function("context", "arguments", content);
    const context = instance.createContext();
    return func(context, args || {});
  };

  instance.startUserTimer = function (listenerId, componentUserFunctionName) {
    console.debug("ユーザタイマー開始", listenerId, componentUserFunctionName);
    instance.rootController.startUserTimer(
      listenerId,
      instance,
      componentUserFunctionName
    );
  };
  instance.clearUserTimer = function (listenerId) {
    console.debug("ユーザタイマー解除", listenerId);
    instance.rootController.clearUserTimer(listenerId);
  };

  instance.registerGlobalKeydownListener = function (
    listenerId,
    componentUserFunctionName
  ) {
    console.debug(
      "グローバルキー押下リスナー登録",
      listenerId,
      componentUserFunctionName
    );
    instance.rootController.registerGlobalKeydownListener(
      listenerId,
      instance,
      componentUserFunctionName
    );
  };
  instance.unregisterGlobalKeydownListener = function (listenerId) {
    console.debug("グローバルキー押下リスナー解除", listenerId);
    instance.rootController.unregisterGlobalKeydownListener(listenerId);
  };

  instance.createContext = function () {
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
      setComponentUserVariable(key, value) {
        instance.setComponentUserVariable(key, value);
      },
      defineComponentUserFunction(name, content) {
        instance.defineComponentUserFunction(name, content);
      },
      callComponentUserFunction(name, args = {}) {
        return instance.callComponentUserFunction(name, args);
      },
      incrementComponentUserVariable(key) {
        const nextValue = instance.getComponentUserVariable(key) + 1;
        instance.setComponentUserVariable(key, nextValue);
        return nextValue;
      },
      decrementComponentUserVariable(key) {
        const nextValue = instance.getComponentUserVariable(key) - 1;
        instance.setComponentUserVariable(key, nextValue);
        return nextValue;
      },
      getComponentUserVariable(key, defaultValue) {
        return instance.getComponentUserVariable(key, defaultValue);
      },
      setTextValue(objectId, value) {
        instance.setTextValue(objectId, value);
      },
      getTextValue(objectId) {
        return instance.getTextValue(objectId);
      },
      startUserTimer(listenerId, componentUserFunctionName) {
        instance.startUserTimer(listenerId, componentUserFunctionName);
      },
      clearUserTimer(listenerId) {
        instance.clearUserTimer(listenerId);
      },
      registerGlobalKeydownListener(listenerId, componentUserFunctionName) {
        instance.registerGlobalKeydownListener(
          listenerId,
          componentUserFunctionName
        );
      },
      unregisterGlobalKeydownListener(listenerId) {
        instance.unregisterGlobalKeydownListener(listenerId);
      },
    };
    return context;
  };

  instance.handleAction = function (action) {
    const context = instance.createContext();

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
    } else if (action.type === "setTextValue") {
      context.setTextValue(
        action.setTextValue.objectId,
        action.setTextValue.value
      );
    } else if (action.type === "defineComponentUserFunction") {
      context.defineComponentUserFunction(
        action.defineComponentUserFunction.name,
        action.defineComponentUserFunction.content
      );
    } else if (action.type === "callComponentUserFunction") {
      context.callComponentUserFunction(
        action.callComponentUserFunction.name,
        action.callComponentUserFunction.args
      );
    } else if (action.type === "putObject") {
      let objectBase = null;
      const putObject = action["putObject"];
      const fullObjectId = instance.generateFullObjectId(putObject.objectId);
      // ここの種別は、画像・テキスト・HTML要素・音声・スプライトなどを想定
      if (putObject.type === "image") {
        objectBase = {
          type: "image",
          image: structuredClone(
            instance.findAssetById(putObject.image.assetId)["image"]
          ),
          fullObjectId,
        };
      } else if (putObject.type === "text") {
        objectBase = {
          type: "text",
          text: structuredClone(
            instance.findAssetById(putObject.text.assetId)["text"]
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

  instance.setTextValue = function (objectId, value) {
    // 変数の埋め込み処理
    const valueRemovedWhiteSpaces = (value + "").replace(
      /{{\s*(\w+?)\s}}/g,
      "{{$1}}"
    );
    const variableNames = [...valueRemovedWhiteSpaces.matchAll(/{{(\w+?)}}/g)];
    let valueWithVariables = valueRemovedWhiteSpaces;
    variableNames.forEach(function (variableNameRow) {
      const variableName = variableNameRow[1];
      valueWithVariables = valueWithVariables.replace(
        new RegExp(`{{${variableName}}}`, "g"),
        instance.getComponentUserVariable(variableName)
      );
    });

    for ({ object } of Object.values(
      instance.screenObjectsManager.depthToLayer
    )) {
      if (!object) {
        continue;
      }
      if (object.fullObjectId === instance.generateFullObjectId(objectId)) {
        object.text.content = valueWithVariables;
        break;
      }
    }
    instance.render();
  };

  instance.getTextValue = function (objectId) {
    for ({ object } of Object.values(
      instance.screenObjectsManager.depthToLayer
    )) {
      if (!object) {
        continue;
      }
      if (object.fullObjectId === instance.generateFullObjectId(objectId)) {
        return object.text.content;
      }
    }
    return undefined;
  };

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
