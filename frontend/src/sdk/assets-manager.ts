interface AbstractAsset {
  type: string;
  name: string;
}

interface TextAssetContent {
  content: string;
  fontSize: number;
  textColor: string;
  padding: number;
  lineHeight: number;
  borderWidth?: number;
  borderStyle?: string;
  borderColor?: string;
}

export interface TextAsset extends AbstractAsset {
  type: 'text';
  text: TextAssetContent;
}

interface ImageAssetContent {
  source: string;
}

export interface ImageAsset extends AbstractAsset {
  type: 'image';
  image: ImageAssetContent;
}

export type Asset = ImageAsset | TextAsset;

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
