import { inject, injectable } from "inversify";
import { Module } from "../../internals/decorators";
import { DaemonModule } from "../../internals/interfaces";
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
		private readonly machineFactory: NodeMapMachineFactory
	) {}

	public createMachine() {
		return this.machineFactory();
	}
}
