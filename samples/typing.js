window.frameEventsTyping = [

  {
    type: "defineLabel",
    defineLabel: {
      label: "タイトル画面",
    },
    frameCount: 0,
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
    type: "putImage",
    putImage: {
      resourceId: 31,
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
    type: "putText",
    putText: {
      resourceId: 41,
    },
    depth: 2,
    frameCount: 0,
    layoutOptions: {
      x: 250,
      y: 300,
      width: 100,
      height: 30,
    },
    onClickAction: {
      type: "gotoAndPlay",
      gotoAndPlay: {
        destination: "説明画面",
      },
    },
  },
  // {
  //   type: "executeAction",
  //   executeAction: {
  //     type: "gotoAndPlay",
  //     gotoAndPlay: {
  //       destination: "プレイ画面",
  //     },
  //   },
  // },
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
      label: "説明画面",
    },
    frameCount: 0,
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
    type: "putImage",
    putImage: {
      resourceId: 32,
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
    frameCount: 0,
    executeAction: {
      type: "executeScript",
      executeScript: {
        content: `// スペースキーが押されたらプレイ画面にいく処理
        document.onkeydown = function(event) {
          if (event.key === ' ') {
            context.gotoAndPlay('プレイ画面');
            event.preventDefault();
          }
        }`,
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
  
  {
    type: "defineLabel",
    defineLabel: {
      label: "プレイ画面",
    },
    frameCount: 0,
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
    type: "putImage",
    putImage: {
      resourceId: 33,
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
    type: "putText",
    putText: {
      resourceId: 43,  
    },
    depth: 2,
    frameCount: 1,
    layoutOptions: {
      x: 350,
      y: 50,
      width: 150,
      height: 30,
    },
  },
  {
    type: "putText",
    putText: {
      resourceId: 44,
    },
    depth: 3,
    frameCount: 1,
    layoutOptions: {
      x: 250,
      y: 350,
      width: 150,
      height: 30,
    },
    objectId: 'utsumoji'
  },
  {
    type: "putText",
    putText: {
      resourceId: 45,
    },
    depth: 4,
    frameCount: 1,
    layoutOptions: {
      x: 250,
      y: 380,
      width: 150,
      height: 30,
    },
    objectId: 'uttamoji'
  },
  {
    type: "putText",
    putText: {
      resourceId: 46,
    },
    depth: 5,
    frameCount: 1,
    layoutOptions: {
      x: 50,
      y: 50,
      width: 150,
      height: 30,
    },
    objectId: 'saramaisuu'
  },
  {
    type: "executeAction",
    frameCount: 0,
    executeAction: {
      type: "executeScript",
      executeScript: {
        content: `
        // タイピング画面の準備(キー操作の検知とカウントダウンの設定など)

        // 変数初期化
        context.setUserVariable('nagashitaSushiCount', 0);
        context.setUserVariable('currentUtsumoji', null);
        context.setUserVariable('cursor', 0);
        context.setUserVariable('nokoriJikan', 5);

        const countDownTimerId = setInterval(function() { 
          const nokoriJikan = context.getUserVariable('nokoriJikan') - 1;
          context.setUserVariable('nokoriJikan', nokoriJikan);
          
          if (nokoriJikan <= 0) {
            clearInterval(countDownTimerId);
            document.onkeydown = null;

            context.setUserVariable('correctCount', correctCount);
            context.setUserVariable('wrongCount', wrongCount);
            context.setUserVariable('saraCount', saraCount);
            context.gotoAndPlay('結果画面') 
          }
        }, 1000);

        let correctCount = 0;
        let wrongCount = 0;
        let saraCount = 0;

        function updateSaramaisu() {
          const textObject = context.findTextObjectById("saramaisuu");
          textObject.setValue('打った皿の枚数:' + saraCount);
        }
        updateSaramaisu();

        document.onkeydown = function(event) {
          const currentUtsumoji = context.getUserVariable('currentUtsumoji');
          if (!currentUtsumoji) {
            return; // セット前
          }
          const cursor = context.getUserVariable('cursor', 0);

          const currentChar = currentUtsumoji[cursor];
          if (currentChar === event.key) {
            context.setUserVariable('cursor', cursor + 1);

            correctCount += 1;
            if (cursor + 1 === currentUtsumoji.length) {
              saraCount += 1;
              updateSaramaisu();
              context.gotoAndPlay('寿司を流す');
            }

            const textObject = context.findTextObjectById("uttamoji");
            textObject.setValue(currentUtsumoji.slice(0, cursor + 1));  
          } else {
            wrongCount += 1;
          }
        }
        
        context.gotoAndPlay('寿司を流す');
      `,
      
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

  {
    type: "defineLabel",
    defineLabel: {
      label: "寿司を流す",
    },
    frameCount: 0,
  },
  {
    type: "executeAction",
    frameCount: 0,
    executeAction: {
      type: "eraseLayers",
      eraseLayers: {
        depths: ["10"],
      },
    },
  },
  {
    type: "executeAction",
    frameCount: 0,
    executeAction: {
      type: "executeScript",
      executeScript: {
        content: `// 次にタイプするお題を設定して、寿司を流し始める処理
        const nagashitaSushiCount = context.getUserVariable('nagashitaSushiCount', 0);
        context.setUserVariable('currentUtsumoji', ['misonikomi', 'kishimen', 'ebifurya'][nagashitaSushiCount]);
        context.setUserVariable('cursor', 0);

        const currentUtsumoji = context.getUserVariable('currentUtsumoji');
        function updateUtsumoji() {
          const textObject = context.findTextObjectById("utsumoji");
          textObject.setValue(currentUtsumoji);
        }
        updateUtsumoji();

        const textObject = context.findTextObjectById("uttamoji");
        textObject.setValue('');  

        context.setUserVariable('nagashitaSushiCount', nagashitaSushiCount + 1);
      `,
      
      }
    },
  },
  {
    type: "putImage",
    putImage: {
      resourceId: 35,
    },
    depth: 10,
    frameCount: 30,
    layoutOptions: {
      x: 640,
      y: 100,
      width: 150,
      height: 150,
    },
    
    lastKeyFrame: {
      layoutOptions: {
        x: -150,
        y: 100,
        width: 150,
        height: 150,
      },
    },
  },
  {
    type: "executeAction",
    executeAction: {
      type: "gotoAndPlay",
      gotoAndPlay: {
        destination: "寿司を流す",
      },
    },
  },
// {
  //   type: "executeAction",
  //   frameCount: 1,
  //   executeAction: {
  //     type: "stop",
  //   },
  // },


  {
    type: "defineLabel",
    defineLabel: {
      label: "結果画面",
    },
    frameCount: 0,
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
    type: "putImage",
    putImage: {
      resourceId: 34,
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
    type: "putText",
    putText: {
      resourceId: 42,
    },
    depth: 2,
    frameCount: 0,
    layoutOptions: {
      x: 250,
      y: 300,
      width: 100,
      height: 30,
    },
    onClickAction: {
      type: "gotoAndPlay",
      gotoAndPlay: {
        destination: "タイトル画面",
      },
    },
  },
  {
    type: "putText",
    putText: {
      resourceId: 47,
    },
    depth: 3,
    frameCount: 1,
    layoutOptions: {
      x: 70,
      y: 250,
      width: 500,
      height: 30,
    },
    objectId: 'seiseki'
  },
  {
    type: "executeAction",
    frameCount: 0,
    executeAction: {
      type: "executeScript",
      executeScript: {
        content: `// 覚えているスコア情報を取り出して画面に表示する
        const correctCount = context.getUserVariable('correctCount');
        const wrongCount = context.getUserVariable('wrongCount');
        const saraCount = context.getUserVariable('saraCount');

        const textObject = context.findTextObjectById("seiseki");
        textObject.setValue(\`正解キー数: \${correctCount} 間違えたキー数: \${wrongCount} 正答数: \${saraCount} \`);  
      `,
      
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
