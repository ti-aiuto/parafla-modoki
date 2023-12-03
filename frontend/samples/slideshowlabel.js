window.frameEventsSlideshowLabel = [
  {
    type: "defineLabel",
    defineLabel: {
      label: "titleScreen",
    },
    frameCount: 0,
  },

  {
    type: "putText",
    putText: {
      assetId: 11,
    },
    depth: 10,
    frameCount: 0,
    layoutOptions: {
      x: 200,
      y: 200,
      width: 60,
      height: 30,
    },
    onClickAction: {
      type: "gotoAndPlay",
      gotoAndPlay: {
        destination: "image1",
      },
    },
  },

  {
    type: "putText",
    putText: {
      assetId: 12,
    },
    depth: 11,
    frameCount: 0,
    layoutOptions: {
      x: 300,
      y: 200,
      width: 60,
      height: 30,
    },
    onClickAction: {
      type: "gotoAndPlay",
      gotoAndPlay: {
        destination: "image2",
      },
    },
  },

  {
    type: "executeAction",
    frameCount: 1,
    executeAction: {
      type: "stop",
    },
  },

  {
    type: "defineLabel",
    defineLabel: {
      label: "image1",
    },
    frameCount: 0,
  },
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
    type: "executeAction",
    frameCount: 1,
    executeAction: {
      type: "stop",
    },
  },

  {
    type: "defineLabel",
    defineLabel: {
      label: "image2",
    },
    frameCount: 0,
  },
  {
    type: "putImage",
    putImage: {
      assetId: 2,
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
    type: "executeAction",
    frameCount: 1,
    executeAction: {
      type: "stop",
    },
  },
];
