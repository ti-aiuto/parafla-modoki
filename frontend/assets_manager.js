const AssetsManager = function (initialItems) {
  const instance = {};
  instance.items = initialItems;
  instance.find = function (id) {
    return instance.items[id];
  };
  instance.delete = function (id) {
    delete instance.items[id];
  };
  instance.allIdToAsset = function () {
    return this.items;
  };
  instance.add = function (object) {
    const maxId = Math.max.apply(null, Object.keys(instance.items));
    const newId = maxId + 1;
    instance.items[newId] = object;
    return newId;
  };
  return instance;
};
