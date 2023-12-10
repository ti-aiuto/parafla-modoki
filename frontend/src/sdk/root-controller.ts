import { Action } from "./action/action";
import { Component } from "./component";

export class RootController {
  doc: HTMLElement;
  clickActions: { [key in string]: { component: Component, action: Action } } = {};
  timers: { [key in string]: number } = {};
  keydownListeners: { [key in string]: (event: KeyboardEvent) => void } = {};

  constructor(doc: HTMLElement) {
    this.doc = doc;
    doc.addEventListener("click", (event: { target: EventTarget | null }) => {
      const clickedFullObjectIds = [];
      let currentNode = event.target as HTMLElement | null;
      if (!currentNode) {
        return;
      }

      while (currentNode !== null) {
        if (currentNode.dataset?.fullObjectId) {
          clickedFullObjectIds.push(currentNode.dataset.fullObjectId);
        }
        currentNode = currentNode.parentNode as HTMLElement;
      }

      clickedFullObjectIds.forEach((fullObjectId) => {
        const clickAction = this.clickActions[fullObjectId];
        if (clickAction) {
          clickAction["component"].handleAction(clickAction["action"]);
        }
      });
    }, false);
  }

  registerClickAction(fullObjectId: string, component: Component, action: Action) {
    console.debug("クリックイベント登録", fullObjectId, component, action);
    this.clickActions[fullObjectId] = {
      component,
      action,
    };
  };

  unregisterClickAction(fullObjectId: string) {
    delete this.clickActions[fullObjectId];
    console.debug("クリックイベント解除", fullObjectId);
  };

  startUserTimer(
    listenerId: string,
    component: Component,
    componentUserFunctionName: string,
    interval: number
  ) {
    let tickCount = 0;
    const timerId = setInterval(function () {
      tickCount++;
      component.callComponentUserFunction(componentUserFunctionName, {
        tickCount,
      });
    }, interval);
    this.timers[listenerId] = timerId;
  };

  clearUserTimer(listenerId: string) {
    clearInterval(this.timers[listenerId]);
    delete this.timers[listenerId];
  };

  registerGlobalKeydownListener(
    listenerId: string,
    component: Component,
    componentUserFunctionName: string
  ) {
    const listener = function (event: KeyboardEvent) {
      const preventDefault = component.callComponentUserFunction(
        componentUserFunctionName,
        {
          key: event.key,
        }
      );
      if (preventDefault) {
        event.preventDefault();
      }
    };
    document.addEventListener("keydown", listener);
    this.keydownListeners[listenerId] = listener;
  };

  unregisterGlobalKeydownListener(listenerId: string) {
    if (this.keydownListeners[listenerId]) {
      document.removeEventListener("keydown", this.keydownListeners[listenerId]);
    }
    delete this.keydownListeners[listenerId];
  };
}
