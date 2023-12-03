const ScreenObjectsManager = function () {
  const instance = {};
  instance.depthToLayer = {};

  instance.eraseLayers = function (depths) {
    // TODO: 移動
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

  return instance;
};
