import { AbstractAction } from "./abstract-action";

export interface ExecuteScriptAction extends AbstractAction {
  type: 'executeScript';
  executeScript: {
    content: string;
  }
}