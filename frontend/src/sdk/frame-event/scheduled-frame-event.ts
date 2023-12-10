import { CompiledFrameEvent } from "./compiled-frame-event";
import { LayoutOptions } from "./layout-options";

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
    frameNumberInEvent: number;
    frameCount: number;
    objectId: string;
    lastKeyFrame: {
      layoutOptions: LayoutOptions;
    }
  }
}

export type ScheduledFrameEvent = FirstFrameScheduledFrameEvent | DoNothingScheduledFrameEvent | MoveObjectScheduledFrameEvent;
