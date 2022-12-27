import { Container } from "inversify";

import { ModuleOption } from "../../internals/decorators";
import { createDaemonMachine, DaemonMachineFactory } from "./machine";

export const DaemonModule: ModuleOption = {
	setup(container: Container) {
		container
			.bind<DaemonMachineFactory>(DaemonMachineFactory)
			.toFactory(createDaemonMachine);
	},
};
