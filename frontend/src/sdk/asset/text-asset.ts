import { TextAssetContent } from "./text-asset-content";

export interface TextAsset extends AbstractAsset {
  type: 'text';
  text: TextAssetContent;
}
