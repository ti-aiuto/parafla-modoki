import { AssetsManager } from "./assets-manager";
import { ComponentSource, ComponentUserFunctions, LabelToFrameNumber, ScheduledEvents } from "./component-source";
import { FrameEvent } from "./frame-event/frame-event";
import { ScheduledFrameEvent } from "./frame-event/scheduled-frame-event";

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

  generateScheduledEvents(frameEvents: FrameEvent[]): ScheduledEvents {
    const absoluteFrameCountToScheduledFrameEvents: ScheduledEvents = {};
    let currentFrameCount = 1;

    frameEvents.forEach((frameEvent) => {
      if (!absoluteFrameCountToScheduledFrameEvents[currentFrameCount]) {
        absoluteFrameCountToScheduledFrameEvents[currentFrameCount] = [];
      }

      const defaultObjectId = "auto" + Math.random();
      let putObjectFirstFrame: ScheduledFrameEvent | null = null;
      if (frameEvent.type === "putText") {
        putObjectFirstFrame = {
          event: {
            ...frameEvent, putText: {
              text: this.assetsManager.findTextAssetOrThrow(frameEvent["putText"].assetId).text
            }
          },
          frameCountInEvent: 0, // とりあえず0を入れておく
          objectId: frameEvent.objectId || defaultObjectId,
        };
      } else if (frameEvent.type === "putImage") {
        let hoverAsset = null;
        let activeAsset = null;
        if (frameEvent["putImage"].hoverAssetId) {
          hoverAsset = this.assetsManager.findImageAsset(frameEvent["putImage"].hoverAssetId);
        }
        if (frameEvent["putImage"].activeAssetId) {
          activeAsset = this.assetsManager.findImageAsset(frameEvent["putImage"].activeAssetId);
        }
        putObjectFirstFrame = {
          event: {
            ...frameEvent, putImage: {
              image: this.assetsManager.findImageAssetOrThrow(frameEvent["putImage"].assetId).image,
              hoverImage: hoverAsset ? hoverAsset.image : undefined,
              activeImage: activeAsset ? activeAsset.image : undefined
            }
          },
          frameCountInEvent: 0, // とりあえず0を入れておく
          objectId: frameEvent.objectId || defaultObjectId,
        };
      }

      if (frameEvent.frameCount === 0 || frameEvent.frameCount === 1) {
        if (frameEvent.type === "putText") {
          absoluteFrameCountToScheduledFrameEvents[currentFrameCount].push(putObjectFirstFrame!);
        } else if (frameEvent.type === "putImage") {
          absoluteFrameCountToScheduledFrameEvents[currentFrameCount].push(putObjectFirstFrame!);
        } else {
          absoluteFrameCountToScheduledFrameEvents[currentFrameCount].push({
            event: frameEvent,
            frameCountInEvent: frameEvent.frameCount, 
            objectId: defaultObjectId,
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
              event: frameEvent,
              frameCountInEvent: frameCountInEvent + 1,
              objectId: defaultObjectId,
            });
          } else  if (frameEvent.type === "putText" || frameEvent.type === "putImage") {
            if (frameCountInEvent === 0) {
              absoluteFrameCountToScheduledFrameEvents[currentFrameCount].push({
                ...putObjectFirstFrame!,
                frameCountInEvent: 1
              });
            } else {
              absoluteFrameCountToScheduledFrameEvents[
                fixedFrameCountInEvent
              ].push({
                event: frameEvent,
                frameCountInEvent: frameCountInEvent + 1,
                objectId: frameEvent.objectId || defaultObjectId ,
              });
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
