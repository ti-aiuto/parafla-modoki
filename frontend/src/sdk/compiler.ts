import { AssetsManager } from "./assets-manager";
import { ComponentSource, ComponentUserFunctions, LabelToFrameNumber, ScheduledEvents } from "./component-source";
import { FrameEvent } from "./frame-event";

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

    frameEvents.forEach((rawFrameEvent) => {
      const frameEvent = structuredClone(rawFrameEvent);
      if (frameEvent.type === "putText") {
        frameEvent["putText"]["text"] = this.assetsManager.findTextAssetOrThrow(frameEvent["putText"].assetId).text;
      } else if (frameEvent.type === "putImage") {
        frameEvent["putImage"]["image"] = this.assetsManager.findImageAssetOrThrow(frameEvent["putImage"].assetId).image;
        if (frameEvent["putImage"].hoverAssetId) {
          const hoverAsset = this.assetsManager.findImageAsset(frameEvent["putImage"].hoverAssetId);
          if (hoverAsset) {
            frameEvent["putImage"]["hoverImage"] = hoverAsset.image
          }
        }
        if (frameEvent["putImage"].activeAssetId) {
          const activeAsset = this.assetsManager.findImageAsset(frameEvent["putImage"].activeAssetId);
          if (activeAsset) {
            frameEvent["putImage"]["activeImage"] = activeAsset.image;
          }
        }
      }

      const objectId = frameEvent.objectId
        ? frameEvent.objectId
        : "auto" + Math.random(); // 値が未指定の場合もframeEvent内で一律で持てるとよい

      // この分岐はなくても動くが無駄なオブジェクトが生成されるのを避けたい
      if (frameEvent.type !== "defineLabel") {
        if (frameEvent.frameCount === 0) {
          if (!absoluteFrameCountToScheduledFrameEvents[currentFrameCount]) {
            absoluteFrameCountToScheduledFrameEvents[currentFrameCount] = [];
          }

          absoluteFrameCountToScheduledFrameEvents[currentFrameCount].push({
            event: frameEvent,
            frameCountInEvent: 0, // 便宜上0にしておく
            objectId: objectId,
          });
        } else {
          range(0, frameEvent.frameCount - 1).forEach(function (
            frameCountInEvent
          ) {
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
            absoluteFrameCountToScheduledFrameEvents[
              fixedFrameCountInEvent
            ].push({
              event: frameEvent,
              frameCountInEvent: frameCountInEvent + 1,
              objectId: objectId,
            });
          });
        }
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
