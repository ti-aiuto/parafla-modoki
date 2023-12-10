import { AbstractAction } from "./abstract-action";

export interface SetTextValueAction extends AbstractAction {
  type: 'setTextValue';
  setTextValue: {
    objectId: string;
    value: string;
  }
}