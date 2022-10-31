import { interpret } from "xstate";
import { inspect } from "@xstate/inspect";
import { Container, inject, injectable } from "inversify";
// import { SendMessageModule } from "./modules/send-message";
import { RootModule } from "./modules/root/root";
import { DaemonModule, Daemon } from "./daemon";
import { NodeModule } from "./modules/node";
import { NodeMapModule } from "./modules/node-map";

export class Boostrapper {
	readonly container;

	constructor() {
		this.container = new Container();
	}

	static readonly modules = [
		DaemonModule,
		RootModule,
		NodeModule,
		NodeMapModule,
		// SendMessageModule,
	];

	private bindAll() {
		Boostrapper.modules.forEach((module) => {
			module.setup(this.container);
		});
	}

	bootstrap() {
		this.bindAll();
		return this.container.resolve(Daemon).start();
	}
}
