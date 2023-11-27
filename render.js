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
    element.addEventListener("click", function () {
      console.log("click", element, action);
      handleAction(action);
    });
  }

  function render(depthToLayer, { handleAction, rootInstanceId }) {
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

      // TODO: ここで必要なければremoveしない実装にできるとよい
      const wrapper = depthToLayerWrapper[depth];
      const object = layer && layer.object;
      if (!object) {
        if (wrapper.firstChild) {
          wrapper.removeChild(wrapper.firstChild);
        }
        return;
      }

      let targetElement = null;
      if (object.useCache) {
        const candidateElement = wrapper.firstChild;
        if (
          candidateElement.dataset.objectId ===
          rootInstanceId + "_" + object.objectId
        ) {
          targetElement = candidateElement;
          // console.log('cache利用');
        }
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
          } else {
            targetElement = document.createElement("div");
          }
        }
      }

      targetElement.dataset.objectId = rootInstanceId + "_" + object.objectId;
      const layoutOptions = object.layoutOptions;

      if (object.type === "image") {
        targetElement.src = object.image.source;
        wrapper.appendChild(targetElement);
        setLayoutOptionsToElement(targetElement, layoutOptions);
        setOnClickActionListener(
          targetElement,
          object.onClickAction,
          handleAction
        );
      } else if (object.type === "text") {
        if (object.text.editable) {
          targetElement.value = object.text.content;
        } else {
          targetElement.innerText = object.text.content;
        }
        wrapper.appendChild(targetElement);
        setLayoutOptionsToElement(targetElement, layoutOptions);
        setOnClickActionListener(
          targetElement,
          object.onClickAction,
          handleAction
        );

        if (object.text.borderWidth) {
          targetElement.style.borderWidth = `${object.text.borderWidth}px`;
        }
        if (object.text.borderStyle) {
          targetElement.style.borderStyle = object.text.borderStyle;
        }
        if (object.text.borderColor) {
          targetElement.style.borderColor = object.text.borderColor;
        }
      }
    });
  }

  window.renderer = {render};
})();
