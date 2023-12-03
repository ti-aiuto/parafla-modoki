const ComponentSource = function (scheduledEvents, labelToFrameNumber) {
  const instance = {};

  instance.scheduledEvents = scheduledEvents;
  instance.labelToFrameNumber = labelToFrameNumber;

  return instance;
};

const Compiler = function () {
  const instance = {};
  const range = (start, end) => [...Array(end + 1).keys()].slice(start);

  instance.formetFrameEvents = function (frameEvents) {
    // データ整形
    frameEvents.forEach(function (frameEvent) {
      if (["defineLabel"].includes(frameEvent.type)) {
        frameEvent.frameCount = 0;
      }
      if (["executeAction"].includes(frameEvent.type)) {
        if (["stop", "gotoAndPlay"].includes(frameEvent.executeAction.type)) {
          frameEvent.frameCount = 1;
        } else {
          frameEvent.frameCount = 0;
        }
      }
    });
  };

  instance.generateScheduledEvents = function (frameEvents) {
    const absoluteFrameCountToScheduledFrameEvents = {};
    let currentFrameCount = 1;

    frameEvents.forEach(function (frameEvent) {
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
  };

  instance.generateLabelToFrameNumber = function (frameEvents) {
    const labelToFrameCount = {};
    let currentFrameCount = 1;
    frameEvents.forEach(function (frameEvent) {
      if (frameEvent.type === "defineLabel") {
        const label = frameEvent.defineLabel.label;
        labelToFrameCount[label] = currentFrameCount;
      }

      currentFrameCount += frameEvent.frameCount;
    });
    return labelToFrameCount;
  };

  instance.compile = function (frameEvents) {
    instance.formetFrameEvents(frameEvents);

    const componentSource = ComponentSource(
      instance.generateScheduledEvents(frameEvents),
      instance.generateLabelToFrameNumber(frameEvents)
    );
    return componentSource;
  };

  return instance;
};
