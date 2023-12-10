import { AssetsManager } from "./assets-manager";
import { ComponentSource, ComponentUserFunctions, LabelToFrameNumber, ScheduledEvents } from "./component-source";
import { FrameEvent } from "./frame-event/frame-event";
import { PutAttachedImageFrameEvent } from "./frame-event/put-attached-image-frame-event";
import { PutAttachedTextFrameEvent } from "./frame-event/put-attached-text-frame-event";

const range = (start: number, end: number) => [...Array(end + 1).keys()].slice(start);

export class Compiler {
  assetsManager: AssetsManager;

  constructor(assetsManager: AssetsManager) {
    this.assetsManager = assetsManager;
  }

  compile(frameEvents: FrameEvent[]): ComponentSource {
    this.normalizeFrameEvents(frameEvents);
    return new ComponentSource(
      this.generateScheduledEvents(frameEvents),
      this.generateLabelToFrameNumber(frameEvents),
      this.extractComponentUserFunctions(frameEvents)
    );
  };

  normalizeFrameEvents = function (frameEvents: FrameEvent[]) {
    // データ整形
    frameEvents.forEach(function (frameEvent) {
      if (["defineLabel"].includes(frameEvent.type)) {
        frameEvent.frameCount = 0;
      }
      if (frameEvent.type === "executeAction") {
        if (["stop", "gotoAndPlay"].includes(frameEvent.executeAction.type)) {
          frameEvent.frameCount = 1;
        } else {
          frameEvent.frameCount = 0;
        }
      }
    });
  };

  private buildPutAttachedImage(frameEvent: FrameEvent): PutAttachedImageFrameEvent {
    if (frameEvent.type !== "putImage") {
      throw new Error(`${frameEvent}はputTextに該当しません`);
    }

    let hoverAsset = null;
    let activeAsset = null;
    if (frameEvent["putImage"].hoverAssetId) {
      hoverAsset = this.assetsManager.findImageAsset(frameEvent["putImage"].hoverAssetId);
    }
    if (frameEvent["putImage"].activeAssetId) {
      activeAsset = this.assetsManager.findImageAsset(frameEvent["putImage"].activeAssetId);
    }
    return {
      ...frameEvent,
      type: 'putAttachedImage',
      putAttachedImage: {
        image: this.assetsManager.findImageAssetOrThrow(frameEvent["putImage"].assetId).image,
        hoverImage: hoverAsset ? hoverAsset.image : undefined,
        activeImage: activeAsset ? activeAsset.image : undefined
      }
    };
  }

  private buildPutAttachedText(frameEvent: FrameEvent): PutAttachedTextFrameEvent {
    if (frameEvent.type !== "putText") {
      throw new Error(`${frameEvent}はputTextに該当しません`);
    }

    return {
      ...frameEvent,
      type: 'putAttachedText',
      putAttachedText: {
        text: this.assetsManager.findTextAssetOrThrow(frameEvent["putText"].assetId).text
      }
    }
  }

  generateScheduledEvents(frameEvents: FrameEvent[]): ScheduledEvents {
    const absoluteFrameCountToScheduledFrameEvents: ScheduledEvents = {};
    let currentFrameCount = 1;

    frameEvents.forEach((frameEvent) => {
      if (!absoluteFrameCountToScheduledFrameEvents[currentFrameCount]) {
        absoluteFrameCountToScheduledFrameEvents[currentFrameCount] = [];
      }

      const defaultObjectId = "auto" + Math.random();
      if (frameEvent.frameCount <= 1) {
        if (frameEvent.type === "putText") {
          absoluteFrameCountToScheduledFrameEvents[currentFrameCount].push({
            type: 'firstFrame',
            firstFrame: {
              event: this.buildPutAttachedText(frameEvent),
              objectId: frameEvent.objectId || defaultObjectId,
            }
          });
        } else if (frameEvent.type === "putImage") {
          absoluteFrameCountToScheduledFrameEvents[currentFrameCount].push({
            type: 'firstFrame',
            firstFrame: {
              event: this.buildPutAttachedImage(frameEvent),
              objectId: frameEvent.objectId || defaultObjectId,
            }
          });
        } else {
          absoluteFrameCountToScheduledFrameEvents[currentFrameCount].push({
            type: 'firstFrame',
            firstFrame: {
              event: frameEvent,
              objectId: defaultObjectId,
            }
          });
        }
      } else {
        range(0, frameEvent.frameCount - 1).forEach((
          frameCountInEvent
        ) => {
          if (
            frameEvent.type === "doNothing" &&
            frameCountInEvent !== frameEvent.frameCount - 1
          ) {
            // 最後の1フレーム以外は追加しない
            return;
          }

          const fixedFrameCountInEvent =
            currentFrameCount + frameCountInEvent;
          if (
            !absoluteFrameCountToScheduledFrameEvents[fixedFrameCountInEvent]
          ) {
            absoluteFrameCountToScheduledFrameEvents[fixedFrameCountInEvent] =
              [];
          }

          if (frameEvent.type === 'doNothing') {
            absoluteFrameCountToScheduledFrameEvents[
              fixedFrameCountInEvent
            ].push({
              type: 'doNothing',
            });
          } else if (frameEvent.type === "putText" || frameEvent.type === "putImage") {
            if (frameCountInEvent === 0) {
              if (frameEvent.type === "putText") {
                absoluteFrameCountToScheduledFrameEvents[currentFrameCount].push({
                  type: 'firstFrame',
                  firstFrame: {
                    event: this.buildPutAttachedText(frameEvent),
                    objectId: frameEvent.objectId || defaultObjectId,
                  }
                });
              } else if (frameEvent.type === "putImage") {
                absoluteFrameCountToScheduledFrameEvents[currentFrameCount].push({
                  type: 'firstFrame',
                  firstFrame: {
                    event: this.buildPutAttachedImage(frameEvent),
                    objectId: frameEvent.objectId || defaultObjectId,
                  }
                });
              }
            } else {
              if (frameEvent.lastKeyFrame) {
                absoluteFrameCountToScheduledFrameEvents[
                  fixedFrameCountInEvent
                ].push({
                  type: 'moveObject',
                  moveObject: {
                    frameCount: frameEvent.frameCount,
                    lastKeyFrame: frameEvent.lastKeyFrame,
                    frameNumberInEvent: frameCountInEvent + 1,
                    objectId: frameEvent.objectId || defaultObjectId,
                  }
                });
              } else {
                // 移動先がない場合もある
              }
            }
          }
        });
      }

      currentFrameCount += frameEvent.frameCount;
    });
    return absoluteFrameCountToScheduledFrameEvents;
  }

  generateLabelToFrameNumber(frameEvents: FrameEvent[]): LabelToFrameNumber {
    const labelToFrameCount: LabelToFrameNumber = {};
    let currentFrameCount = 1;
    frameEvents.forEach(function (frameEvent) {
      if (frameEvent.type === "defineLabel") {
        const label = frameEvent.defineLabel.label;
        labelToFrameCount[label] = currentFrameCount;
      }

      currentFrameCount += frameEvent.frameCount;
    });
    return labelToFrameCount;
  }

  extractComponentUserFunctions(frameEvents: FrameEvent[]): ComponentUserFunctions {
    const componentUserFunctions: ComponentUserFunctions = {};
    frameEvents.forEach(function (frameEvent) {
      if (frameEvent.type === "defineComponentUserFunction") {
        componentUserFunctions[frameEvent.defineComponentUserFunction.name] =
          frameEvent.defineComponentUserFunction.content;
      }
    });
    return componentUserFunctions;
  }
}
