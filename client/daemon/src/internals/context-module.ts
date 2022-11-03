import { interfaces } from "inversify";
import { DaemonModule } from "./interfaces";

export type Context = interfaces.Context;
export const Context = Symbol("Context");

export const contextFactory = (context: interfaces.Context) => {
	return context as Context;
};

export const ContextModule: DaemonModule = {
	setup: (container) => {
		container.bind(Context).toDynamicValue(contextFactory);
	},
};
