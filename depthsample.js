window.frameEvents = [
  {
    type: "putImage",
    putImage: {
      source:
        "https://blog.ta.kasaki.info/wp-content/uploads/2022/06/IMG_20220522_182837929-1152x1536.jpg",
    },
    depth: 1,
    frameCount: 1,
    layoutOptions: {
      x: 0,
      y: 0,
      width: 120,
      height: 120,
    },
  },
  {
    type: "doNothing",
    frameCount: 9,
  },
  {
    type: "putImage",
    putImage: {
      source:
        "https://blog.ta.kasaki.info/wp-content/uploads/2022/06/IMG_20220524_122351263-1536x1152.jpg",
    },
    depth: 2,
    frameCount: 1,
    layoutOptions: {
      x: 20,
      y: 20,
      width: 120,
      height: 120,
    },
  },
  {
    type: "doNothing",
    frameCount: 9,
  },
  {
    type: "executeAction",
    frameCount: 0,
    executeAction: {
      type: 'eraseLayers',
      eraseLayers: {
        depths: [1]
      }
    }
  },
  {
    type: "doNothing",
    frameCount: 9,
  },
  {
    type: "putImage",
    putImage: {
      source:
        "https://blog.ta.kasaki.info/wp-content/uploads/2022/06/IMG_20220522_182837929-1152x1536.jpg",
    },
    depth: 1,
    frameCount: 1,
    layoutOptions: {
      x: 0,
      y: 0,
      width: 120,
      height: 120,
    },
  },
  {
    type: "doNothing",
    frameCount: 9,
  },
  {
    type: "executeAction",
    frameCount: 0,
    executeAction: {
      type: 'eraseLayers',
      eraseLayers: {
        depths: ['all']
      }
    }
  },
];
