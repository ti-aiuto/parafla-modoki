import { Asset } from "./asset/asset";
import { ImageAsset } from "./asset/image-asset";
import { TextAsset } from "./asset/text-asset";

export class AssetsManager {
  items: { [key in string]: Asset };

  constructor(initialItems: { [key in string]: Asset } = {}) {
    this.items = initialItems;
  }

  find(id: number): Asset | undefined {
    return structuredClone(this.items[id]);
  }

  findImageAsset(id: number): ImageAsset | undefined {
    const asset = this.find(id);
    if (!asset || asset.type !== 'image') {
      return undefined;
    }
    return asset;
  }

  findTextAssetOrThrow(id: number): TextAsset {
    const asset = this.find(id);
    if (!asset) {
      throw new Error(`${id}のアセットが見つかりませんでした`);
    }
    if (asset.type !== 'text') {
      throw new Error(`${id}のアセットはテキストではありません`);
    }
    return asset;
  }

  findImageAssetOrThrow(id: number): ImageAsset {
    const asset = this.find(id);
    if (!asset) {
      throw new Error(`${id}のアセットが見つかりませんでした`);
    }
    if (asset.type !== 'image') {
      throw new Error(`${id}のアセットは画像ではありません`);
    }
    return asset;
  }

  delete(id: number) {
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
