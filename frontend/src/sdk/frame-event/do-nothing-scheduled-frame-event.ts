import { AbstractScheduledFrameEvent } from "./abstract-scheduled-frame-event";

export interface DoNothingScheduledFrameEvent extends AbstractScheduledFrameEvent {
  type: 'doNothing'
}
