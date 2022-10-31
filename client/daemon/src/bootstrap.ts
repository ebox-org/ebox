import { interpret } from "xstate";
import { createRootMachine } from "./modules/root";
import { inspect } from "@xstate/inspect";
import { Container, inject, injectable } from "inversify";
// import { SendMessageModule } from "./modules/send-message";
import { RootModule } from "./modules/root/root";
import { DaemonModule, Daemon } from "./daemon";
// import { NodeModule } from "./modules/node";

inspect({
	// options
	// url: 'https://stately.ai/viz?inspect', // (default)
	iframe: false, // open in new window
});

export class Boostrapper {
	readonly container;

	constructor() {
		this.container = new Container();
	}

	static readonly modules = [
		DaemonModule,
		RootModule,
		// NodeModule,
		// SendMessageModule,
	];

	private bindAll() {
		Boostrapper.modules.forEach((module) => {
			module.setup(this.container);
		});
	}

	bootstrap() {
		this.bindAll();
		return this.container.resolve(Daemon);
	}
}
