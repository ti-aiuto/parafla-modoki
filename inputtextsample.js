window.frameEvents = [
  {
    type: "putText",
    putText: {
      content: "number",
      borderColor: "#000000",
      borderStyle: "solid",
      borderWidth: "0",
    },
    depth: 10,
    frameCount: 0,
    layoutOptions: {
      x: 200,
      y: 200,
      width: 60,
      height: 30,
    },
  },
  {
    type: "putText",
    putText: {
      content: "",
      borderColor: "#000000",
      borderStyle: "solid",
      borderWidth: "1",
      editable: true,
    },
    objectId: 'inputValue',
    depth: 11,
    frameCount: 0,
    layoutOptions: {
      x: 300,
      y: 200,
      width: 60,
      height: 30,
    },
  },
  {
    type: "putText",
    putText: {
      content: "Result",
      borderColor: "#000000",
      borderStyle: "solid",
      borderWidth: "0",
    },
    depth: 12,
    frameCount: 0,
    layoutOptions: {
      x: 200,
      y: 250,
      width: 60,
      height: 30,
    },
  },
  {
    type: "putText",
    putText: {
      content: "",
      borderColor: "#000000",
      borderStyle: "solid",
      borderWidth: "1",
      editable: true,
    },
    objectId: 'result',
    depth: 13,
    frameCount: 0,
    layoutOptions: {
      x: 300,
      y: 250,
      width: 60,
      height: 30,
    },
  },
  {
    type: "putText",
    putText: {
      content: "Calc",
      borderColor: "#000000",
      borderStyle: "solid",
      borderWidth: "1",
    },
    depth: 14,
    frameCount: 0,
    layoutOptions: {
      x: 200,
      y: 300,
      width: 60,
      height: 30,
    },
    onClickAction: {
      type: "executeScript",
      executeScript: {
        content: `const val = context.findTextObjectById("inputValue").getValue(); 
        context.findTextObjectById("result").setValue(Number(val) ** 2); ` 
      }
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
