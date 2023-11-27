(function () {
  function scheduleFrameEvents(frameEvents) {
    const absoluteFrameCountToScheduledFrameEvents = {};
    let currentFrameCount = 1;

    frameEvents.forEach(function (frameEvent) {
      const objectId = frameEvent.objectId
        ? frameEvent.objectId
        : "auto" + Math.random(); // 値が未指定の場合もframeEvent内で一律で持てるとよい

      // この分岐はなくても動くが無駄なオブジェクトが生成されるのを避けたい
      if (
        frameEvent.type !== "doNothing" &&
        frameEvent.type !== "defineLabel"
      ) {
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
            frameCountInEvent,
            index
          ) {
            const fixedFrameCountInEvent = currentFrameCount + index;
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
              frameCountInEvent: index + 1,
              objectId: objectId,
            });
          });
        }
      }

      currentFrameCount += frameEvent.frameCount;
    });
    return absoluteFrameCountToScheduledFrameEvents;
  }
  window.scheduleFrameEvents = scheduleFrameEvents;

  function calcualteLabelFrameCount(frameEvents) {
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
  }
  window.calcualteLabelFrameCount = calcualteLabelFrameCount;
})();
