import {ExceptPutObjectFrameEvent} from './except-put-object-frame-event';
import {PutImageFrameEvent} from './put-image-frame-event';
import {PutTextFrameEvent} from './put-text-frame-event';

export type FrameEvent =
  | PutImageFrameEvent
  | PutTextFrameEvent
  | ExceptPutObjectFrameEvent;
