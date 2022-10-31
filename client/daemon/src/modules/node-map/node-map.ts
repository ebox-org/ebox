import { inject, injectable } from "inversify";
import { DaemonModule } from "../../internals/interfaces";
import { createNodeMapMachine } from "./machine";

export type NodeMapMachineFactory = ReturnType<typeof createNodeMapMachine>;
export const NodeMapMachineFactory = Symbol("NodeMapMachineFactory");

export type NodeMapMachine = ReturnType<NodeMapMachineFactory>;

@injectable()
export class NodeMap {
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

export const NodeMapModule: DaemonModule = {
	setup: (container) => {
		container.bind(NodeMapMachineFactory).toFactory(createNodeMapMachine);
		container.bind(NodeMap).toSelf();
	},
};
