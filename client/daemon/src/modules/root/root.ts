import { Container, inject, interfaces } from "inversify";
import { injectable } from "tsyringe";
import {
	ActorRef,
	assign,
	createMachine,
	spawn,
	Actor,
	ActorRefFrom,
} from "xstate";
import { DaemonContainer } from "../../container";
import { DaemonModule } from "../../internals/interfaces";
import * as Ports from "../../ports";
import { createMessageMachine, MessageMachine } from "../message";
import { createNodeMachine, NodeMachine } from "../node";
import { createNodeMapMachine, NodeMapMachine } from "../node-map/machine";

export interface RootMachineCtx {
	nodeRef?: ActorRefFrom<NodeMachine>;
	nodeMapRef?: ActorRefFrom<NodeMapMachine>;
}

export const createRootMachine = (ctx: interfaces.Context) => () => {
	const logger = ctx.container
		.get<Ports.LoggerFactory>(Ports.LoggerFactory)
		.createLogger("daemon");

	return createMachine<RootMachineCtx>(
		{
			id: "root",
			initial: "initial",
			context: {},
			states: {
				initial: {
					always: {
						target: "validatingAdapters",
					},
				},
				validatingAdapters: {
					invoke: {
						src: "validateAdapters",
						onDone: "initializing",
						onError: "startFailed",
					},
				},
				initializing: {
					entry: [
						"spawnNodeMachine",
						"spawnNodeMapMachine",
						"spawnMessageMachine",
					],
					invoke: {
						src: "initialize",
						onDone: "running",
						onError: "startFailed",
					},
				},
				startFailed: {
					type: "final",
				},
				running: {
					on: {
						STOP: "stopping",
					},
				},
				stopping: {
					invoke: {
						src: "disposeAdapter",
						onDone: "stopped",
						onError: "stopFailed",
					},
				},
				stopFailed: {
					type: "final",
				},
				stopped: {
					type: "final",
				},
			},
		},
		{
			actions: {
				spawnNodeMachine: assign<RootMachineCtx>(() => {
					return {
						// nodeRef: spawn(createNodeMachine(ctx.container), "node"),
					};
				}),
				spawnNodeMapMachine: assign<RootMachineCtx>(() => {
					return {
						// nodeMapRef: spawn(createNodeMapMachine(ctx.container), "nodeMap"),
					};
				}),
			},
			services: {
				validateAdapters: async (ctx, event) => {
					//

					logger.info("Validated adapters");
				},
				initialize: async (ctx, event) => {
					logger.debug("Initializing daemon");

					logger.info("Initialized daemon");
				},
				disposeAdapter: async (ctx, event) => {
					//

					logger.info("Disposed adapter");
				},
			},
		}
	);
};

export const RootMachineFactory = Symbol("RootMachineFactory");
export type RootMachineFactory = typeof createRootMachine;

export type RootMachineRef = ActorRefFrom<typeof createRootMachine>;

@injectable()
class Root {
	@inject<RootMachineFactory>(RootMachineFactory)
	private rootMachineFactory!: RootMachineFactory;
}

export const RootMachineModule: DaemonModule = {
	setup(container: Container) {
		container
			.bind<RootMachineFactory>(RootMachineFactory)
			.toFactory(createRootMachine);

		container.bind<Root>(Root).toSelf();
	},
};
