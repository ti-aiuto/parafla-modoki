const Renderer = function () {
  const instance = {};
  const depthToLayerWrapper = {};

  instance.objectBuilder = ObjectBuilder();

  instance.render = function render(screenObjectsManager) {
    const depthToLayer = screenObjectsManager.depthToLayer;
    const root = document.getElementById("root");

    // TODO: ここの設定値も外から持ってくる
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
          instance.objectBuilder.initImage(
            styleElement,
            object.fullObjectId,
            object.image
          );
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
          targetElement.style.cursor = "pointer";
        } else {
          if (!object.text?.editable) {
            targetElement.style.cursor = "default";
          }
        }

        targetElement.dataset.fullObjectId = object.fullObjectId;
        targetElement.style.zIndex = depth;
        wrapper.appendChild(targetElement);
      }

      instance.objectBuilder.setLayoutOptionsToElement(
        targetElement,
        object.layoutOptions
      );
      if (object.type === "image") {
        // 画像の入れ替えは対応しない
      } else if (object.type === "text") {
        instance.objectBuilder.updateText(targetElement, object.text);
      }
    });
  };

  return instance;
};
