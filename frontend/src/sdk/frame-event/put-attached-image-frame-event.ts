import {AbstractPutObjectFrameEvent} from './abstract-put-object-frame-event';
import {ButtonImageWithAssetContent} from './button-image-with-asset-content';

export interface PutAttachedImageFrameEvent
  extends AbstractPutObjectFrameEvent {
  type: 'putAttachedImage';
  putAttachedImage: ButtonImageWithAssetContent;
}
