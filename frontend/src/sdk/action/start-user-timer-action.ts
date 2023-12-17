import {AbstractAction} from './abstract-action';

export interface StartUserTimerAction extends AbstractAction {
  type: 'startUserTimer';
  startUserTimer: {
    listenerId: string;
    componentUserFunctionName: string;
    interval: number;
  };
}
