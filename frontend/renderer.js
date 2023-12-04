const Renderer = function () {
  const instance = {};
  const depthToLayerWrapper = {};

  function setLayoutOptionsToElement(element, layoutOptions) {
    element.style.position = "absolute";
    element.style.width = `${layoutOptions.width}px`;
    element.style.height = `${layoutOptions.height}px`;
    element.style.left = `${layoutOptions.x}px`;
    element.style.top = `${layoutOptions.y}px`;
  }

  instance.render = function render(screenObjectsManager) {
    const depthToLayer = screenObjectsManager.depthToLayer;
    const root = document.getElementById("root");

    // TODO: ここの設定値も外から持ってくる
    root.style.border = "solid 1px #000";
    root.style.width = "640px";
    root.style.height = "480px";
    root.style.position = "relative";
    root.style.overflow = "hidden";

    // TODO: 列挙順がdepth順になっていることを保証する
    Object.keys(depthToLayer).forEach(function (depth) {
      const layer = depthToLayer[depth];

      if (!depthToLayerWrapper[depth]) {
        const newWrapper = document.createElement("div");
        // TODO: ここでposition: absolute, zindex, width, height設定
        root.appendChild(newWrapper);
        depthToLayerWrapper[depth] = newWrapper;
        newWrapper.dataset.depth = depth;
      }

      const wrapper = depthToLayerWrapper[depth];
      const object = layer && layer.object;
      if (!object) {
        // 何もなくなってたら消すだけ
        if (wrapper.firstChild) {
          wrapper.removeChild(wrapper.firstChild);
        }
        if (wrapper.firstChild) {
          // styleも削除
          wrapper.removeChild(wrapper.firstChild);
        }
        return;
      }

      let targetElement = null;
      const candidateElement = wrapper.firstChild;
      if (
        candidateElement &&
        candidateElement.dataset.fullObjectId === object.fullObjectId
      ) {
        targetElement = candidateElement;
      }

      if (!targetElement) {
        console.debug("cache無し");
        if (wrapper.firstChild) {
          wrapper.removeChild(wrapper.firstChild);
        }
        if (wrapper.firstChild) {
          // styleも削除
          wrapper.removeChild(wrapper.firstChild);
        }

        const styleElement = document.createElement("style");
        wrapper.appendChild(styleElement);

        if (object.type === "image") {
          targetElement = document.createElement("div");

          const hover = object.hoverImage?.source
            ? `[data-full-object-id='${object.fullObjectId}']:hover { background-image: url("${object.hoverImage.source}"); }`
            : "";
          const active = object.activeImage?.source
            ? `[data-full-object-id='${object.fullObjectId}']:active { background-image: url("${object.activeImage.source}"); }`
            : "";

          styleElement.innerText = `
        [data-full-object-id='${object.fullObjectId}'] { background-image: url("${object.image.source}"); }
        ${hover}
        ${active}
        `;
          targetElement.style.backgroundRepeat = "no-repeat";
          targetElement.style.backgroundSize = "100% 100%";
        } else if (object.type === "text") {
          if (object.text.editable) {
            targetElement = document.createElement("input");
            targetElement.addEventListener("input", function (event) {
              object.text.content = event.target.value; // 中間データオブジェクトに同期しておく
            });
          } else {
            targetElement = document.createElement("div");
          }
        }

        if (object.onClickAction) {
          targetElement.style.cursor = 'pointer';
        } else {
          if (!object.text?.editable) {
            targetElement.style.cursor = 'default';
          }
        }

        targetElement.dataset.fullObjectId = object.fullObjectId;
        targetElement.style.zIndex = depth;
        wrapper.appendChild(targetElement);
      }

      const layoutOptions = object.layoutOptions;
      setLayoutOptionsToElement(targetElement, layoutOptions);
      if (object.type === "image") {
        // 画像の入れ替えは対応しない
      } else if (object.type === "text") {
        if (object.text.editable) {
          if (targetElement.value !== object.text.content) {
            targetElement.value = object.text.content;
          }
        } else {
          if (targetElement.innerHTML !== object.text.content) {
            targetElement.innerHTML = object.text.content; // XSS
            object.text.content = targetElement.innerHTML; // ブラウザがinnerHTMLを補正する可能性がありそう
          }
        }
        if (object.onClickAction) {
          targetElement.style.cursor = "pointer";
        }
        // 全部デフォルト値を持った上で上書きしたほうがいい
        if (object.text.borderWidth) {
          targetElement.style.borderWidth = `${object.text.borderWidth}px`;
        }
        if (object.text.borderStyle) {
          targetElement.style.borderStyle = object.text.borderStyle;
        }
        if (object.text.borderColor) {
          targetElement.style.borderColor = object.text.borderColor;
        }
        if (object.text.backgroundColor) {
          targetElement.style.backgroundColor = object.text.backgroundColor;
        }
      }
    });
  };

  return instance;
};
