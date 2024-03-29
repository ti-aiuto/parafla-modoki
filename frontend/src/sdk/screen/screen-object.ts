import {AudioScreenObject} from './audio-screen-object';
import {ImageScreenObject} from './image-screen-object';
import {TextScreenObject} from './text-screen-object';

export type ScreenObject =
  | TextScreenObject
  | ImageScreenObject
  | AudioScreenObject;
