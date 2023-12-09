import { Action } from "./action";
import { LayoutOptions } from "./layout-options";

interface AbstractFrameEvent {
  type: string;
  frameCount: number;
  scheduledFrameNumber: number;
}

interface AbstractPutObjectFrameEvent extends AbstractFrameEvent {
  depth: number;
  layoutOptions: LayoutOptions;
  lastKeyFrame: { layoutOptions: LayoutOptions };
  onClickAction?: Action;
}

interface PutImgeFrameEvent extends AbstractPutObjectFrameEvent {
  type: 'putImage';
  putImage: {
    assetId: number;
    hoverAssetId: number;
    activeAssetId: number;
  }
}

interface PutObjectFrameEvent extends AbstractPutObjectFrameEvent {
  type: 'putText',
  putText: {
    assetId: number;
  }
}

export type FrameEvent = PutImgeFrameEvent;
