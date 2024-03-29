import {ExceptPutObjectFrameEvent} from './except-put-object-frame-event';
import {PutAttachedAudioFrameEvent} from './put-attached-audio-frame-event';
import {PutAttachedImageFrameEvent} from './put-attached-image-frame-event';
import {PutAttachedTextFrameEvent} from './put-attached-text-frame-event';

export type CompiledFrameEvent =
  | PutAttachedImageFrameEvent
  | PutAttachedTextFrameEvent
  | PutAttachedAudioFrameEvent
  | ExceptPutObjectFrameEvent;
