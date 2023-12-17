import {CallComponentUserFunctionAction} from './call-component-user-function-action';
import {ClearUserTimerAction} from './clear-user-timer-action';
import {EraseLayersAction} from './erase-layers-aciton';
import {ExecuteScriptAction} from './execute-script-action';
import {GotoAndPlayAction} from './goto-and-play-action';
import {PlayAction} from './play-action';
import {RegisterGlobalKeydownListenerAction} from './register-global-keydown-listener-action';
import {SetTextValueAction} from './set-text-value-action';
import {StartUserTimerAction} from './start-user-timer-action';
import {StopAction} from './stop-action';
import {UnregisterGlobalKeydownListenerAction} from './unregister-global-keydown-listener-action';

export type Action =
  | EraseLayersAction
  | GotoAndPlayAction
  | PlayAction
  | StopAction
  | SetTextValueAction
  | ExecuteScriptAction
  | CallComponentUserFunctionAction
  | StartUserTimerAction
  | ClearUserTimerAction
  | RegisterGlobalKeydownListenerAction
  | UnregisterGlobalKeydownListenerAction;
