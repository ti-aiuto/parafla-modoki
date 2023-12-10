import { TextAssetContent } from "../asset/text-asset-content";
import { AbstractPutObjectFrameEvent } from "./abstract-put-object-frame-event";

export interface PutAttachedTextFrameEvent extends AbstractPutObjectFrameEvent {
  type: 'putAttachedText';
  putAttachedText: {
    text: TextAssetContent;
  }
}