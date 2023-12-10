import { ImageAssetContent } from "../asset/image-asset-content";
import { AbstractPutObjectFrameEvent } from "./abstract-put-object-frame-event";

export interface PutAttachedImageFrameEvent extends AbstractPutObjectFrameEvent {
  type: 'putAttachedImage';
  putAttachedImage: {
    image: ImageAssetContent;
    hoverImage?: ImageAssetContent;
    activeImage?: ImageAssetContent;
  }
}