import { interpret } from "xstate";
import { inspect } from "@xstate/inspect";
import { Container, inject, injectable } from "inversify";
// import { SendMessageModule } from "./modules/send-message";
import { RootModule } from "./modules/root/root";
import { DaemonModule } from "./daemon";
import { NodeModule } from "./modules/node";
import { NodeMapModule } from "./modules/node-map";
import { getModuleMetadata } from "./internals/decorators";
import { LocationModule } from "./modules/location";

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
		LocationModule,
		// SendMessageModule,
	];

	private bindAll() {
		Boostrapper.modules.forEach((module) => {
			if (typeof module === "function") {
				getModuleMetadata(module)?.setup(this.container);
			} else if (typeof module === "object") {
				// module.setup(this.container);
			}
		});
	}

	bootstrap() {
		this.bindAll();
		return this.container.resolve(DaemonModule).start();
	}
}
