import {AbstractAction} from './abstract-action';

export interface GotoAndPlayAction extends AbstractAction {
  type: 'gotoAndPlay';
  gotoAndPlay: {
    destination: string | number;
  };
}
