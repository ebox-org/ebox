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
import { Module } from "../../internals/decorators";
// import { createMessageMachine, MessageMachine } from "../message";
import { NodeModule } from "../node";
import { createNodeMapMachine } from "../node-map/machine";
import { createRootMachine } from "./machine";

export type RootMachineFactory = ReturnType<typeof createRootMachine>;
export const RootMachineFactory = Symbol("RootMachineFactory");

export type RootMachineRef = ActorRefFrom<typeof createRootMachine>;

@injectable()
@Module({
	setup(container: Container) {
		container
			.bind<RootMachineFactory>(RootMachineFactory)
			.toFactory(createRootMachine);

		container.bind<RootModule>(RootModule).toSelf();
	},
})
export class RootModule {
	private machine;

	public get Machine() {
		return this.machine;
	}

	constructor(
		@inject<RootMachineFactory>(RootMachineFactory)
		private rootMachineFactory: RootMachineFactory,

		@inject(NodeModule) private nodeModule: NodeModule
	) {
		this.machine = interpret(this.rootMachineFactory(), {
			devTools: true,
		});
	}
}
