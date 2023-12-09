import { ScheduledEvents } from "./scheduled-events";

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
