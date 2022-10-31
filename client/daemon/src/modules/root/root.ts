import { Container, inject, injectable } from "inversify";
import {
	ActorRef,
	assign,
	spawn,
	Actor,
	ActorRefFrom,
	interpret,
} from "xstate";
import { DaemonContainer } from "../../container";
import { DaemonModule } from "../../internals/interfaces";
// import { createMessageMachine, MessageMachine } from "../message";
import { NodeDaemon } from "../node";
import { createNodeMapMachine } from "../node-map/machine";
import { createRootMachine } from "./machine";

export type RootMachineFactory = ReturnType<typeof createRootMachine>;
export const RootMachineFactory = Symbol("RootMachineFactory");

export type RootMachineRef = ActorRefFrom<typeof createRootMachine>;

@injectable()
export class Root {
	private machine;

	public get Machine() {
		return this.machine;
	}

	constructor(
		@inject<RootMachineFactory>(RootMachineFactory)
		private rootMachineFactory: RootMachineFactory,

		@inject(NodeDaemon) private nodeDaemon: NodeDaemon
	) {
		this.machine = interpret(this.rootMachineFactory());
	}
}

export const RootModule: DaemonModule = {
	setup(container: Container) {
		container
			.bind<RootMachineFactory>(RootMachineFactory)
			.toFactory(createRootMachine);

		container.bind<Root>(Root).toSelf();
	},
};
