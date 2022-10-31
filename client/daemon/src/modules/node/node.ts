import { ActorRefFrom, assign, createMachine, spawn } from "xstate";
import { DaemonContainer } from "../../container";
import * as Ports from "../../_ports";
import { faker } from "@faker-js/faker";

import {
	useRegisterMutation,
	RegisterDocument,
	RegisterMutationVariables,
	RegisterMutation,
} from "./operations.generated";
import { createLocationMachine, LocationMachine } from "../location";
// import { createMessageMachine, MessageMachine } from "../message";
import { inject, injectable } from "inversify";
import { DaemonModule } from "../../internals/interfaces";
import { createNodeMachine } from "./machine";

export type NodeMachineFactory = ReturnType<typeof createNodeMachine>;
export const NodeMachineFactory = Symbol("NodeMachineFactory");

export type NodeMachine = ReturnType<NodeMachineFactory>;

@injectable()
export class NodeDaemon {
	constructor(
		@inject(NodeMachineFactory) private nodeMachineFactory: NodeMachineFactory
	) {}

	public createMachine() {
		return this.nodeMachineFactory();
	}

	off() {}
}

export const NodeModule: DaemonModule = {
	setup: (container) => {
		container
			.bind<NodeMachineFactory>(NodeMachineFactory)
			.toFactory(createNodeMachine);
		container.bind(NodeDaemon).toSelf();
	},
};
