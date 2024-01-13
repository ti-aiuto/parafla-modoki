import {AbstractAction} from './abstract-action';

export interface PlayAudioAction extends AbstractAction {
  type: 'playAudio';
  playAudio: {
    objectId: string;
  };
}
