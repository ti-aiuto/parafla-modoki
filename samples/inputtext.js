window.frameEventsInputText = [
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
        content: `// 入力値をとってきて計算して結果を入れる処理
        const val = context.getTextValue("inputValue"); 
        context.setTextValue("result", Number(val) ** 2);`,
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
