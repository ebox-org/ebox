import {
	ActorRef,
	assign,
	createMachine,
	spawn,
	Actor,
	ActorRefFrom,
} from "xstate";
import { DaemonContainer } from "../../container";
import * as Ports from "../../ports";
import { createMessageMachine, MessageMachine } from "../message";
import { createNodeMachine, NodeMachine } from "../node";
import { createNodeMapMachine, NodeMapMachine } from "../node-map/machine";

export interface RootMachineCtx {
	nodeRef?: ActorRefFrom<NodeMachine>;
	nodeMapRef?: ActorRefFrom<NodeMapMachine>;
}

export const createRootMachine = (container: DaemonContainer) => {
	const logger = container.get(Ports.LoggerFactory).createLogger("daemon");

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
						nodeRef: spawn(createNodeMachine(container), "node"),
					};
				}),
				spawnNodeMapMachine: assign<RootMachineCtx>(() => {
					return {
						nodeMapRef: spawn(createNodeMapMachine(container), "nodeMap"),
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

export type RootMachine = ActorRefFrom<typeof createRootMachine>;