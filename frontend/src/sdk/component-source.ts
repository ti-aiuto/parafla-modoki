import { ScheduledEvent } from "./scheduled-event";

export type ComponentUserFunctions = { [key in string]: string };
export type LabelToFrameNumber = { [key in string]: number };

export class ComponentSource {
  scheduledEvents: ScheduledEvent[];
  labelToFrameNumber: LabelToFrameNumber;
  componentUserFunctions: ComponentUserFunctions;

  constructor(
    scheduledEvents: ScheduledEvent[],
    labelToFrameNumber: LabelToFrameNumber,
    componentUserFunctions: ComponentUserFunctions
  ) {
    this.scheduledEvents = scheduledEvents;
    this.labelToFrameNumber = labelToFrameNumber;
    this.componentUserFunctions = componentUserFunctions;
  }
}
