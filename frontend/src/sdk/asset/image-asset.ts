import {ImageAssetContent} from './image-asset-content';

export interface ImageAsset extends AbstractAsset {
  type: 'image';
  image: ImageAssetContent;
}
