import {AbstractScheduledFrameEvent} from './abstract-scheduled-frame-event';
import {CompiledFrameEvent} from './compiled-frame-event';

export interface FirstFrameScheduledFrameEvent
  extends AbstractScheduledFrameEvent {
  type: 'firstFrame';
  firstFrame: {
    event: CompiledFrameEvent;
    objectId: string;
  };
}
