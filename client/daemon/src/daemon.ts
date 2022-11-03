import { interpret, Interpreter } from "xstate";
import { RootModule } from "./modules/root";
import { DaemonContainer } from "./container";
import { inspect } from "@xstate/inspect";
import { createUploadMachine } from "./modules/upload/machine";
import pDefer from "p-defer";
import { Container, inject, injectable } from "inversify";
import { NodeModule } from "./modules/node";
import { Module } from "./internals/decorators";
import { NodeMapModule } from "./modules/node-map";

@injectable()
@Module()
export class DaemonModule {
	@inject<RootModule>(RootModule)
	private root!: RootModule;

	get Root() {
		return this.root;
	}

	@inject(NodeMapModule)
	private nodeMap!: NodeMapModule;

	get NodeMap() {
		return this.nodeMap;
	}

	start() {
		this.Root.Actor.start();
		return this;
	}

	resetNode() {
		this.Root.Actor.getSnapshot().context.nodeRef?.send({
			type: "RESET_NODE",
		});
		return this;
	}

	uploadFile(file: File) {}
}
