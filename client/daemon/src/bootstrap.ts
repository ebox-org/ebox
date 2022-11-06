import { interpret } from "xstate";
import { inspect } from "@xstate/inspect";
import { Container, inject, injectable } from "inversify";
import { SendMessageModule } from "./modules/send-message";
import { DaemonModule } from "./modules/daemon";
import { NodeModule } from "./modules/node";
import { NodeMapModule } from "./modules/node-map";
import { getModuleMetadata } from "./internals/decorators";
import { LocationModule } from "./modules/location";
import { MessageModule } from "./modules/message";
import { ContextModule } from "./internals/context-module";
import { UploadModule } from "./modules/upload/upload";

export class Boostrapper {
	readonly container;

	constructor() {
		this.container = new Container();
	}

	static readonly modules = [
		ContextModule,
		DaemonModule,
		NodeModule,
		NodeMapModule,
		LocationModule,
		MessageModule,
		SendMessageModule,
		UploadModule,
	];

	private bindAll() {
		Boostrapper.modules.forEach((module) => {
			if (typeof module === "function") {
				getModuleMetadata(module)?.setup(this.container);
			} else if (typeof module === "object") {
				module.setup(this.container);
			}
		});
	}

	bootstrap() {
		this.bindAll();
		return this.container.resolve(DaemonModule);
	}
}
