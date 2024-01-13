import {AbstractPutObjectFrameEvent} from './abstract-put-object-frame-event';

export interface PutAudioFrameEvent extends AbstractPutObjectFrameEvent {
  type: 'putAudio';
  putAudio: {
    assetId: number;
    volume: number;
    autoplay: boolean;
    initialPosition: number;
  };
}
