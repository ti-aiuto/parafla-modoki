import { AbstractFrameEvent } from "./abstract-frame-event";

export interface DoNothingFrameEvent extends AbstractFrameEvent {
  type: 'doNothing';
  doNothing?: {}
}
