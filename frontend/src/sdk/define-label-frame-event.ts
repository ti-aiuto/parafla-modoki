import { AbstractFrameEvent } from "./abstract-frame-event";

export interface DefineLabelFrameEvent extends AbstractFrameEvent {
  type: 'defineLabel';
  defineLabel: {
    label: string;
  }
}