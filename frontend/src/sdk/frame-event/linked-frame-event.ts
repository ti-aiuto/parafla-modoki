import { AbstractPutObjectFrameEvent } from "./abstract-put-object-frame-event";
import { ExceptPutObjectFrameEvent } from "./except-put-object-frame-event";
import { ImageAssetContent } from "../asset/image-asset-content";
import { TextAssetContent } from "../asset/text-asset-content";

interface PutImgeLinkedFrameEvent extends AbstractPutObjectFrameEvent {
  type: 'putImage';
  putImage: {
    image: ImageAssetContent;
    hoverImage?: ImageAssetContent;
    activeImage?: ImageAssetContent;
  }
}

interface PutTextLinkedFrameEvent extends AbstractPutObjectFrameEvent {
  type: 'putText',
  putText: {
    text: TextAssetContent;
  }
}

export type LinkedFrameEvent = PutImgeLinkedFrameEvent | PutTextLinkedFrameEvent | ExceptPutObjectFrameEvent;
