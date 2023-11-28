(function () {
  const depthToLayerWrapper = {};

  function setLayoutOptionsToElement(element, layoutOptions) {
    element.style.position = "absolute";
    element.style.width = `${layoutOptions.width}px`;
    element.style.height = `${layoutOptions.height}px`;
    element.style.left = `${layoutOptions.x}px`;
    element.style.top = `${layoutOptions.y}px`;
  }

  function setOnClickActionListener(element, action, handleAction) {
    if (!action) {
      return;
    }
    element.onclick = function () {
      console.log("click", element, action);
      handleAction(action);
    };
  }

  function render(depthToLayer) {
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
      }

      const wrapper = depthToLayerWrapper[depth];
      const object = layer && layer.object;
      if (!object) {
        // 何もなくなってたら消すだけ
        if (wrapper.firstChild) {
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
        console.log("cache利用");
      }

      if (!targetElement) {
        if (wrapper.firstChild) {
          wrapper.removeChild(wrapper.firstChild);
        }
        if (object.type === "image") {
          targetElement = document.createElement("img");
        } else if (object.type === "text") {
          if (object.text.editable) {
            targetElement = document.createElement("input");
            targetElement.addEventListener("input", function (event) {
              object.text.content = event.target.value; // 元のオブジェクトに同期しておく
            });
          } else {
            targetElement = document.createElement("div");
          }
        }
        targetElement.dataset.fullObjectId = object.fullObjectId;
        targetElement.style.zIndex = depth;
        wrapper.appendChild(targetElement);
        setOnClickActionListener(
          targetElement,
          object.onClickAction,
          instance.handleAction
        );
      }

      const layoutOptions = object.layoutOptions;
      setLayoutOptionsToElement(targetElement, layoutOptions);
      if (object.type === "image") {
        targetElement.src = object.image.source;
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
          targetElement.style.cursor = "default";
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
  }

  const instance = { render };
  instance.findTextObjectByFullObjectId = function (fullId) {
    const element = document.querySelector(`[data-full-object-id="${fullId}"]`);
    if (!element) {
      return null;
    }
    return {
      element,
      getValue() {
        return element.value;
      },
      setValue(value) {
        if (element.tagName === "INPUT") {
          element.value = value;
        } else {
          element.innerHTML = value; // XSS
        }
      },
    };
  };

  instance.prepare = function ({ rootInstanceId, handleAction }) {
    instance.rootInstanceId = rootInstanceId;
    instance.handleAction = handleAction;
  };

  window.renderer = instance;
})();
