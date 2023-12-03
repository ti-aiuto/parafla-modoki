window.frameEventsDepth = [
  {
    type: "putImage",
    putImage: {
      assetId: 1,
    },
    depth: 1,
    frameCount: 0,
    layoutOptions: {
      x: 0,
      y: 0,
      width: 640,
      height: 480,
    },
  },
  {
    type: "doNothing",
    frameCount: 10,
  },
  {
    type: "putImage",
    putImage: {
      assetId: 2,
    },
    depth: 2,
    frameCount: 0,
    layoutOptions: {
      x: 320,
      y: 0,
      width: 640,
      height: 480,
    },
  },
  {
    type: "doNothing",
    frameCount: 10,
  },
  {
    type: "executeAction",
    frameCount: 0,
    executeAction: {
      type: "eraseLayers",
      eraseLayers: {
        depths: [1],
      },
    },
  },
  {
    type: "doNothing",
    frameCount: 10,
  },
  {
    type: "putImage",
    putImage: {
      assetId: 3,
    },
    depth: 1,
    frameCount: 0,
    layoutOptions: {
      x: 0,
      y: 0,
      width: 640,
      height: 480,
    },
  },
  {
    type: "doNothing",
    frameCount: 10,
  },
  {
    type: "executeAction",
    frameCount: 0,
    executeAction: {
      type: "eraseLayers",
      eraseLayers: {
        depths: ["all"],
      },
    },
  },
  {
    type: "doNothing",
    frameCount: 10,
  },
];
