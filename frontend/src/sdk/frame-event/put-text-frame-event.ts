import {AbstractPutObjectFrameEvent} from './abstract-put-object-frame-event';

export interface PutTextFrameEvent extends AbstractPutObjectFrameEvent {
  type: 'putText';
  putText: {
    assetId: number;
  };
}
