import { Action } from "./action/action";
import { ComponentSource } from "./component-source";
import { Renderer } from "./renderer";
import { RootController } from "./root-controller";
import { ScreenObjectsManager } from "./screen-object-manager";

export class Component {
  rootController: RootController;
  componentSource: ComponentSource;
  screenObjectsManager: ScreenObjectsManager;
  renderer: Renderer;

  currentFrameCount: number = 1;
  jumpToFrameCount: number | null = null;
  timerId: number | undefined = undefined;
  lastFrameCount: number;
  rootInstanceId: string = "rootDummyHoge";
  componentUserVariables: { [key in string]: any } = {};
  componentUserFunctions: { [key in string]: string } = {};

  constructor(rootController: RootController,
    componentSource: ComponentSource,
    screenObjectsManager: ScreenObjectsManager,
    renderer: Renderer
  ) {
    this.rootController = rootController;
    this.componentSource = componentSource;
    this.screenObjectsManager = screenObjectsManager;
    this.renderer = renderer;

    this.lastFrameCount = Math.max.apply(
      null,
      Object.keys(componentSource.scheduledEvents).map((item) => Number(item))
    );

    this.componentUserFunctions = componentSource.componentUserFunctions;
  }

  play() {
    this.stop();
    this.timerId = setInterval(this.tick, 50);
  }

  stop() {
    clearInterval(this.timerId);
  }

  generateFullObjectId(objectId: string) {
    return `${this.rootInstanceId}_${objectId}`;
  }

  eraseLayers(depths: number[] | 'all'[]) {
    // 各種購読中イベントの解除
    this.screenObjectsManager
      .findLayersByDepths(depths)
      .forEach((layer) => {
        if (layer.object) {
          this.rootController.unregisterClickAction(
            layer.object.fullObjectId
          );
        }
      });
    this.screenObjectsManager.eraseLayers(depths);
    this.render();
  }

  gotoAndPlay(destination: string | number) {
    // TODO: 本当はここでバリデーションが必要
    if (typeof destination === "string") {
      const label = this.componentSource.labelToFrameNumber[destination];
      console.debug("ラベル解決", destination, label);
      this.jumpToFrameCount = Number(label);
    } else {
      this.jumpToFrameCount = destination;
    }
    this.play();
  }

  setComponentUserVariable(key: string, value: any) {
    this.componentUserVariables[key] = JSON.stringify(value);
    console.debug("ユーザ変数設定", key, this.componentUserVariables[key]);
  }

  getComponentUserVariable(key: string, defaultValue = undefined) {
    console.debug(
      "ユーザ変数取得",
      key,
      this.componentUserVariables[key],
      defaultValue
    );
    const currentRawValue = this.componentUserVariables[key];
    if (currentRawValue !== undefined) {
      return JSON.parse(currentRawValue);
    } else {
      return defaultValue;
    }
  }

  callComponentUserFunction(name: string, args: object = {}) {
    console.debug("ユーザ関数呼び出し", name, args);
    const content = this.componentUserFunctions[name];
    const func = new Function("context", "args", content);
    const context = this.createContext();
    return func(context, args || {});
  }

  startUserTimer(
    listenerId: string,
    componentUserFunctionName: string,
    interval: number
  ) {
    console.debug(
      "ユーザタイマー開始",
      listenerId,
      componentUserFunctionName,
      interval
    );
    this.rootController.startUserTimer(
      listenerId,
      this,
      componentUserFunctionName,
      interval
    );
  }

  clearUserTimer(listenerId: string) {
    console.debug("ユーザタイマー解除", listenerId);
    this.rootController.clearUserTimer(listenerId);
  }

  registerGlobalKeydownListener(
    listenerId: string,
    componentUserFunctionName: string
  ) {
    console.debug(
      "グローバルキー押下リスナー登録",
      listenerId,
      componentUserFunctionName
    );
    this.rootController.registerGlobalKeydownListener(
      listenerId,
      this,
      componentUserFunctionName
    );
  }

