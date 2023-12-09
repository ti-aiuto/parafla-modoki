export interface AbstractFrameEvent {
  type: string;
  frameCount: number;
  scheduledFrameNumber: number;
}
