import {AbstractFrameEvent} from './abstract-frame-event';

export interface RollbackFrameEvent extends AbstractFrameEvent {
  type: 'rollback';
  rollback?: {};
}
