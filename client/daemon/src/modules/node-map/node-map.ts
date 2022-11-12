import { inject, injectable } from "inversify";
import { StateFrom } from "xstate";

import { Context } from "../../internals/context-module";
import { ebModule } from "../../internals/decorators";
import { DaemonMachine } from "../daemon/machine";
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
@ebModule({
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
