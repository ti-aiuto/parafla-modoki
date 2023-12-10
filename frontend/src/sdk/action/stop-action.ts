import { AbstractAction } from "./abstract-action";

export interface StopAction extends AbstractAction {
  type: 'stop';
}