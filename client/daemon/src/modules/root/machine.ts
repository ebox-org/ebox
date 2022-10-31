import { interfaces } from "inversify";
import { createMachine, ActorRefFrom, assign, spawn } from "xstate";
import * as Ports from "../../ports";
import { NodeDaemon, NodeMachineFactory } from "../node";
import { NodeMap, NodeMapMachine } from "../node-map";

export interface RootMachineCtx {
	nodeRef?: ActorRefFrom<NodeMachineFactory>;
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
			context: {} as RootMachineCtx,
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
						nodeRef: spawn(
							ctx.container.get<NodeDaemon>(NodeDaemon).createMachine(),
							"node"
						),
					};
				}),
				spawnNodeMapMachine: assign<RootMachineCtx>(() => {
					return {
						nodeMapRef: spawn(
							ctx.container.get<NodeMap>(NodeMap).createMachine(),
							"nodeMap"
						),
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
