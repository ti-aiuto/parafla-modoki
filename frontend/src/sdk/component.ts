import { Action } from "./action/action";
import { ComponentSource } from "./component-source";
import { Renderer } from "./renderer";
import { RootController } from "./root-controller";
import { ScreenObjectsManager } from "./screen-object-manager";

export class Component {
  rootController: RootController;
  componentSource: ComponentSource;
  screenObjectsManager: ScreenObjectsManager;
  renderer: Renderer;

  currentFrameCount: number = 1;
  jumpToFrameCount: number | null = null;
  lastFrameCount: number;
  rootInstanceId: string = "rootDummyHoge";
  componentUserVariables: { [key in string]: any } = {};
  componentUserFunctions: { [key in string]: string } = {};

  constructor(rootController: RootController,
    componentSource: ComponentSource,
    screenObjectsManager: ScreenObjectsManager,
    renderer: Renderer
  ) {
    this.rootController = rootController;
    this.componentSource = componentSource;
    this.screenObjectsManager = screenObjectsManager;
    this.renderer = renderer;

    this.lastFrameCount = Math.max.apply(
      null,
      Object.keys(componentSource.scheduledEvents).map((item) => Number(item))
    );

    this.componentUserFunctions = componentSource.componentUserFunctions;
  }

  handleAction(action: Action) {

  }

  callComponentUserFunction(name: string, args: object): boolean {
    return false;
  }
}
