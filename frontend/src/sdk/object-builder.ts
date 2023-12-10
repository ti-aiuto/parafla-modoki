import { TextAssetContent } from "./asset/text-asset-content";
import { ButtonImageWithAssetContent } from "./frame-event/button-image-with-asset-content";
import { LayoutOptions } from "./frame-event/layout-options";

export class ObjectBuilder {
  setLayoutOptionsToElement(element: HTMLElement, layoutOptions: LayoutOptions) {
    element.style.position = "absolute";
    element.style.width = `${layoutOptions.width}px`;
    element.style.height = `${layoutOptions.height}px`;
    element.style.left = `${layoutOptions.x}px`;
    element.style.top = `${layoutOptions.y}px`;
  };

  initImage(styleElement: HTMLStyleElement, fullObjectId: string, image: ButtonImageWithAssetContent) {
    const hover = image.hoverImage?.source
      ? `[data-full-object-id='${fullObjectId}']:hover { background-image: url("${image.hoverImage.source}"); }`
      : "";
    const active = image.activeImage?.source
      ? `[data-full-object-id='${fullObjectId}']:active { background-image: url("${image.activeImage.source}"); }`
      : "";

    styleElement.innerText = `
    [data-full-object-id='${fullObjectId}'] { background-image: url("${image.image.source}"); background-repeat: no-repeat; background-size: cover; }
    ${hover}
    ${active}
    `;
  };

  updateText(targetElement: HTMLElement | HTMLInputElement, text: TextAssetContent) {
    if (text.editable && targetElement.tagName === 'input') {
      const targetInputElement = targetElement as HTMLInputElement;
      if (targetInputElement.value !== text.content) {
        targetInputElement.value = text.content;
      }
    } else {
      if (targetElement.innerHTML !== text.content) {
        targetElement.innerHTML = text.content; // XSS
      }
    }
    // 全部デフォルト値を持った上で上書きしたほうがいい
    if (text.textColor) {
      targetElement.style.color = text.textColor;
    }
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
    if (text.fontSize) {
      targetElement.style.fontSize = `${text.fontSize}px`;
    }
    if (text.padding) {
      targetElement.style.padding = `${text.padding}px`;
    }
    if (text.lineHeight) {
      targetElement.style.lineHeight = `${text.lineHeight}px`;
    }

    targetElement.style.boxSizing = "border-box";
  };
}

