import { CompiledFrameEvent } from "./compiled-frame-event";

interface AbstractScheduledFrameEvent {
  type: string;
}

interface FirstFrameScheduledFrameEvent extends AbstractScheduledFrameEvent {
  type: 'firstFrame',
  firstFrame: {
    event: CompiledFrameEvent;
    objectId: string;
  }
}

interface DoNothingScheduledFrameEvent extends AbstractScheduledFrameEvent {
  type: 'doNothing'
}

interface MoveObjectScheduledFrameEvent extends AbstractScheduledFrameEvent {
  type: 'moveObject',
  moveObject: {
    frameCountInEvent: number;
    objectId: string;
  }
}

export type ScheduledFrameEvent = FirstFrameScheduledFrameEvent | DoNothingScheduledFrameEvent | MoveObjectScheduledFrameEvent;
