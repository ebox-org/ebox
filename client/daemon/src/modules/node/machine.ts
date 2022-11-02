import { ActorRefFrom, assign, createMachine, spawn } from "xstate";
import { DaemonContainer } from "../../container";
import * as Ports from "../../ports";
import { faker } from "@faker-js/faker";

import {
	useRegisterMutation,
	RegisterDocument,
	RegisterMutationVariables,
	RegisterMutation,
} from "./operations.generated";
import { LocationMachine, LocationModule } from "../location";
import { MessageMachine } from "../message";
import { interfaces } from "inversify";
import { MessageModule } from "../message";
import { SendMachine } from "../send-message";

export interface NodeMachineCtx {
	nodeID?: string;
	locationRef?: ActorRefFrom<LocationMachine>;
	messageRef?: ActorRefFrom<MessageMachine>;
}

export type ResetNode = {
	type: "RESET_NODE";
};

const Key = "node-id";

export const createNodeMachine = (ctx: interfaces.Context) => () => {
	const container = ctx.container;

	const logger = ctx.container
		.get<Ports.LoggerFactory>(Ports.LoggerFactory)
		.createLogger("node");

	const kvStorage = ctx.container.get<Ports.KVStorage>(Ports.KVStorage);

	const Api = ctx.container.get<Ports.Api>(Ports.Api);

	return createMachine<NodeMachineCtx>(
		{
			id: "node",
			initial: "inactive",
			context: {},
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
							actions: "setNodeID",
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
				spawnLocation: assign((ctx, event) => {
					const locationRef = spawn(
						container
							.get<LocationModule>(LocationModule)
							.createMachine(ctx.nodeID!)
					);

					return {
						locationRef,
					};
				}),
				spawnMessageMachine: assign((ctx, event) => {
					return {
						messageRef: spawn(
							container
								.get<MessageModule>(MessageModule)
								.createMachine(ctx.nodeID!),
							"message"
						),
					};
				}),
			},
			services: {
				register: async (ctx, event) => {
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
