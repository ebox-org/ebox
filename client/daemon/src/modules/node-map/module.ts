import { Container } from "inversify";

import { ModuleOption } from "../../internals/decorators";
import { createNodeMapMachine, NodeMapMachineFactory } from "./machine";

export const NodeMapModule: ModuleOption = {
	setup(container: Container) {
		container
			.bind<NodeMapMachineFactory>(NodeMapMachineFactory)
			.toFactory(createNodeMapMachine);
	},
};
