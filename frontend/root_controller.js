const RootController = function () {
  const instance = {};
  instance.clickActions = {};
  instance.timers = {};
  instance.keydownListeners = {};

  document.addEventListener("click", function (event) {
    const clickedFullObjectIds = [];
    let currentNode = event.target;
    while (currentNode !== null) {
      if (currentNode.dataset?.fullObjectId) {
        clickedFullObjectIds.push(currentNode.dataset.fullObjectId);
      }
      currentNode = currentNode.parentNode;
    }

    clickedFullObjectIds.forEach(function (fullObjectId) {
      const clickAction = instance.clickActions[fullObjectId];
      if (clickAction) {
        clickAction["component"].handleAction(clickAction["action"]);
      }
    });
  }, false);

  instance.registerClickAction = function (fullObjectId, component, action) {
    console.debug("クリックイベント登録", fullObjectId, component, action);
    instance.clickActions[fullObjectId] = {
      component,
      action,
    };
  };

  instance.unregisterClickAction = function (fullObjectId) {
    instance.clickActions[fullObjectId] = undefined;
    console.debug("クリックイベント解除", fullObjectId);
  };

  instance.registerHoverEvent = function () {};
  instance.unregisterHoverEvent = function () {};

  instance.registerMousedownEvent = function () {};
  instance.unregisterMousedownEvent = function () {};

  instance.startUserTimer = function (
    listenerId,
    component,
    componentUserFunctionName,
    interval
  ) {
    let tickCount = 0;
    const timerId = setInterval(function () {
      tickCount++;
      component.callComponentUserFunction(componentUserFunctionName, {
        tickCount,
      });
    }, interval);
    instance.timers[listenerId] = timerId;
  };
  instance.clearUserTimer = function (listenerId) {
    clearInterval(instance.timers[listenerId]);
    instance.timers[listenerId] = undefined;
  };

  instance.registerGlobalKeydownListener = function (
    listenerId,
    component,
    componentUserFunctionName
  ) {
    const listener = function (event) {
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
    instance.keydownListeners[listenerId] = listener;
  };
  instance.unregisterGlobalKeydownListener = function (listenerId) {
    if (instance.keydownListeners[listenerId]) {
      document.removeEventListener("keydown", instance.keydownListeners[listenerId]);
    }
    instance.keydownListeners[listenerId] = undefined;
  };

  return instance;
};
