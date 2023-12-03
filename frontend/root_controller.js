const RootController = function () {
  const instance = {};
  instance.clickActions = {};
  instance.timers = {};

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
  });

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
    componentUserFunctionName
  ) {
    let tickCount = 0;
    const timerId = setInterval(function () {
      tickCount++;
      component.callComponentUserFunction(componentUserFunctionName, {
        tickCount,
      });
    }, interval);
    instance.timers[listenerId] = { timerId };
  };
  instance.clearUserTimer = function (listenerId) {
    clearInterval(instance.timers[listenerId]?.timerId);
    instance.timers[listenerId] = undefined;
  };

  instance.defineUserVariable = function () {};
  instance.setUserVariable = function () {};
  instance.getUserVariable = function () {};

  return instance;
};
