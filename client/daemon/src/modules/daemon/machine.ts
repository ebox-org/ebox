import { interfaces } from "inversify";
import { createMachine, ActorRefFrom, assign, spawn } from "xstate";
import * as Ports from "../../ports";
import { NodeModule, NodeMachineFactory } from "../node";
import { NodeMapModule, NodeMapMachine } from "../node-map";

export interface DaemonMachineCtx {
	nodeRef?: ActorRefFrom<NodeMachineFactory>;
	nodeMapRef?: ActorRefFrom<NodeMapMachine>;
}
export const createDaemonMachine = (ctx: interfaces.Context) => () => {
	const logger = ctx.container
		.get<Ports.LoggerFactory>(Ports.LoggerFactory)
		.createLogger("daemon");

	return createMachine<DaemonMachineCtx>(
		{
			id: "daemon",
			initial: "initial",
			context: {} as DaemonMachineCtx,
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
				spawnNodeMachine: assign<DaemonMachineCtx>(() => {
					return {
						nodeRef: spawn(
							ctx.container.get<NodeModule>(NodeModule).createMachine(),
							"node"
						),
					};
				}),
				spawnNodeMapMachine: assign<DaemonMachineCtx>(() => {
					return {
						nodeMapRef: spawn(
							ctx.container.get<NodeMapModule>(NodeMapModule).createMachine(),
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
