import { Asset } from "./asset";

export class AssetsManager {
  items: { [key in string]: Asset };

  constructor(initialItems: { [key in string]: Asset } = {}) {
    this.items = initialItems;
  }

  find(id: string): Asset | undefined {
    return structuredClone(this.items[id]);
  }

  delete(id: string) {
    delete this.items[id];
  }

  allIdToAsset() {
    return structuredClone(this.items);
  }

  add(object: Asset): string {
    let maxId = 0;
    if (Object.keys(this.items).length) {
      maxId = Math.max.apply(
        null,
        Object.keys(this.items).map((key) => Number(key))
      );
    }
    const newId = maxId + 1;
    this.items[newId] = object;
    return `${newId}`;
  }
}
