import { AbstractAction } from "./abstract-action";

export interface EraseLayersAction extends AbstractAction {
  type: 'eraseLayers';
  eraseLayers: {
    depths: number[] | 'all'[];
  }
}
