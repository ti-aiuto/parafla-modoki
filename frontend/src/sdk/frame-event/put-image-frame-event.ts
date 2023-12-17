import {AbstractPutObjectFrameEvent} from './abstract-put-object-frame-event';

export interface PutImageFrameEvent extends AbstractPutObjectFrameEvent {
  type: 'putImage';
  putImage: {
    assetId: number;
    hoverAssetId: number;
    activeAssetId: number;
  };
}
