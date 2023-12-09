import { LinkedFrameEvent } from "./linked-frame-event";

interface FirstFrameScheduledFrameEvent {
  event: LinkedFrameEvent;
  frameCountInEvent: 0 | 1;
  objectId: string;
}

// 2フレーム目以降はテキスト・画像の中身はいらない
interface TweenFrameScheduledFrameEvent {
  event: Omit<Omit<LinkedFrameEvent, 'putImage'>, 'putText'>;
  frameCountInEvent: Omit<Omit<number, 0>, 1>;
  objectId: string;
}

export type ScheduledFrameEvent = FirstFrameScheduledFrameEvent | TweenFrameScheduledFrameEvent;