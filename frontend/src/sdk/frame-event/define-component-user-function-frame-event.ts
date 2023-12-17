import {AbstractFrameEvent} from './abstract-frame-event';

export interface DefineComponentUserFunctionFrameEvent
  extends AbstractFrameEvent {
  type: 'defineComponentUserFunction';
  defineComponentUserFunction: {
    name: string;
    content: string;
  };
}
