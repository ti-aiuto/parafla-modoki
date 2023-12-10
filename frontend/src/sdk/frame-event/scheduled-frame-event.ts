import { DoNothingScheduledFrameEvent } from "./do-nothing-scheduled-frame-event";
import { FirstFrameScheduledFrameEvent } from "./first-frame-scheduled-frame-event";
import { MoveObjectScheduledFrameEvent } from "./move-object-scheduled-frame-event";

export type ScheduledFrameEvent = FirstFrameScheduledFrameEvent | DoNothingScheduledFrameEvent | MoveObjectScheduledFrameEvent;
