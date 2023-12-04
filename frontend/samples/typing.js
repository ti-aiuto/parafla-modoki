window.frameEventsTyping = [
  {
    type: "defineComponentUserFunction",
    defineComponentUserFunction: {
      name: "準備画面のキー押下時",
      content: `// スペースキーが押されたらプレイ画面にいく処理
      if (args.key === ' ') {
        context.unregisterGlobalKeydownListener('準備画面リスナー');
        context.gotoAndPlay('プレイ画面');
        return true;
      }
      `,
    },
    frameCount: 0,
  },
  {
    type: "defineComponentUserFunction",
    defineComponentUserFunction: {
      name: "カウントダウンのタイマーtick",
      content: `const nokoriJikan = context.decrementComponentUserVariable('nokoriJikan');
      context.setTextValue('nokorijikan', '{{nokoriJikan}}秒');
      
      if (nokoriJikan <= 0) {
        context.unregisterGlobalKeydownListener('タイピング画面キー押下リスナー');
        context.clearUserTimer('時間制限タイマー');
        context.gotoAndPlay('結果画面') 
      }
      `,
    },
    frameCount: 0,
  },
  {
    type: "defineComponentUserFunction",
    defineComponentUserFunction: {
      name: "タイピング中のキー押下時",
      content: `
      const currentUtsumoji = context.getComponentUserVariable('currentUtsumoji');
        if (!currentUtsumoji) {
          return true; // セット前
        }
        const cursor = context.getComponentUserVariable('cursor');
        const currentChar = currentUtsumoji[cursor];

        // TODO: ここでヘボン式など他の入力方法の考慮
        if (args.key === "Escape") {
          // やりなおし
          context.unregisterGlobalKeydownListener('タイピング画面キー押下リスナー');
          context.clearUserTimer('時間制限タイマー');
          context.gotoAndPlay('説明画面') 
        } else  if (currentChar === args.key) {
          // 打った文字が正しい場合

          // ここまでに打った位置を一つ進める
          const nextCursor = context.incrementComponentUserVariable('cursor');

          // ここまでで打った文字の表示
          context.setTextValue('uttamoji', currentUtsumoji.slice(0, nextCursor));  

          // 正しく打った個数の更新
          context.incrementComponentUserVariable('correctCount');

          if (nextCursor === currentUtsumoji.length) {
            // 全部の文字を打ち終わった場合
            const nextSaraCount = context.incrementComponentUserVariable('saraCount');
            context.setTextValue('saramaisuu', '打った皿の枚数:{{saraCount}}');

            if (nextSaraCount === 1) {
              context.gotoAndPlay('皿1枚目');
            } else if (nextSaraCount === 2) {
              context.gotoAndPlay('皿2枚目');
            } else if (nextSaraCount === 3) {
              context.gotoAndPlay('皿3枚目');
            } // TODO: 4枚目以降も要考慮 
          }
        } else {
          context.incrementComponentUserVariable('wrongCount');
        }
        return true;
      `,
    },
    frameCount: 0,
  },
  {
    type: "defineComponentUserFunction",
    defineComponentUserFunction: {
      name: "タイピング画面を開いたとき",
      content: `
      // タイピング画面の準備(キー操作の検知とカウントダウンの設定など)

      // 変数初期化
      context.setComponentUserVariable('nagashitaSushiCount', 0);
      context.setComponentUserVariable('currentUtsumoji', null);
      context.setComponentUserVariable('cursor', 0);
      context.setComponentUserVariable('saraCount', 0);
      context.setComponentUserVariable('correctCount', 0);
      context.setComponentUserVariable('wrongCount', 0);
      context.setComponentUserVariable('nokoriJikan', 10);

      // 表示初期化
      context.setTextValue('nokorijikan', '{{nokoriJikan}}秒');
      context.setTextValue('saramaisuu', '打った皿の枚数:{{saraCount}}');

      context.startUserTimer('時間制限タイマー', 'カウントダウンのタイマーtick', 1000);
      context.registerGlobalKeydownListener('タイピング画面キー押下リスナー', 'タイピング中のキー押下時');
      
      // 最初の一問目
      context.gotoAndPlay('寿司を流す');
    `,
    },
    frameCount: 0,
  },
  {
    type: "defineComponentUserFunction",
    defineComponentUserFunction: {
      name: "次に打つ単語を設定する",
      content: `// 次にタイプするお題を設定して、寿司を流し始める処理
      const nagashitaSushiCount = context.getComponentUserVariable('nagashitaSushiCount', 0);
      // これから出題する単語
      context.setComponentUserVariable('currentUtsumoji', ['misonikomi', 'kishimen', 'ebifurya', 'ebisen', 'motsunabe'][nagashitaSushiCount]);
      context.setTextValue("utsumoji", '{{currentUtsumoji}}');

      // 何文字目まで打ったかをリセットする
      context.setComponentUserVariable('cursor', 0);

      // これまでに打った文字を空にする
      context.setTextValue('uttamoji', '');  
      // 現在何問目か
      context.incrementComponentUserVariable('nagashitaSushiCount');
      `,
    },
    frameCount: 0,
  },

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
      assetId: 31,
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
      assetId: 41,
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
      assetId: 32,
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
      type: "registerGlobalKeydownListener",
      registerGlobalKeydownListener: {
        listenerId: "準備画面リスナー",
        componentUserFunctionName: '準備画面のキー押下時'
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
      assetId: 33,
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
      assetId: 43,
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
      assetId: 44,
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
      assetId: 45,
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
      assetId: 46,
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
      type: "callComponentUserFunction",
      callComponentUserFunction: {
        name: "タイピング画面を開いたとき",
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
      type: "callComponentUserFunction",
      callComponentUserFunction: {
        name: "次に打つ単語を設定する",
      },
    },
  },
  {
    type: "putImage",
    putImage: {
      assetId: 35,
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
      assetId: 36,
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
      assetId: 36,
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
      assetId: 36,
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
      assetId: 34,
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
      assetId: 42,
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
      assetId: 47,
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
      type: "setTextValue",
      setTextValue: {
        objectId: "seiseki",
        value:
          "正解キー数: {{correctCount}} 間違えたキー数: {{wrongCount}} 正答数: {{saraCount}}",
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
