import { ActorRefFrom, assign, createMachine, spawn } from "xstate";
import { DaemonContainer } from "../../container";
import { faker } from "@faker-js/faker";

import {
	useRegisterMutation,
	RegisterDocument,
	RegisterMutationVariables,
	RegisterMutation,
} from "./operations.generated";
import { LocationMachine } from "../location";
// import { createMessageMachine, MessageMachine } from "../message";
import { inject, injectable } from "inversify";
import { IModule } from "../../internals/interfaces";
import { createNodeMachine } from "./machine";
import { Module } from "../../internals/decorators";

export type NodeMachineFactory = ReturnType<typeof createNodeMachine>;
export const NodeMachineFactory = Symbol("NodeMachineFactory");

export type NodeMachine = ReturnType<NodeMachineFactory>;

@injectable()
@Module({
	setup: (container) => {
		container
			.bind<NodeMachineFactory>(NodeMachineFactory)
			.toFactory(createNodeMachine);
		container.bind(NodeModule).toSelf();
	},
})
export class NodeModule {
	constructor(
		@inject(NodeMachineFactory) private nodeMachineFactory: NodeMachineFactory
	) {}

	public createMachine() {
		return this.nodeMachineFactory();
	}

	off() {}
}
