window.frameEvents = [
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
      content: "image1",
      borderColor: "#000000",
      borderStyle: "solid",
      borderWidth: "1",
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
      type: "executeScript",
      executeScript: {
        content: "context.gotoAndPlay('image1')",
      },
    },
  },

  {
    type: "putText",
    putText: {
      content: "image2",
      borderColor: "#000000",
      borderStyle: "solid",
      borderWidth: "1",
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
      type: "executeScript",
      executeScript: {
        content: "context.gotoAndPlay('image2')",
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

  // {
  //   type: "executeAction",
  //   frameCount: 1,
  //   executeAction: {
  //     type: "gotoAndPlay",
  //     gotoAndPlay: {
  //       destination: "titleScreen",
  //     },
  //   },
  // },
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
      source:
        "https://blog.ta.kasaki.info/wp-content/uploads/2022/06/IMG_20220522_182837929-1152x1536.jpg",
    },
    depth: 1,
    frameCount: 0,
    layoutOptions: {
      x: 0,
      y: 0,
      width: 120,
      height: 120,
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
      source:
        "https://blog.ta.kasaki.info/wp-content/uploads/2022/06/IMG_20220524_122351263-1536x1152.jpg",
    },
    depth: 1,
    frameCount: 0,
    layoutOptions: {
      x: 20,
      y: 20,
      width: 120,
      height: 120,
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
