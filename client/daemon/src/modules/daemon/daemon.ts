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
import { UploadModule } from "../upload";
import { createDaemonMachine, DaemonMachineFactory } from "./machine";

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
		private createMachine: DaemonMachineFactory,

		@inject(NodeModule)
		public readonly NodeModule: NodeModule,

		@inject(NodeMapModule)
		public readonly NodeMap: NodeMapModule,

		@inject(UploadModule)
		public readonly Upload: UploadModule
	) {
		this.RootActor = interpret(this.createMachine(), {
			devTools: true,
		}).start();
	}

	stop() {
		this.RootActor.stop();
	}
}
