import { ActorRefFrom, assign, createMachine, spawn } from "xstate";
import { DaemonContainer } from "../../container";
import { faker } from "@faker-js/faker";

// import { createMessageMachine, MessageMachine } from "../message";
import { inject, injectable } from "inversify";
import { Module } from "../../internals/decorators";
import { createLocationMachine } from "./machine";

export type LocationMachineFactory = ReturnType<typeof createLocationMachine>;
export const LocationMachineFactory = Symbol("LocationMachineFactory");

export type LocationMachine = ReturnType<LocationMachineFactory>;

@injectable()
@Module({
	setup: (container) => {
		container
			.bind<LocationMachineFactory>(LocationMachineFactory)
			.toFactory(createLocationMachine);
		container.bind(LocationModule).toSelf();
	},
})
export class LocationModule {
	constructor(
		@inject(LocationMachineFactory)
		private locationMachineFactory: LocationMachineFactory
	) {}

	public createMachine(nodeID: string) {
		return this.locationMachineFactory(nodeID);
	}

	off() {}
}
