import {AssetsManager} from './sdk/assets-manager';
import {Compiler} from './sdk/compiler';
import {Component} from './sdk/component';
import {ObjectBuilder} from './sdk/object-builder';
import {Renderer} from './sdk/renderer';
import {RootController} from './sdk/root-controller';
import {ScreenObjectsManager} from './sdk/screen-object-manager';

// import "core-js/stable";
// import Vue from "vue";
// new Vue({
//   data() {
//     return { 'test': 'hoge ' }
//   }
// }).$mount("#app");

const root = window as any;
root.Compiler = Compiler;
root.Renderer = Renderer;
root.RootController = RootController;
root.Component = Component;
root.ScreenObjectsManager = ScreenObjectsManager;
root.AssetsManager = AssetsManager;
root.ObjectBuilder = ObjectBuilder;
