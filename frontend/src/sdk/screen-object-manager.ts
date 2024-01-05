import {ScreenLayer} from './screen/screen-layer';

export class ScreenObjectsManager {
  depthToLayer: {[key in string]: ScreenLayer} = {};

  eraseLayers(depths: number[] | 'all'[]) {
    if (depths[0] === 'all') {
      Object.keys(this.depthToLayer).forEach(eachDepth => {
        delete this.depthToLayer[eachDepth];
      });
    } else {
      (depths as number[]).forEach((eachDepth: number) => {
        delete this.depthToLayer[eachDepth];
      });
    }
  }

  findLayersByDepths(depths: number[] | 'all'[]) {
    const result: ScreenLayer[] = [];
    if (depths[0] === 'all') {
      Object.keys(this.depthToLayer).forEach(eachDepth => {
        const layer = this.depthToLayer[eachDepth];
        if (layer) {
          result.push(layer);
        }
      });
    } else {
      depths.forEach(eachDepth => {
        const layer = this.depthToLayer[eachDepth];
        if (layer) {
          result.push(layer);
        }
      });
    }
    return result;
  }

  findObjectByFullObjectId(fullObjectId: string) {
    return Object.values(this.depthToLayer).find(
      layer => layer.object.fullObjectId === fullObjectId
    );
  }
}
