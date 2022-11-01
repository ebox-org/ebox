import { Container } from "inversify";
import { Constructor, DaemonModule } from "./interfaces";

const DaemonModule = Symbol("DaemonModule");

export interface ModuleOption {
	setup(container: Container): void;
}

function buildOptions(target: Constructor, options?: ModuleOption) {
	if (options) {
		return options;
	}

	return {
		setup(container: Container) {
			container.bind(target).toSelf();
		},
	};
}

export function Module(options?: ModuleOption) {
	return function (target: Constructor) {
		const theOptions = buildOptions(target, options);

		Reflect.defineMetadata(DaemonModule, theOptions, target);
		return target;
	};
}

export function getModuleMetadata(target: any) {
	return Reflect.getMetadata(DaemonModule, target) as ModuleOption | undefined;
}
