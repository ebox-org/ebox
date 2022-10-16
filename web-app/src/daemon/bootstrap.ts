import { interpret } from "xstate";
import { createRootMachine } from "./modules/root";
import { DaemonContainer } from "./container";
import { inspect } from "@xstate/inspect";

inspect({
	// options
	// url: 'https://stately.ai/viz?inspect', // (default)
	iframe: false, // open in new window
});

export function bootstrap(container: DaemonContainer) {
	const root = interpret(createRootMachine(container), { devTools: true });
	return root.start();
}
