import { Boostrapper as _Boostrapper } from "@ebox/daemon";


// polyfills
window.global = window;

export const Boostrapper = new _Boostrapper();

export const WebAppContainer = Boostrapper.container;
