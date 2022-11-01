import { interpret, Interpreter } from "xstate";
import { RootModule } from "./modules/root";
import { DaemonContainer } from "./container";
import { inspect } from "@xstate/inspect";
import { createUploadMachine } from "./modules/upload/machine";
import pDefer from "p-defer";
import { Container, inject, injectable } from "inversify";
import { DaemonModule as _DaemonModule } from "./internals/interfaces";
import { NodeModule } from "./modules/node";
import { Module } from "./internals/decorators";

@injectable()
@Module()
export class DaemonModule {
	@inject<RootModule>(RootModule)
	private root!: RootModule;

	get Root() {
		return this.root;
	}

	start() {
		this.Root.Machine.start();
		return this;
	}
}

let d: DaemonModule;
