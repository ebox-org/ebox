import { inject, injectable } from "inversify";
import { ActorRefFrom, StateFrom } from "xstate";
import { Context } from "../../internals/context-module";
import { Module } from "../../internals/decorators";
import { IModule } from "../../internals/interfaces";
import { DaemonMachine, DaemonMachineRef, DaemonModule } from "../daemon";
import { createNodeMapMachine } from "./machine";

export type NodeMapMachineFactory = ReturnType<typeof createNodeMapMachine>;
export const NodeMapMachineFactory = Symbol("NodeMapMachineFactory");

export type NodeMapMachine = ReturnType<NodeMapMachineFactory>;

const selectNodeMap = (state: StateFrom<DaemonMachine>) =>
	state.context.nodeMapRef;

const selectNearbyNodes = (state: StateFrom<DaemonMachine>) =>
	selectNodeMap(state)?.getSnapshot()?.context.nearbyNodes;

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

	readonly Selector = {
		selectNodeMap,
		selectNearbyNodes,
	};
}
