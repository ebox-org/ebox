import { interpret, Interpreter } from "xstate";
import { createRootMachine, RootMachine, RootMachineCtx } from "./modules/root";
import { DaemonContainer } from "./container";
import { inspect } from "@xstate/inspect";
import { createUploadMachine } from "./modules/upload/machine";
import pDefer from "p-defer";
import { Container, inject, injectable } from "inversify";
import { DaemonModule as _DaemonModule } from "./internals/interfaces";
import { NodeDaemon } from "./modules/node";

@injectable()
export class Daemon {
	@inject<NodeDaemon>(NodeDaemon)
	private node!: NodeDaemon;

	get Node() {
		return this.node;
	}
}

let d: Daemon;

export const DaemonModule: _DaemonModule = {
	setup(container: Container) {
		container.bind(Daemon).toSelf();
	},
};
