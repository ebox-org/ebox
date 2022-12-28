import { Container, interfaces } from "inversify";
import { interpret } from "xstate";

import { ActorCenterModule } from "./internals/actor-center";
import { ContextModule } from "./internals/context-module";
import { getModuleMetadata } from "./internals/decorators";
import { GlobalMQModule } from "./internals/global-mq";
import { DaemonMachineFactory } from "./modules/daemon/machine";
import { DaemonModule } from "./modules/daemon/module";
import { LocationModule } from "./modules/location/module";
import { MessageModule } from "./modules/message/module";
import { NodeMapModule } from "./modules/node-map/module";
import { NodeModule } from "./modules/node/node";
import { SendMessageModule } from "./modules/send-message/send-message";
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
		const machine =
			this.container.get<DaemonMachineFactory>(DaemonMachineFactory)();

		return interpret(machine, {
			devTools: true,
		}).start();
	}
}
