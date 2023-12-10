import { ScreenLayer } from "./screen-layer";

export class ScreenObjectsManager {
  depthToLayer: { [key in string]: ScreenLayer | undefined } = {};

  eraseLayers(depths: number[] | 'all'[]) {
    if (depths[0] === 'all') {
      Object.keys(this.depthToLayer).forEach((eachDepth) => {
        this.depthToLayer[eachDepth] = undefined;
      });
    } else {
      (depths as number[]).forEach((eachDepth: number) => {
        this.depthToLayer[eachDepth] = undefined;
      });
    }
  };

  findLayersByDepths(depths: number[] | 'all'[]) {
    const result: ScreenLayer[] = [];
    if (depths[0] === 'all') {
      Object.keys(this.depthToLayer).forEach((eachDepth) => {
        const layer = this.depthToLayer[eachDepth];
        if (layer) {
          result.push(layer);
        }
      });
    } else {
      depths.forEach((eachDepth) => {
        const layer = this.depthToLayer[eachDepth];
        if (layer) {
          result.push(layer);
        }
      });
    }
    return result;
  };
}
