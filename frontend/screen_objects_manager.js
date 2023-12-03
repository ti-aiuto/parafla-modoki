const ScreenObjectsManager = function () {
  const instance = {};
  instance.depthToLayer = {};

  instance.eraseLayers = function (depths) {
    if (depths.includes("all")) {
      Object.keys(instance.depthToLayer).forEach(function (eachDepth) {
        instance.depthToLayer[eachDepth] = undefined;
      });
    } else {
      depths.forEach(function (eachDepth) {
        instance.depthToLayer[eachDepth] = undefined;
      });
    }
  };

  instance.findLayersByDepths = function (depths) {
    const result = [];
    if (depths.includes("all")) {
      Object.keys(instance.depthToLayer).forEach(function (eachDepth) {
        if (instance.depthToLayer[eachDepth]) {
          result.push(instance.depthToLayer[eachDepth]);
        }
      });
    } else {
      depths.forEach(function (eachDepth) {
        if (instance.depthToLayer[eachDepth]) {
          result.push(instance.depthToLayer[eachDepth]);
        }
      });
    }
    return result;
  };

  return instance;
};
