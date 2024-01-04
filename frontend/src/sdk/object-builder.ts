import {TextAssetContent} from './asset/text-asset-content';
import {ButtonImageWithAssetContent} from './frame-event/button-image-with-asset-content';
import {LayoutOptions} from './frame-event/layout-options';
import {ScreenObject} from './screen/screen-object';

export class ObjectBuilder {
  setLayoutOptionsToElement(
    element: HTMLElement,
    layoutOptions: LayoutOptions
  ) {
    element.style.position = 'absolute';
    element.style.width = `${layoutOptions.width}px`;
    element.style.height = `${layoutOptions.height}px`;
    element.style.left = `${layoutOptions.x}px`;
    element.style.top = `${layoutOptions.y}px`;
    if (layoutOptions.rotate) {
      element.style.transform= `rotate(${layoutOptions.rotate}deg)`;
    }
  }

  setCommonOptions(
    targetElement: HTMLElement,
    object: ScreenObject,
    depth: number
  ) {
    if (object.onClickAction) {
      targetElement.style.cursor = 'pointer';
    } else {
      if (object.type === 'text' && !object.text.editable) {
        targetElement.style.cursor = 'default';
      }
    }

    targetElement.dataset.fullObjectId = object.fullObjectId;
    targetElement.style.zIndex = `${depth}`;
  }

  putObject(
    wrapper: HTMLElement,
    object: ScreenObject,
    depth: number
  ): HTMLElement {
    if (object.type === 'image') {
      const styleElement = document.createElement('style');
      this.initImage(styleElement, object.fullObjectId, object.image);
      const targetElement = document.createElement('div');
      this.setCommonOptions(targetElement, object, depth);
      wrapper.appendChild(targetElement);
      wrapper.appendChild(styleElement);
      return targetElement;
    } else if (object.type === 'text') {
      if (object.text.editable) {
        const targetElement = document.createElement('input');
        targetElement.addEventListener(
          'input',
          (event: {target: EventTarget | null}) => {
            object.text.content = (event.target as HTMLInputElement).value; // 中間データオブジェクトに同期しておく
          }
        );
        this.setCommonOptions(targetElement, object, depth);
        wrapper.appendChild(targetElement);
        return targetElement;
      } else {
        const targetElement = document.createElement('div');
        this.setCommonOptions(targetElement, object, depth);
        wrapper.appendChild(targetElement);
        return targetElement;
      }
    } else {
      throw new Error(`想定外のオブジェクト: ${object}`);
    }
  }

  initImage(
    styleElement: HTMLStyleElement,
    fullObjectId: string,
    image: ButtonImageWithAssetContent
  ) {
    const hover = image.hoverImage?.source
      ? `[data-full-object-id='${fullObjectId}']:hover { background-image: url("${image.hoverImage.source}"); }`
      : '';
    const active = image.activeImage?.source
      ? `[data-full-object-id='${fullObjectId}']:active { background-image: url("${image.activeImage.source}"); }`
      : '';

    styleElement.innerText = `
    [data-full-object-id='${fullObjectId}'] { background-image: url("${image.image.source}"); background-repeat: no-repeat; background-size: cover; }
    ${hover}
    ${active}
    `;
  }

  updateText(
    targetElement: HTMLElement | HTMLInputElement,
    text: TextAssetContent
  ) {
    if (text.editable && targetElement.tagName === 'input') {
      const targetInputElement = targetElement as HTMLInputElement;
      if (targetInputElement.value !== text.content) {
        targetInputElement.value = text.content;
      }
    } else {
      if (targetElement.innerHTML !== text.content) {
        targetElement.innerHTML = text.content; // TODO: XSS, htmlEnabledの考慮
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
    if (text.align) {
      targetElement.style.textAlign = text.align;
    }
    if (text.fontFamily) {
      targetElement.style.fontFamily = text.fontFamily;
    }

    targetElement.style.boxSizing = 'border-box';
  }
}
