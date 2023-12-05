const ObjectBuilder = function() {
  const instance = {};

  instance.buildText = function(targetElement, text) {
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
    targetElement.style.boxSizing = 'border-box';
  }

  return instance;
}
