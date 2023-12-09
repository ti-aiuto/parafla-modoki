import { ScheduledFrameEvent } from "./scheduled-frame-event";

export type ScheduledEvents = { [key in string]: ScheduledFrameEvent[] };
export type ComponentUserFunctions = { [key in string]: string };
export type LabelToFrameNumber = { [key in string]: number };

export class ComponentSource {
  scheduledEvents: ScheduledEvents;
  labelToFrameNumber: LabelToFrameNumber;
  componentUserFunctions: ComponentUserFunctions;

  constructor(
    scheduledEvents: ScheduledEvents,
    labelToFrameNumber: LabelToFrameNumber,
    componentUserFunctions: ComponentUserFunctions
  ) {
    this.scheduledEvents = scheduledEvents;
    this.labelToFrameNumber = labelToFrameNumber;
    this.componentUserFunctions = componentUserFunctions;
  }
}
