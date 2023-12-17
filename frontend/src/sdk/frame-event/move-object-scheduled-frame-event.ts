import {AbstractScheduledFrameEvent} from './abstract-scheduled-frame-event';
import {LayoutOptions} from './layout-options';

export interface MoveObjectScheduledFrameEvent
  extends AbstractScheduledFrameEvent {
  type: 'moveObject';
  moveObject: {
    frameNumberInEvent: number;
    frameCount: number;
    objectId: string;
    layoutOptions: LayoutOptions;
    lastKeyFrame: {
      layoutOptions: LayoutOptions;
    };
  };
}
