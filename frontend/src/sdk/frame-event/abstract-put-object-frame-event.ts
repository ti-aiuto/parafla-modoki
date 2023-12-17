import {AbstractFrameEvent} from './abstract-frame-event';
import {Action} from '../action/action';
import {LayoutOptions} from './layout-options';

export interface AbstractPutObjectFrameEvent extends AbstractFrameEvent {
  depth: number;
  layoutOptions: LayoutOptions;
  lastKeyFrame?: {layoutOptions: LayoutOptions};
  onClickAction?: Action;
  objectId?: string;
}
