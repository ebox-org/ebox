import { interfaces } from "inversify";
import {
	ActorRefFrom,
	AnyEventObject,
	assign,
	createMachine,
	spawn,
} from "xstate";

import {
	ActorCenterMachine,
	ActorCenterModule,
} from "../../internals/actor-center";
import * as Ports from "../../ports";
import { NodeMachine, NodeModule } from "../node";
import { NodeMapMachine, NodeMapModule } from "../node-map";

export interface DaemonMachineCtx {
	actorCenterRef?: ActorRefFrom<ActorCenterMachine>;
	nodeRef?: ActorRefFrom<NodeMachine>;
	nodeMapRef?: ActorRefFrom<NodeMapMachine>;
}

export type DaemonMachineEvent = AnyEventObject;

export type DaemonMachineState =
	| {
			value: "initial";
			context: DaemonMachineCtx;
	  }
	| {
			value: "running";
			context: DaemonMachineCtx;
	  };

export const createDaemonMachine = (ctx: interfaces.Context) => () => {
	const logger = ctx.container
		.get<Ports.LoggerFactory>(Ports.LoggerFactory)
		.createLogger("daemon");

	const actorCenter = ctx.container.get<ActorCenterModule>(ActorCenterModule);

	return createMachine<DaemonMachineCtx, AnyEventObject, DaemonMachineState>(
		{
			id: "daemon",
			initial: "initial",
			context: {},
			states: {
				initial: {
					entry: ["spawnActorCenter"],
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
					entry: ["spawnNodeMachine", "spawnNodeMapMachine"],
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
				spawnActorCenter: assign<DaemonMachineCtx>(() => {
					logger.debug("spawning actor center");

					const ref = spawn(actorCenter.createMachine(), "actor-center");

					actorCenter.setRef(ref);

					return {
						actorCenterRef: ref,
					};
				}),
				spawnNodeMachine: assign<DaemonMachineCtx>(() => {
					logger.debug("spawning node machine");
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
