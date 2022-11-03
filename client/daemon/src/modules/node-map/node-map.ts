import { inject, injectable } from "inversify";
import { Context } from "../../internals/context-module";
import { Module } from "../../internals/decorators";
import { DaemonModule } from "../../internals/interfaces";
import { RootModule } from "../root";
import { createNodeMapMachine } from "./machine";

export type NodeMapMachineFactory = ReturnType<typeof createNodeMapMachine>;
export const NodeMapMachineFactory = Symbol("NodeMapMachineFactory");

export type NodeMapMachine = ReturnType<NodeMapMachineFactory>;

@injectable()
@Module({
	setup: (container) => {
		container.bind(NodeMapMachineFactory).toFactory(createNodeMapMachine);
		container.bind(NodeMapModule).toSelf();
	},
})
export class NodeMapModule {
	/**
	 *
	 */
	constructor(
		@inject(NodeMapMachineFactory)
		private readonly machineFactory: NodeMapMachineFactory,

		@inject(Context)
		private readonly context: Context
	) {}

	public createMachine() {
		return this.machineFactory();
	}

	get Actor() {
		const root = this.context.container.get<RootModule>(RootModule);

		return root.Actor.getSnapshot().context.nodeMapRef;
	}
}
