import {AudioAssetContent} from '../asset/audio-asset-content';
import {AbstractPutObjectFrameEvent} from './abstract-put-object-frame-event';

export interface PutAttachedAudioFrameEvent
  extends AbstractPutObjectFrameEvent {
  type: 'putAttachedAudio';
  putAttachedAudio: {
    content: AudioAssetContent;
    volume: number;
    autoplay: boolean;
    initialPosition: number;
  };
}
