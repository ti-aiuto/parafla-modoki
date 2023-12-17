import {TextAssetContent} from '../asset/text-asset-content';
import {AbstractScreenObject} from './abstract-screen-object';

export interface TextScreenObject extends AbstractScreenObject {
  type: 'text';
  text: TextAssetContent;
}
