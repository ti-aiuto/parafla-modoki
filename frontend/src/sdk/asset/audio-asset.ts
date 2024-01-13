import {AbstractAsset} from './abstract-asset';
import {AudioAssetContent} from './audio-asset-content';

export interface AudioAsset extends AbstractAsset {
  type: 'audio';
  image: AudioAssetContent;
}
