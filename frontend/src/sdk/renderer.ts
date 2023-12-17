import {ObjectBuilder} from './object-builder';
import {ScreenObjectsManager} from './screen-object-manager';

export class Renderer {
  objectBuilder: ObjectBuilder;
  screenObjectsManager: ScreenObjectsManager;
  depthToLayerWrapper: {[key in string]: HTMLElement};

  constructor(
    objectBuilder: ObjectBuilder,
    screenObjectsManager: ScreenObjectsManager
  ) {
    this.objectBuilder = objectBuilder;
    this.screenObjectsManager = screenObjectsManager;
    this.depthToLayerWrapper = {};
  }

  private removeLayer(depth: number) {
    const wrapper = this.depthToLayerWrapper[depth];
    while (wrapper.firstChild) {
      wrapper.removeChild(wrapper.firstChild);
    }
  }

  render() {
    const depthToLayer = this.screenObjectsManager.depthToLayer;
    const root = document.getElementById('root');
    if (!root) {
      throw new Error('root要素が見つかりません');
    }

    // TODO: ここの設定値も外から持ってくる
    root.style.width = '640px';
    root.style.height = '480px';
    root.style.position = 'relative';
    root.style.overflow = 'hidden';

    // TODO: 列挙順がdepth順になっていることを保証する
    Object.keys(this.depthToLayerWrapper).forEach(depth => {
      if (!depthToLayer[depth]) {
        this.removeLayer(Number(depth)); // なくなってたら消す
      }
    });
    Object.keys(depthToLayer).forEach(depth => {
      const layer = depthToLayer[depth];

      if (!this.depthToLayerWrapper[depth]) {
        const newWrapper = document.createElement('div');
        // TODO: ここでposition: absolute, zindex, width, height設定
        root.appendChild(newWrapper);
        this.depthToLayerWrapper[depth] = newWrapper;
        newWrapper.dataset.depth = depth;
      }

      const wrapper = this.depthToLayerWrapper[depth];
      const object = layer && layer.object;
      if (!object) {
        // 何もなくなってたら消すだけ
        this.removeLayer(Number(depth));
        return;
      }

      const candidateElement = wrapper.firstChild as HTMLElement | undefined;
      if (
        candidateElement &&
        candidateElement.dataset.fullObjectId === object.fullObjectId
      ) {
        const existingTargetElement = candidateElement;
        this.objectBuilder.setLayoutOptionsToElement(
          existingTargetElement,
          object.layoutOptions
        );
        if (object.type === 'text') {
          this.objectBuilder.updateText(existingTargetElement, object.text);
        }
      } else {
        console.debug('cache無し');
        while (wrapper.firstChild) {
          wrapper.removeChild(wrapper.firstChild);
        }

        const newTargetElement = this.objectBuilder.putObject(
          wrapper,
          object,
          Number(depth)
        );
        this.objectBuilder.setLayoutOptionsToElement(
          newTargetElement,
          object.layoutOptions
        );
        if (object.type === 'text') {
          this.objectBuilder.updateText(newTargetElement, object.text);
        }
      }
    });
  }
}
