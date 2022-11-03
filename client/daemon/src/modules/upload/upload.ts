import { ActorRefFrom, assign, createMachine, spawn } from "xstate";
import { DaemonContainer } from "../../container";
import { faker } from "@faker-js/faker";

// import { createMessageMachine, MessageMachine } from "../message";
import { inject, injectable } from "inversify";
import { Module } from "../../internals/decorators";
import { createUploadMachine } from "./machine";

export type UploadMachineFactory = ReturnType<typeof createUploadMachine>;
export const UploadMachineFactory = Symbol("UploadMachineFactory");

export type UploadMachine = ReturnType<UploadMachineFactory>;

@injectable()
@Module({
	setup: (container) => {
		container
			.bind<UploadMachineFactory>(UploadMachineFactory)
			.toFactory(createUploadMachine);
		container.bind(LocationModule).toSelf();
	},
})
export class LocationModule {
	constructor(
		@inject(UploadMachineFactory)
		private uploadMachineFactory: UploadMachineFactory
	) {}

	public createMachine(file: File) {
		return this.uploadMachineFactory(file);
	}
}
