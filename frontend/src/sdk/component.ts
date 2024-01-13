import {Action} from './action/action';
import {ComponentSource} from './component-source';
import {FirstFrameScheduledFrameEvent} from './frame-event/first-frame-scheduled-frame-event';
import {LayoutOptions} from './frame-event/layout-options';
import {MoveObjectScheduledFrameEvent} from './frame-event/move-object-scheduled-frame-event';
import {Renderer} from './renderer';
import {RootController} from './root-controller';
import {ScreenObjectsManager} from './screen-object-manager';

export class Component {
  rootController: RootController;
  componentSource: ComponentSource;
  screenObjectsManager: ScreenObjectsManager;
  renderer: Renderer;

  currentFrameCount = 1;
  jumpToFrameCount: number | null = null;
  timerId: number | undefined = undefined;
  lastFrameCount: number;
  rootInstanceId = 'rootDummyHoge';
  componentUserVariables: {[key in string]: any} = {};
  componentUserFunctions: {[key in string]: Function} = {};

  constructor(
    rootController: RootController,
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
      Object.keys(componentSource.scheduledEvents).map(item => Number(item))
    );

    this.componentUserFunctions = componentSource.componentUserFunctions;
  }

  play() {
    this.stop();
    this.timerId = setInterval(() => this.tick(), 50);
  }

  stop() {
    clearInterval(this.timerId);
  }

  generateFullObjectId(objectId: string) {
    return `${this.rootInstanceId}_${objectId}`;
  }

  eraseLayers(depths: number[] | 'all'[]) {
    // 各種購読中イベントの解除
    this.screenObjectsManager.findLayersByDepths(depths).forEach(layer => {
      if (layer.object) {
        this.rootController.unregisterClickAction(layer.object.fullObjectId);
      }
    });
    this.screenObjectsManager.eraseLayers(depths);
    this.render();
  }

  gotoAndPlay(destination: string | number) {
    // TODO: 本当はここでバリデーションが必要
    if (typeof destination === 'string') {
      const label = this.componentSource.labelToFrameNumber[destination];
      console.debug('ラベル解決', destination, label);
      this.jumpToFrameCount = Number(label);
    } else {
      this.jumpToFrameCount = destination;
    }
    this.play();
  }

  setComponentUserVariable(key: string, value: any) {
    this.componentUserVariables[key] = JSON.stringify(value);
    console.debug('ユーザ変数設定', key, this.componentUserVariables[key]);
  }

  getComponentUserVariable(key: string, defaultValue = undefined) {
    console.debug(
      'ユーザ変数取得',
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
    console.debug('ユーザ関数呼び出し', name, args);
    const func = this.componentUserFunctions[name];
    const context = this.createContext();
    return func(context, args || {});
  }

  startUserTimer(
    listenerId: string,
    componentUserFunctionName: string,
    interval: number
  ) {
    console.debug(
      'ユーザタイマー開始',
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
    console.debug('ユーザタイマー解除', listenerId);
    this.rootController.clearUserTimer(listenerId);
  }

  registerGlobalKeydownListener(
    listenerId: string,
    componentUserFunctionName: string
  ) {
    console.debug(
      'グローバルキー押下リスナー登録',
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
    console.debug('グローバルキー押下リスナー解除', listenerId);
    this.rootController.unregisterGlobalKeydownListener(listenerId);
  }

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
        const func = new Function('context', 'args', content);
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
      playAudio(objectId: string) {
        that.playAudio(objectId);
      },
      setTextValue(objectId: string, value: string) {
        that.setTextValue(objectId, value);
      },
      getTextValue(objectId: string) {
        return that.getTextValue(objectId);
      },
      getLayoutOptions(objectId: string) {
        const layer = that.screenObjectsManager.findLayerByFullObjectId(
          that.generateFullObjectId(objectId)
        );
        const layoutOptions = layer?.object?.layoutOptions;
        if (layoutOptions) {
          return structuredClone(layoutOptions);
        }
        return undefined;
      },
      setLayoutOptions(objectId: string, layoutOptions: LayoutOptions) {
        const layer = that.screenObjectsManager.findLayerByFullObjectId(
          that.generateFullObjectId(objectId)
        );
        if (layer) {
          layer.object.layoutOptions = structuredClone(layoutOptions);
        }
        that.render();
      },
      startUserTimer(
        listenerId: string,
        componentUserFunctionName: string,
        interval: number
      ) {
        that.startUserTimer(listenerId, componentUserFunctionName, interval);
      },
      clearUserTimer(listenerId: string) {
        that.clearUserTimer(listenerId);
      },
      registerGlobalKeydownListener(
        listenerId: string,
        componentUserFunctionName: string
      ) {
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
  }

  handleAction(action: Action) {
    const context = this.createContext();

    if (action.type === 'eraseLayers') {
      context.eraseLayers(action.eraseLayers.depths);
    } else if (action.type === 'stop') {
      context.stop();
    } else if (action.type === 'play') {
      context.play();
    } else if (action.type === 'gotoAndPlay') {
      context.gotoAndPlay(action.gotoAndPlay.destination);
    } else if (action.type === 'setTextValue') {
      context.setTextValue(
        action.setTextValue.objectId,
        action.setTextValue.value
      );
    } else if (action.type === 'playAudio') {
      context.playAudio(action.playAudio.objectId);
    } else if (action.type === 'executeScript') {
      context.executeScript(action.executeScript.content);
    } else if (action.type === 'callComponentUserFunction') {
      context.callComponentUserFunction(
        action.callComponentUserFunction.name,
        action.callComponentUserFunction.args
      );
    } else if (action.type === 'startUserTimer') {
      context.startUserTimer(
        action.startUserTimer.listenerId,
        action.startUserTimer.componentUserFunctionName,
        action.startUserTimer.interval
      );
    } else if (action.type === 'clearUserTimer') {
      context.clearUserTimer(action.clearUserTimer.listenerId);
    } else if (action.type === 'registerGlobalKeydownListener') {
      context.registerGlobalKeydownListener(
        action.registerGlobalKeydownListener.listenerId,
        action.registerGlobalKeydownListener.componentUserFunctionName
      );
    } else if (action.type === 'unregisterGlobalKeydownListener') {
      context.unregisterGlobalKeydownListener(
        action.unregisterGlobalKeydownListener.listenerId
      );
    }
    this.render();
  }

  playAudio(objectId: string) {
    alert(`${objectId}を再生`);
  }

  setTextValue(objectId: string, value: string) {
    // 変数の埋め込み処理
    const valueRemovedWhiteSpaces = (value + '').replace(
      /{{\s*(\w+?)\s}}/g,
      '{{$1}}'
    );
    const variableNames = [...valueRemovedWhiteSpaces.matchAll(/{{(\w+?)}}/g)];
    let valueWithVariables = valueRemovedWhiteSpaces;
    variableNames.forEach(variableNameRow => {
      const variableName = variableNameRow[1];
      valueWithVariables = valueWithVariables.replace(
        new RegExp(`{{${variableName}}}`, 'g'),
        this.getComponentUserVariable(variableName)
      );
    });

    for (const {object} of Object.values(
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
    for (const {object} of Object.values(
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
      this.componentSource.scheduledEvents[this.currentFrameCount] || [];

    currentScheduledFrameEvents.forEach(scheduledFrameEvent => {
      if (this.jumpToFrameCount !== null) {
        return; // frameCount>1のイベントよりも前にgotoAndPlayを実行していた場合は先に飛ぶ
      }

      if (scheduledFrameEvent.type === 'firstFrame') {
        const event = scheduledFrameEvent.firstFrame.event;
        if (event.type === 'executeAction') {
          console.debug('executeAction', event.executeAction);
          this.handleAction(event.executeAction);
        }

        if (
          event.type === 'putAttachedImage' ||
          event.type === 'putAttachedText'
        ) {
          this.putAttachedObject(scheduledFrameEvent);
        }
      } else if (scheduledFrameEvent.type === 'moveObject') {
        this.moveObject(scheduledFrameEvent);
      }
    });

    this.currentFrameCount += 1;
  }

  private moveObject(scheduledFrameEvent: MoveObjectScheduledFrameEvent) {
    const before = scheduledFrameEvent.moveObject.layoutOptions;
    const after = scheduledFrameEvent.moveObject.lastKeyFrame.layoutOptions;

    // TODO: ここでdepthあるかの判定
    const fullObjectId = this.generateFullObjectId(
      scheduledFrameEvent.moveObject.objectId
    );
    const currentLayer =
      this.screenObjectsManager.findLayerByFullObjectId(fullObjectId);
    if (currentLayer) {
      let rotate = undefined;
      if (
        typeof before.rotate === 'number' &&
        typeof after.rotate === 'number'
      ) {
        rotate =
          before.rotate +
          (scheduledFrameEvent.moveObject.frameNumberInEvent *
            (after.rotate - before.rotate)) /
            scheduledFrameEvent.moveObject.frameCount;
      }

      currentLayer.object.layoutOptions = {
        x:
          before.x +
          (scheduledFrameEvent.moveObject.frameNumberInEvent *
            (after.x - before.x)) /
            scheduledFrameEvent.moveObject.frameCount,
        y:
          before.y +
          (scheduledFrameEvent.moveObject.frameNumberInEvent *
            (after.y - before.y)) /
            scheduledFrameEvent.moveObject.frameCount,
        width:
          before.width +
          (scheduledFrameEvent.moveObject.frameNumberInEvent *
            (after.width - before.width)) /
            scheduledFrameEvent.moveObject.frameCount,
        height:
          before.height +
          (scheduledFrameEvent.moveObject.frameNumberInEvent *
            (after.height - before.height)) /
            scheduledFrameEvent.moveObject.frameCount,
        rotate: rotate,
        rotateOriginX: before.rotateOriginX ?? 0,
        rotateOriginY: before.rotateOriginY ?? 0,
      };
    }

    this.render();
  }

  private putAttachedObject(
    scheduledFrameEvent: FirstFrameScheduledFrameEvent
  ) {
    const event = scheduledFrameEvent.firstFrame.event;
    if (event.type !== 'putAttachedImage' && event.type !== 'putAttachedText') {
      throw new Error(`${event}は配置イベントではありません`);
    }

    const objectBase = {
      depth: event.depth,
      layoutOptions: event.layoutOptions,
      lastKeyFrame: event.lastKeyFrame,
      objectId: scheduledFrameEvent.firstFrame.objectId,
      onClickAction: event.onClickAction,
    };

    const depth = event.depth;
    const fullObjectId = this.generateFullObjectId(
      scheduledFrameEvent.firstFrame.objectId
    );
    // ここの種別は、画像・テキスト・HTML要素・音声・スプライトなどを想定
    if (event.type === 'putAttachedImage') {
      this.screenObjectsManager.depthToLayer[depth] = {
        object: {
          ...objectBase,
          fullObjectId,
          layoutOptions: event.layoutOptions,
          onClickAction: event['onClickAction'],
          type: 'image',
          image: {
            image: event.putAttachedImage.image,
            hoverImage: event.putAttachedImage.hoverImage,
            activeImage: event.putAttachedImage.activeImage,
          },
        },
      };
    } else if (event.type === 'putAttachedText') {
      this.screenObjectsManager.depthToLayer[depth] = {
        object: {
          ...objectBase,
          fullObjectId,
          layoutOptions: event.layoutOptions,
          onClickAction: event['onClickAction'],
          type: 'text',
          text: event.putAttachedText.text,
        },
      };
    }
    this.render();

    if (event['onClickAction']) {
      this.rootController.registerClickAction(
        fullObjectId, // TODO: 自動登録とわかるような何か識別子つけたほうがいいかも
        this,
        event['onClickAction']
      );
    }
  }
}
