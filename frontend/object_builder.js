const ObjectBuilder = function () {
  const instance = {};

  instance.buildImage = function (targetElement, styleElement, fullObjectId, image) {
    console.log(image);
    targetElement = document.createElement("div");
    const hover = image.hoverImage?.source
      ? `[data-full-object-id='${fullObjectId}']:hover { background-image: url("${image.hoverImage.source}"); }`
      : "";
    const active = image.activeImage?.source
      ? `[data-full-object-id='${fullObjectId}']:active { background-image: url("${image.activeImage.source}"); }`
      : "";

    styleElement.innerText = `
    [data-full-object-id='${fullObjectId}'] { background-image: url("${image.image.source}"); }
    ${hover}
    ${active}
    `;
    targetElement.style.backgroundRepeat = "no-repeat";
    targetElement.style.backgroundSize = "100% 100%";
  };

  instance.updateText = function (targetElement, text) {
    if (text.editable) {
      if (targetElement.value !== text.content) {
        targetElement.value = text.content;
      }
    } else {
      if (targetElement.innerHTML !== text.content) {
        targetElement.innerHTML = text.content; // XSS
      }
    }
    // 全部デフォルト値を持った上で上書きしたほうがいい
    if (text.borderWidth) {
      targetElement.style.borderWidth = `${text.borderWidth}px`;
    }
    if (text.borderStyle) {
      targetElement.style.borderStyle = text.borderStyle;
    }
    if (text.borderColor) {
      targetElement.style.borderColor = text.borderColor;
    }
    if (text.backgroundColor) {
      targetElement.style.backgroundColor = text.backgroundColor;
    }
    targetElement.style.boxSizing = "border-box";
  };

  return instance;
};
