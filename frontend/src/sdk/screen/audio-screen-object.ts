import {AudioAssetContent} from '../asset/audio-asset-content';
import {AbstractScreenObject} from './abstract-screen-object';

export interface AudioScreenObject extends AbstractScreenObject {
  type: 'audio';
  audio: {
    volume: number;
    autoplay: boolean;
    content: AudioAssetContent;
    initialPosition: number;
    playId: string; // このIDが変わったら再生しなおす
  };
}
