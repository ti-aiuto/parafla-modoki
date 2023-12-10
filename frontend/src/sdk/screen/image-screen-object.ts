import { ButtonImageWithAssetContent } from "../frame-event/button-image-with-asset-content";
import { AbstractScreenObject } from "./abstract-screen-object";

export interface ImageScreenObject extends AbstractScreenObject {
  type: 'image',
  image: ButtonImageWithAssetContent
}
