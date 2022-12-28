import { ModuleOption } from '../../internals/decorators';
import { createLocationMachine } from './machine';

export type LocationMachineFactory = ReturnType<typeof createLocationMachine>;
export const LocationMachineFactory = Symbol("LocationMachineFactory");

export type LocationMachine = ReturnType<LocationMachineFactory>;

export const LocationModule: ModuleOption = {
	setup: (container) => {
		container
			.bind<LocationMachineFactory>(LocationMachineFactory)
			.toFactory(createLocationMachine);
	},
};
