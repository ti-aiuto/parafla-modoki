import { LinkedFrameEvent } from "./linked-frame-event";

export interface ScheduledFrameEvent {
  event: LinkedFrameEvent;
  frameCountInEvent: number;
  objectId: string;
}