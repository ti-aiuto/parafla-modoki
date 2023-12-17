import {AbstractFrameEvent} from './abstract-frame-event';
import {Action} from '../action/action';

export interface ExecuteActionFrameEvent extends AbstractFrameEvent {
  type: 'executeAction';
  executeAction: Action;
}
