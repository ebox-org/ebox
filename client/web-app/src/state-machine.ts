import { inspect } from "@xstate/inspect";
inspect({
	// options
	// url: 'https://stately.ai/viz?inspect', // (default)
	iframe: false, // open in new window
});

import "./adapters";

import { Boostrapper } from "./container";

export const Daemon = Boostrapper.bootstrap();

// Daemon.start();

(globalThis as any).$daemon = Daemon;

// type TypeSnapShot = ReturnType<typeof Daemon["root"]["getSnapshot"]>;

// type Selector<T> = (snapshot: TypeSnapShot) => T | undefined;

// export function useDaemonActor<T>(selector: Selector<T>) {
// 	const snapshot = Daemon.root.getSnapshot();

// 	const actor = selector(snapshot);

// 	return actor;
// }
