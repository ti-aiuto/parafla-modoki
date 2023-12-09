import { DefineComponentUserFunctionFrameEvent } from "./define-component-user-function-frame-event";
import { ExecuteActionFrameEvent } from "./execute-action-frame-event";

export type ExceptPutObjectFrameEvent = ExecuteActionFrameEvent | DefineComponentUserFunctionFrameEvent | DefineLabelFrameEvent;
