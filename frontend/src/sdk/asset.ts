import { ImageAssetContent } from "./image-asset-content";
import { TextAssetContent } from "./text-asset-content";

interface AbstractAsset {
  type: string;
  name: string;
}

export interface TextAsset extends AbstractAsset {
  type: 'text';
  text: TextAssetContent;
}

export interface ImageAsset extends AbstractAsset {
  type: 'image';
  image: ImageAssetContent;
}

export type Asset = ImageAsset | TextAsset;
