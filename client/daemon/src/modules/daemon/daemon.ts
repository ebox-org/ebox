import { Container, inject, injectable } from "inversify";
import {
	ActorRef,
	assign,
	spawn,
	Actor,
	ActorRefFrom,
	interpret,
	StateFrom,
} from "xstate";
import { DaemonContainer } from "../../container";
import { Module } from "../../internals/decorators";
// import { createMessageMachine, MessageMachine } from "../message";
import { NodeModule } from "../node";
import { NodeMapModule } from "../node-map";
import { createNodeMapMachine } from "../node-map/machine";
import { createDaemonMachine } from "./machine";

export type DaemonMachineFactory = ReturnType<typeof createDaemonMachine>;
export const DaemonMachineFactory = Symbol("DaemonMachineFactory");

export type DaemonMachine = ReturnType<DaemonMachineFactory>;

export type DaemonMachineRef = ActorRefFrom<DaemonMachine>;

@injectable()
@Module({
	setup(container: Container) {
		container
			.bind<DaemonMachineFactory>(DaemonMachineFactory)
			.toFactory(createDaemonMachine);

		container.bind<DaemonModule>(DaemonModule).toSelf();
	},
})
export class DaemonModule {
	public RootActor;

	constructor(
		@inject<DaemonMachineFactory>(DaemonMachineFactory)
		private daemonMachineFactory: DaemonMachineFactory
	) {
		this.RootActor = interpret(this.daemonMachineFactory(), {
			devTools: true,
		}).start();
	}

	stop() {
		this.RootActor.stop();
	}

	@inject(NodeModule)
	public readonly NodeModule!: NodeModule;

	@inject(NodeMapModule)
	public readonly NodeMap!: NodeMapModule;
}
