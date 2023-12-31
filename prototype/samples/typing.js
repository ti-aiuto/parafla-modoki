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
    frameCount: 0,
    layoutOptions: {
      x: 350,
      y: 50,
      width: 150,
      height: 30,
    },
    objectId: "nokorijikan",
  },
  {
    type: "putText",
    putText: {
      resourceId: 44,
    },
    depth: 3,
    frameCount: 0,
    layoutOptions: {
      x: 250,
      y: 350,
      width: 150,
      height: 30,
    },
    objectId: "utsumoji",
  },
  {
    type: "putText",
    putText: {
      resourceId: 45,
    },
    depth: 4,
    frameCount: 0,
    layoutOptions: {
      x: 250,
      y: 380,
      width: 150,
      height: 30,
    },
    objectId: "uttamoji",
  },
  {
    type: "putText",
    putText: {
      resourceId: 46,
    },
    depth: 5,
    frameCount: 0,
    layoutOptions: {
      x: 50,
      y: 50,
      width: 150,
      height: 30,
    },
    objectId: "saramaisuu",
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
        // 他のイベントと共用の変数はユーザ定義変数にしておく
        context.setUserVariable('nagashitaSushiCount', 0);
        context.setUserVariable('currentUtsumoji', null);
        context.setUserVariable('cursor', 0);

        // このイベント内でしか使わない変数は通常のJSの変数
        let nokoriJikan = 5;
        let correctCount = 0;
        let wrongCount = 0;
        let saraCount = 0;

        function updateNokoriJikan() {
          context.setTextValue('nokorijikan', nokoriJikan);
        }
        updateNokoriJikan();

        const countDownTimerId = setInterval(function() { 
          nokoriJikan -= 1;
          updateNokoriJikan();
          
          if (nokoriJikan <= 0) {
            clearInterval(countDownTimerId);
            document.onkeydown = null;

            context.setUserVariable('correctCount', correctCount);
            context.setUserVariable('wrongCount', wrongCount);
            context.setUserVariable('saraCount', saraCount);
            context.gotoAndPlay('結果画面') 
          }
        }, 1000);

        function updateSaramaisu() {
          context.setTextValue('saramaisuu', '打った皿の枚数:' + saraCount);
        }
        updateSaramaisu();

        document.onkeydown = function(event) {
          const currentUtsumoji = context.getUserVariable('currentUtsumoji');
          if (!currentUtsumoji) {
            return; // セット前
          }
          const cursor = context.getUserVariable('cursor');
          const currentChar = currentUtsumoji[cursor];

          if (currentChar === event.key) {
            // 打った文字が正しい場合
            // TODO: ここでヘボン式など他の入力方法の考慮

            // どこまで打ったかを記憶
            context.setUserVariable('cursor', cursor + 1);

            // ここまでで打った文字の表示
            context.setTextValue('uttamoji', currentUtsumoji.slice(0, cursor + 1));  

            correctCount += 1;
            if (cursor + 1 === currentUtsumoji.length) {
              // 全部打ち終わった場合
              saraCount += 1;
              updateSaramaisu();
              // context.gotoAndPlay('寿司を流す');
              if (saraCount === 1) {
                context.gotoAndPlay('皿1枚目');
              } else if (saraCount === 2) {
                context.gotoAndPlay('皿2枚目');
              } else if (saraCount === 3) {
                context.gotoAndPlay('皿3枚目');
              } // TODO: 4枚目以降も要考慮 
            }
          } else {
            wrongCount += 1;
          }
        }
        
        // 最初の一問目
        context.gotoAndPlay('寿司を流す');
      `,
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
        // これから出題する単語
        context.setUserVariable('currentUtsumoji', ['misonikomi', 'kishimen', 'ebifurya'][nagashitaSushiCount]);
        const currentUtsumoji = context.getUserVariable('currentUtsumoji');
        context.setTextValue("utsumoji", currentUtsumoji);

        // 何文字目まで打ったかをリセットする
        context.setUserVariable('cursor', 0);

        // これまでに打った文字を空にする
        context.setTextValue('uttamoji', '');  
        // 現在何問目か
        context.setUserVariable('nagashitaSushiCount', nagashitaSushiCount + 1);
      `,
      },
    },
  },
  {
    type: "putImage",
    putImage: {
      resourceId: 35,
    },
    depth: 10,
    frameCount: 60,
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

  {
    type: "defineLabel",
    defineLabel: {
      label: "皿1枚目",
    },
    frameCount: 0,
  },
  {
    type: "putImage",
    putImage: {
      resourceId: 36,
    },
    depth: 21,
    frameCount: 0,
    layoutOptions: {
      x: 30,
      y: 400,
      width: 150,
      height: 50,
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

  {
    type: "defineLabel",
    defineLabel: {
      label: "皿2枚目",
    },
    frameCount: 0,
  },
  {
    type: "putImage",
    putImage: {
      resourceId: 36,
    },
    depth: 22,
    frameCount: 0,
    layoutOptions: {
      x: 30,
      y: 350,
      width: 150,
      height: 50,
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

  {
    type: "defineLabel",
    defineLabel: {
      label: "皿3枚目",
    },
    frameCount: 0,
  },
  {
    type: "putImage",
    putImage: {
      resourceId: 36,
    },
    depth: 23,
    frameCount: 0,
    layoutOptions: {
      x: 30,
      y: 300,
      width: 150,
      height: 50,
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
    objectId: "seiseki",
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

        context.setTextValue('seiseki', \`正解キー数: \${correctCount} 間違えたキー数: \${wrongCount} 正答数: \${saraCount} \`);  
      `,
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
