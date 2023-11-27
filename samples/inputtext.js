window.frameEvents = [
  {
    type: "putText",
    putText: {
      resourceId: 21,
    },
    objectId: "inputValue",
    depth: 11,
    frameCount: 0,
    layoutOptions: {
      x: 200,
      y: 200,
      width: 100,
      height: 30,
    },
  },
  {
    type: "putText",
    putText: {
      resourceId: 21,
    },
    objectId: "result",
    depth: 13,
    frameCount: 0,
    layoutOptions: {
      x: 200,
      y: 250,
      width: 100,
      height: 30,
    },
  },
  {
    type: "putText",
    putText: {
      resourceId: 22,
    },
    depth: 14,
    frameCount: 0,
    layoutOptions: {
      x: 200,
      y: 300,
      width: 100,
      height: 30,
    },
    onClickAction: {
      type: "executeScript",
      executeScript: {
        content: `const val = context.findTextObjectById("inputValue").getValue(); 
        context.findTextObjectById("result").setValue(Number(val) ** 2);`,
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
];
