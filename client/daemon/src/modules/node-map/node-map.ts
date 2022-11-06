import { inject, injectable } from "inversify";
import { ActorRefFrom, StateFrom } from "xstate";
import { Context } from "../../internals/context-module";
import { Module } from "../../internals/decorators";
import { IModule } from "../../internals/interfaces";
import { DaemonMachine, DaemonMachineRef, DaemonModule } from "../daemon";
import {
	createNodeMapMachine,
	NodeMapMachine,
	NodeMapMachineFactory,
} from "./machine";

const selectNodeMap = (state: StateFrom<DaemonMachine>) =>
	state.context.nodeMapRef;

const selectNearbyNodes = (state: StateFrom<NodeMapMachine>) =>
	state.context.nearbyNodes;

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
		public readonly createMachine: NodeMapMachineFactory,

		@inject(Context)
		private readonly context: Context
	) {}

	selectNodeMap = selectNodeMap;

	selectNearbyNodes = selectNearbyNodes;
}
