import { AbstractPutObjectFrameEvent } from "./abstract-put-object-frame-event";
import { ExceptPutObjectFrameEvent } from "./except-put-object-frame-event";

interface PutImgeFrameEvent extends AbstractPutObjectFrameEvent {
  type: 'putImage';
  putImage: {
    assetId: number;
    hoverAssetId: number;
    activeAssetId: number;
  }
}

interface PutTextFrameEvent extends AbstractPutObjectFrameEvent {
  type: 'putText',
  putText: {
    assetId: number;
  }
}

export type FrameEvent = PutImgeFrameEvent | PutTextFrameEvent | ExceptPutObjectFrameEvent;
