import { Container, interfaces } from "inversify";

import { ActorCenterModule } from "./internals/actor-center";
import { ContextModule } from "./internals/context-module";
import { getModuleMetadata } from "./internals/decorators";
import { GlobalMQModule } from "./internals/global-mq";
import { DaemonModule } from "./modules/daemon/module";
import { LocationModule } from "./modules/location";
import { MessageModule } from "./modules/message";
import { NodeModule } from "./modules/node";
import { NodeMapModule } from "./modules/node-map";
import * as SendMessage from "./modules/send-message";
import { UploadModule } from "./modules/upload/upload";

function addGlobal(planAndResolve: interfaces.Next): interfaces.Next {
	return (args: interfaces.NextArgs) => {
		let result = planAndResolve(args);

		if (!(globalThis as any).$ebox) {
			(globalThis as any).$ebox = [];
		}

		(globalThis as any).$ebox.push(result);

		return result;
	};
}

export class Boostrapper {
	readonly container;

	constructor() {
		this.container = new Container({
			defaultScope: "Singleton",
		});
		this.container.applyMiddleware(addGlobal);
	}

	static readonly modules = [
		ContextModule,
		ActorCenterModule,
		GlobalMQModule,
		DaemonModule,
		NodeModule,
		NodeMapModule,
		LocationModule,
		MessageModule,
		SendMessage.Module,
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
