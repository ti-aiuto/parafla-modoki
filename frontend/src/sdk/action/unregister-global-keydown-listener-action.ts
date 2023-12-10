import { AbstractAction } from "./abstract-action";

export interface UnregisterGlobalKeydownListenerAction extends AbstractAction {
  type: 'unregisterGlobalKeydownListener';
  unregisterGlobalKeydownListener: {
    listenerId: string;
  }
}