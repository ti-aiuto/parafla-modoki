import { Action } from "./action/action";
import { ComponentSource } from "./component-source";
import { Renderer } from "./renderer";
import { RootController } from "./root-controller";
import { ScreenObjectsManager } from "./screen-object-manager";

export class Component {
  constructor(rootController: RootController,
    componentSource: ComponentSource,
    screenObjectsManager: ScreenObjectsManager,
    renderer: Renderer
  ) {

  }

  handleAction(action: Action) {

  }

  callComponentUserFunction(name: string, args: object): boolean {
    return false;
  }
}
