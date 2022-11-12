import { ActorRefFrom, assign, createMachine, spawn } from "xstate";
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
import { createNodeMachine, NodeMachineFactory } from "./machine";
import { ebModule } from "../../internals/decorators";

@injectable()
@ebModule({
	setup: (container) => {
		container
			.bind<NodeMachineFactory>(NodeMachineFactory)
			.toFactory(createNodeMachine);
		container.bind(NodeModule).toSelf();
	},
})
export class NodeModule {
	constructor(
		@inject(NodeMachineFactory)
		public readonly createMachine: NodeMachineFactory
	) {}

	off() {}
}
