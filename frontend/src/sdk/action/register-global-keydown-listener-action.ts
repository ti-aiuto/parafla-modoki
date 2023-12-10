import { AbstractAction } from "./abstract-action";

export interface RegisterGlobalKeydownListenerAction extends AbstractAction {
  type: 'registerGlobalKeydownListener';
  registerGlobalKeydownListener: {
    listenerId: string;
    componentUserFunctionName: string;
  }
}