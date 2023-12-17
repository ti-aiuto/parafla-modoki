import {ImageAssetContent} from '../asset/image-asset-content';

export interface ButtonImageWithAssetContent {
  image: ImageAssetContent;
  hoverImage?: ImageAssetContent;
  activeImage?: ImageAssetContent;
}
