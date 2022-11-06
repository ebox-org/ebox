import { interfaces } from "inversify";
import { ActorRefFrom, assign, createMachine, spawn } from "xstate";

import * as Ports from "../../ports";
import { NodeMachine, NodeModule } from "../node";
import { NodeMapMachine, NodeMapModule } from "../node-map";
import { UploadMachine } from "../upload";

export interface DaemonMachineCtx {
	nodeRef?: ActorRefFrom<NodeMachine>;
	nodeMapRef?: ActorRefFrom<NodeMapMachine>;
	uploadRef?: ActorRefFrom<UploadMachine>;
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

export type DaemonMachineFactory = ReturnType<typeof createDaemonMachine>;
export const DaemonMachineFactory = Symbol("DaemonMachineFactory");

export type DaemonMachine = ReturnType<DaemonMachineFactory>;

export type DaemonMachineRef = ActorRefFrom<DaemonMachine>;
