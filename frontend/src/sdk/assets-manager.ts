import { Asset } from "./asset";
import { ImageAsset } from "./image-asset";
import { TextAsset } from "./text-asset";

export class AssetsManager {
  items: { [key in string]: Asset };

  constructor(initialItems: { [key in string]: Asset } = {}) {
    this.items = initialItems;
  }

  find(id: string): Asset | undefined {
    return structuredClone(this.items[id]);
  }

  findImageAsset(id: string): ImageAsset | undefined {
    const asset = this.find(id);
    if (!asset || asset.type !== 'image') {
      return undefined;
    }
    return asset;
  }

  findTextAssetOrThrow(id: string): TextAsset {
    const asset = this.find(id);
    if (!asset) {
      throw new Error(`${id}のアセットが見つかりませんでした`);
    }
    if (asset.type !== 'text') {
      throw new Error(`${id}のアセットはテキストではありません`);
    }
    return asset;
  }

  findImageAssetOrThrow(id: string): ImageAsset {
    const asset = this.find(id);
    if (!asset) {
      throw new Error(`${id}のアセットが見つかりませんでした`);
    }
    if (asset.type !== 'image') {
      throw new Error(`${id}のアセットは画像ではありません`);
    }
    return asset;
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
