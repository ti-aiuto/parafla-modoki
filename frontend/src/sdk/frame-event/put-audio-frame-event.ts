import {AbstractPutObjectFrameEvent} from './abstract-put-object-frame-event';

export interface PutAudioFrameEvent extends AbstractPutObjectFrameEvent {
  type: 'putAUdio';
  putAUdio: {
    volume: number;
    autoplay: boolean;
  };
}
