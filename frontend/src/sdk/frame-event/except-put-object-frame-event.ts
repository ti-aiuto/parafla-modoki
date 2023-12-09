import { DefineComponentUserFunctionFrameEvent } from "./define-component-user-function-frame-event";
import { ExecuteActionFrameEvent } from "./execute-action-frame-event";
import { DefineLabelFrameEvent } from "./define-label-frame-event";
import { DoNothingFrameEvent } from "./do-nothing-frame-event";

export type ExceptPutObjectFrameEvent = ExecuteActionFrameEvent | DefineComponentUserFunctionFrameEvent | DefineLabelFrameEvent | DoNothingFrameEvent;
