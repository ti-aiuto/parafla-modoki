import { Action } from "../action/action";
import { LayoutOptions } from "../frame-event/layout-options";

export interface AbstractScreenObject {
  type: string;
  fullObjectId: string;
  onClickAction?: Action;
  layoutOptions: LayoutOptions;
}