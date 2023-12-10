import { AssetsManager } from "@/sdk/assets-manager";
import { Compiler } from "@/sdk/compiler";
import { Component } from "@/sdk/component";
import { ObjectBuilder } from "@/sdk/object-builder";
import { Renderer } from "@/sdk/renderer";
import { RootController } from "@/sdk/root-controller";
import { ScreenObjectsManager } from "@/sdk/screen-object-manager";

function load(data: any) {
  const frameEvents = data["frameEvents"];
  const assetsManager = new AssetsManager(data["allIdToAsset"])
  const compiler = new Compiler(assetsManager);
  const screenObjectsManager = new ScreenObjectsManager();
  const renderer = new Renderer(new ObjectBuilder(), screenObjectsManager);
  const rootController = new RootController(document);
  const component = new Component(
    rootController,
    compiler.compile(frameEvents),
    screenObjectsManager,
    renderer
  );
  component.play();
  console.debug(component);

  setInterval(function () {
    (document.getElementById("frame") as any).value = component.currentFrameCount;

    const vars = component.componentUserVariables;
    let text = "";
    Object.keys(vars).forEach(function (key) {
      text += key;
      text += "\t\t";
      text += JSON.parse(vars[key]);
      text += "\n";
    });
    (document.getElementById("userVars") as any).value = text;
  }, 300);
}

let firstEvent = true;
window.addEventListener("message", function (e) {
  if (firstEvent) {
    if (`${e.data}`.includes('frameEvents')) {
      const data = JSON.parse(e.data) as any;
      load(data);  
      firstEvent = false;
    }
  }
});
