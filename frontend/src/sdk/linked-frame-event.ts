import { AbstractPutObjectFrameEvent } from "./abstract-put-object-frame-event";
import { ImageAssetContent } from "./image-asset-content";
import { TextAssetContent } from "./text-asset-content";

interface PutImgeLinkedFrameEvent extends AbstractPutObjectFrameEvent {
  type: 'putImage';
  putImage: {
    asset: ImageAssetContent;
    hoverAsset?: ImageAssetContent;
    activeAsset?: ImageAssetContent;
  }
}

interface PutTextLinkedFrameEvent extends AbstractPutObjectFrameEvent {
  type: 'putText',
  putText: {
    text: TextAssetContent;
  }
}

export type LinkedFrameEvent = PutImgeLinkedFrameEvent | PutTextLinkedFrameEvent;
