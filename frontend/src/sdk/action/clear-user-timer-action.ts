import { AbstractAction } from "./abstract-action";

export interface ClearUserTimerAction extends AbstractAction {
  type: 'clearUserTimer';
  clearUserTimer: {
    listenerId: string;
  }
}