  unregisterGlobalKeydownListener(listenerId: string) {
    console.debug("グローバルキー押下リスナー解除", listenerId);
    this.rootController.unregisterGlobalKeydownListener(listenerId);
  };

  createContext() {
    const that = this;
    const context = {
      play() {
        that.play();
      },
      stop() {
        that.stop();
      },
      gotoAndPlay(destination: string | number) {
        that.gotoAndPlay(destination);
      },
      eraseLayers(depths: number[] | 'all'[]) {
        that.eraseLayers(depths);
      },
      setComponentUserVariable(key: string, value: any) {
        that.setComponentUserVariable(key, value);
      },
      executeScript(content: string) {
        const func = new Function("context", "args", content);
        const context = that.createContext();
        return func(context);
      },
      callComponentUserFunction(name: string, args: object = {}) {
        return that.callComponentUserFunction(name, args);
      },
      incrementComponentUserVariable(key: string) {
        const nextValue = that.getComponentUserVariable(key) + 1;
        that.setComponentUserVariable(key, nextValue);
        return nextValue;
      },
      decrementComponentUserVariable(key: string) {
        const nextValue = that.getComponentUserVariable(key) - 1;
        that.setComponentUserVariable(key, nextValue);
        return nextValue;
      },
      getComponentUserVariable(key: string, defaultValue: any) {
        return that.getComponentUserVariable(key, defaultValue);
      },
      setTextValue(objectId: string, value: string) {
        that.setTextValue(objectId, value);
      },
      getTextValue(objectId: string) {
        return that.getTextValue(objectId);
      },
      startUserTimer(listenerId: string, componentUserFunctionName: string, interval: number) {
        that.startUserTimer(
          listenerId,
          componentUserFunctionName,
          interval
        );
      },
      clearUserTimer(listenerId: string) {
        that.clearUserTimer(listenerId);
      },
      registerGlobalKeydownListener(listenerId: string, componentUserFunctionName: string) {
        that.registerGlobalKeydownListener(
          listenerId,
          componentUserFunctionName
        );
      },
      unregisterGlobalKeydownListener(listenerId: string) {
        that.unregisterGlobalKeydownListener(listenerId);
      },
    };
    return context;
  };

