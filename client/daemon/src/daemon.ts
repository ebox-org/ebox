import { interpret, Interpreter } from "xstate";
import { createRootMachine, RootMachine, RootMachineCtx } from "./modules/root";
import { DaemonContainer } from "./container";
import { inspect } from "@xstate/inspect";
import { createUploadMachine } from "./modules/upload/machine";
import pDefer from "p-defer";

inspect({
	// options
	// url: 'https://stately.ai/viz?inspect', // (default)
	iframe: false, // open in new window
});

export function bootstrap(container: DaemonContainer) {
	const root = interpret(createRootMachine(container), { devTools: true });
	return root.start();
}

export class Boostrapper {
	readonly container;

	constructor() {
		this.container = new DaemonContainer();
	}

	bootstrap() {
		const root = start(this.container);
		const daemon = new Daemon(this.container, root);

		return daemon;
	}
}

function start(container: DaemonContainer) {
	const root = interpret(createRootMachine(container), {
		devTools: true,
	});

	root.start();
	return root;
}

type RootService = ReturnType<typeof start>;

export class Daemon {
	readonly container;

	readonly root;

	constructor(container: DaemonContainer, rootMachine: RootService) {
		this.container = container;
		this.root = rootMachine;
	}

	upload(file: File) {
		const defer = pDefer<string>();

		const svc = interpret(createUploadMachine(this.container, file));

		svc.onDone((e) => {
			const snapshot = svc.getSnapshot();

			if (snapshot.matches("uploaded")) {
				defer.resolve(snapshot.context.fid);
			} else {
				defer.reject(new Error("upload failed"));
			}
		});

		svc.start();

		return defer.promise;
	}
}
