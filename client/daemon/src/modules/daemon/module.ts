import { Container, inject, injectable } from "inversify";
import { interpret } from "xstate";

import { ebModule } from "../../internals/decorators";
import { createDaemonMachine, DaemonMachineFactory } from "./machine";
import * as Selectors from "./selectors";

@injectable()
@ebModule({
	setup(container: Container) {
		container
			.bind<DaemonMachineFactory>(DaemonMachineFactory)
			.toFactory(createDaemonMachine);

		container.bind<DaemonModule>(DaemonModule).toSelf();
	},
})
export class DaemonModule {
	public readonly actor;

	constructor(
		@inject<DaemonMachineFactory>(DaemonMachineFactory)
		private createMachine: DaemonMachineFactory
	) {
		this.actor = interpret(this.createMachine(), {
			devTools: true,
		}).start();
	}

	stop() {
		this.actor.stop();
	}
}