  handleAction(action: Action) {
    const context = this.createContext();

    if (action.type === "eraseLayers") {
      context.eraseLayers(action.eraseLayers.depths);
    } else if (action.type === "stop") {
      context.stop();
    } else if (action.type === "play") {
      context.play();
    } else if (action.type === "gotoAndPlay") {
      context.gotoAndPlay(action.gotoAndPlay.destination);
    } else if (action.type === "setTextValue") {
      context.setTextValue(
        action.setTextValue.objectId,
        action.setTextValue.value
      );
    } else if (action.type === "executeScript") {
      context.executeScript(action.executeScript.content);
    } else if (action.type === "callComponentUserFunction") {
      context.callComponentUserFunction(
        action.callComponentUserFunction.name,
        action.callComponentUserFunction.args
      );
    } else if (action.type === "startUserTimer") {
      context.startUserTimer(
        action.startUserTimer.listenerId,
        action.startUserTimer.componentUserFunctionName,
        action.startUserTimer.interval
      );
    } else if (action.type === "clearUserTimer") {
      context.clearUserTimer(action.clearUserTimer.listenerId);
    } else if (action.type === "registerGlobalKeydownListener") {
      context.registerGlobalKeydownListener(
        action.registerGlobalKeydownListener.listenerId,
        action.registerGlobalKeydownListener.componentUserFunctionName
      );
    } else if (action.type === "unregisterGlobalKeydownListener") {
      context.registerGlobalKeydownListener(
        action.unregisterGlobalKeydownListener.listenerId
      );
    } else if (action.type === "putObject") {
      let objectBase = null;
      const putObject = action["putObject"];
      const fullObjectId = instance.generateFullObjectId(putObject.objectId);
      // ここの種別は、画像・テキスト・HTML要素・音声・スプライトなどを想定
      if (putObject.type === "image") {
        objectBase = {
          type: "image",
          image: {
            image: putObject.image.image,
            hoverImage: putObject.image.hoverImage,
            activeImage: putObject.image.activeImage,
          },
          fullObjectId,
          onClickAction: putObject["onClickAction"],
        };
      } else if (putObject.type === "text") {
        objectBase = {
          type: "text",
          text: putObject.text.text,
          fullObjectId,
          onClickAction: putObject["onClickAction"],
        };
      }

      const depth = putObject.depth;
      if (putObject.frameCountIndex <= 1 || !putObject.lastKeyFrame) {
        // 0または1
        // TODO: ここでdepthあるかの判定
        this.screenObjectsManager.depthToLayer[depth] = {
          object: {
            ...objectBase,
            layoutOptions: putObject.layoutOptions,
          },
        };
      } else {
        const before = putObject.layoutOptions;
        const after = putObject.lastKeyFrame.layoutOptions;

        // TODO: ここでdepthあるかの判定
        this.screenObjectsManager.depthToLayer[depth] = {
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
      this.render();

      if (putObject["onClickAction"]) {
        this.rootController.registerClickAction(
          fullObjectId,
          this,
          putObject["onClickAction"]
        );
      }
    }
  };

  setTextValue(objectId: string, value: string) {
    // 変数の埋め込み処理
    const valueRemovedWhiteSpaces = (value + "").replace(
      /{{\s*(\w+?)\s}}/g,
      "{{$1}}"
    );
    const variableNames = [...valueRemovedWhiteSpaces.matchAll(/{{(\w+?)}}/g)];
    let valueWithVariables = valueRemovedWhiteSpaces;
    variableNames.forEach((variableNameRow) => {
      const variableName = variableNameRow[1];
      valueWithVariables = valueWithVariables.replace(
        new RegExp(`{{${variableName}}}`, "g"),
        this.getComponentUserVariable(variableName)
      );
    });

    for (let { object } of Object.values(
      this.screenObjectsManager.depthToLayer
    )) {
      if (!object) {
        continue;
      }
      if (object.fullObjectId === this.generateFullObjectId(objectId)) {
        if (object.type === 'text') {
          object.text.content = valueWithVariables;
          break;
        }
      }
    }
    this.render();
  }

  getTextValue(objectId: string) {
    for (let { object } of Object.values(
      this.screenObjectsManager.depthToLayer
    )) {
      if (!object) {
        continue;
      }
      if (object.fullObjectId === this.generateFullObjectId(objectId)) {
        if (object.type === 'text') {
          return object.text.content;
        } else {
          // warn textではない
        }
      }
    }
    return undefined;
  }

  render() {
    this.renderer.render();
  }

  tick() {
    // 最後まで行ったら最初に戻る（判定これでいいのかな？）
    if (this.currentFrameCount > this.lastFrameCount) {
      this.currentFrameCount = 1;
    }

    // 飛び先が指定されていたらそっちにいく
    if (this.jumpToFrameCount !== null) {
      this.currentFrameCount = this.jumpToFrameCount;
      this.jumpToFrameCount = null;
    }

    const currentScheduledFrameEvents =
      this.componentSource.scheduledEvents[this.currentFrameCount] ||
      [];

    currentScheduledFrameEvents.forEach((scheduledFrameEvent) => {
      if (this.jumpToFrameCount !== null) {
        return; // frameCount>1のイベントよりも前にgotoAndPlayを実行していた場合は先に飛ぶ
      }

      const event = scheduledFrameEvent.event;

      if (event.type === "executeAction") {
        console.debug("executeAction", event.executeAction);
        this.handleAction(event.executeAction);
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
          this.handleAction({
            type: "putObject",
            putObject: {
              ...putObjectBase,
              type: "image",
              image: event.putImage,
            },
          });
        } else if (event.type === "putText") {
          this.handleAction({
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

    this.currentFrameCount += 1;
  }
}
