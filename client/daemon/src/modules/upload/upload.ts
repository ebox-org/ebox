import { ActorRefFrom, assign, createMachine, interpret, spawn } from "xstate";
import { waitFor } from "xstate/lib/waitFor";
import { faker } from "@faker-js/faker";

// import { createMessageMachine, MessageMachine } from "../message";
import { inject, injectable } from "inversify";
import { ebModule } from "../../internals/decorators";
import { createUploadMachine, UploadMachineFactory } from "./machine";

@injectable()
@ebModule({
	setup: (container) => {
		container
			.bind<UploadMachineFactory>(UploadMachineFactory)
			.toFactory(createUploadMachine);

		container.bind(UploadModule).toSelf();
	},
})
export class UploadModule {
	constructor(
		@inject(UploadMachineFactory)
		private uploadMachineFactory: UploadMachineFactory
	) {}

	public createMachine(file: File) {
		return this.uploadMachineFactory(file);
	}

	async uploadFile(file: File) {
		const machine = this.createMachine(file);
		const service = interpret(machine, {
			devTools: true,
		}).start();

		const state = await waitFor(service, (s) => !!s.done);

		if (state.value === "uploaded") {
			return state.context.fid!;
		}

		throw state.context.error;
	}
}
