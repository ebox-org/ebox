import { ActorRefFrom, assign, createMachine, send, spawn } from "xstate";
import * as Ports from "../../ports";
import { faker } from "@faker-js/faker";

import {
	useRegisterMutation,
	RegisterDocument,
	RegisterMutationVariables,
	RegisterMutation,
} from "./operations.generated";
import { interfaces } from "inversify";
import { type } from "os";
import { SetNodeIDEvent } from "../../internals/common-event";
import { ActorCenterModule } from "../../internals/actor-center";
import {
	LocationMachine,
	LocationMachineFactory,
	LocationModule,
} from "../location/module";
import { MessageRootMachine } from "../message/machine";
import { SendMachine } from "../send-message/machine";
import { SendMessageModule } from "../send-message/send-message";
import { MessageModule } from "../message/message";

export interface NodeMachineCtx {
	nodeID?: string;
	locationRef?: ActorRefFrom<LocationMachine>;
	messageRef?: ActorRefFrom<MessageRootMachine>;
	sendRef: ActorRefFrom<SendMachine>;
}

export type ResetNode = {
	type: "RESET_NODE";
};

export type NodeMachineEvent = ResetNode;

export type NodeMachineState = {
	value: "registered";
	context: NodeMachineCtx;
};

const Key = "node-id";

const MessageMachineID = "message";
const SendMachineID = "send";
const LocationMachineID = "location";

export const createNodeMachine = (ctx: interfaces.Context) => () => {
	const container = ctx.container;

	const logger = ctx.container
		.get<Ports.LoggerFactory>(Ports.LoggerFactory)
		.createLogger("node");

	const kvStorage = ctx.container.get<Ports.KVStorage>(Ports.KVStorage);

	const Api = ctx.container.get<Ports.Api>(Ports.Api);

	return createMachine<NodeMachineCtx, NodeMachineEvent, NodeMachineState>(
		{
			id: "node",
			initial: "inactive",
			context: {
				nodeID: undefined,
				locationRef: undefined,
				messageRef: undefined,
				sendRef: spawn(
					container.get<SendMessageModule>(SendMessageModule).createMachine(),
					SendMachineID
				),
			},
			states: {
				inactive: {
					always: {
						target: "registering",
					},
				},
				registering: {
					invoke: {
						src: "register",
						onDone: {
							actions: [
								"setNodeID",
								// "sendNodeIDToSendMachine",
								// "sendNodeIDToLocationMachine",
							],
							target: "registered",
						},
						onError: "registerFailed",
					},
				},
				registered: {
					entry: ["spawnLocation", "spawnMessageMachine"],
					on: {
						RESET_NODE: "resetting",
					},
				},
				resetting: {
					entry: [
						(ctx) => {
							ctx.locationRef?.stop?.();
							ctx.messageRef?.stop?.();
						},
					],
					invoke: {
						src: "resetNode",
						onDone: {
							target: "inactive",
						},
						onError: "inactive",
					},
				},
				registerFailed: {
					after: {
						5000: "registering",
					},
				},
			},
		},
		{
			actions: {
				setNodeID: assign((ctx, event: any) => {
					return {
						nodeID: event.data,
					};
				}),
				spawnMessageMachine: (ctx, _event) => {
					logger.debug("spawning message machine");

					const machine = container
						.get<MessageModule>(MessageModule)
						.createMachine(ctx.nodeID!);

					const actorCenter =
						container.get<ActorCenterModule>(ActorCenterModule);

					actorCenter.spawnActor(machine, MessageMachineID);
				},
				spawnLocation: (ctx, event) => {
					logger.debug("spawning location machine");

					const machine = container.get<LocationMachineFactory>(
						LocationMachineFactory
					)(ctx.nodeID!);

					const actorCenter =
						container.get<ActorCenterModule>(ActorCenterModule);

					actorCenter.spawnActor(machine, LocationMachineID);
				},
				// sendNodeIDToSendMachine: send(
				// 	(ctx, event: any) => {
				// 		return {
				// 			type: "SET_NODE_ID",
				// 			nodeID: event.data,
				// 		} as SetNodeIDEvent;
				// 	},
				// 	{
				// 		to: (ctx) => ctx.sendRef,
				// 	}
				// ),
				// sendNodeIDToLocationMachine: send(
				// 	(ctx, event: any) => {
				// 		return {
				// 			type: "SET_NODE_ID",
				// 			nodeID: event.data,
				// 		} as SetNodeIDEvent;
				// 	},
				// 	{
				// 		to: (ctx) => ctx.locationRef,
				// 	}
				// ),
			},
			services: {
				register: async (ctx, _event) => {
					const event = _event;

					logger.debug("registering node");

					const kv = await kvStorage.open("modules.node");

					let nodeID = await kv.getItem<string>(Key);

					if (!nodeID) {
						const res = await Api.mutate<
							RegisterMutation,
							RegisterMutationVariables
						>({
							mutation: RegisterDocument,
							variables: {
								name: `${faker.word.adjective()} ${faker.animal.type()}`,
							},
						});

						if (res.errors) {
							throw new Error(res.errors[0].message);
						}

						nodeID = res.data!.upNode!.nodeID;

						await kv.setItem(Key, nodeID);
					}

					logger.info(`node registered: ${nodeID}`);

					return nodeID;
				},
				resetNode: async (ctx, event) => {
					logger.debug("resetting node");

					const kv = await kvStorage.open("modules.node");

					await kv.remove(Key);

					logger.info("node reset");
				},
			},
		}
	);
};

export type NodeMachineFactory = ReturnType<typeof createNodeMachine>;
export const NodeMachineFactory = Symbol("NodeMachineFactory");

export type NodeMachine = ReturnType<NodeMachineFactory>;
