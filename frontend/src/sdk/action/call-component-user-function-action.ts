import {AbstractAction} from './abstract-action';

export interface CallComponentUserFunctionAction extends AbstractAction {
  type: 'callComponentUserFunction';
  callComponentUserFunction: {
    name: string;
    args?: any[];
  };
}
