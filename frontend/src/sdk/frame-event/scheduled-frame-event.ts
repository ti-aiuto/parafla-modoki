import { CompiledFrameEvent } from "./compiled-frame-event";

interface FirstFrameScheduledFrameEvent {
  event: CompiledFrameEvent;
  frameCountInEvent: 0 | 1;
  objectId: string;
}

export type ScheduledFrameEvent = FirstFrameScheduledFrameEvent;
