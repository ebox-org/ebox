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
import { createLocationMachine, LocationMachine } from "../location";
import { createMessageMachine, MessageMachine } from "../message";

export interface NodeMachineCtx {
	nodeID?: string;
	locationRef?: ActorRefFrom<LocationMachine>;
	messageRef?: ActorRefFrom<MessageMachine>;
}

export const createNodeMachine = (container: DaemonContainer) => {
	const logger = container.get(Ports.LoggerFactory).createLogger("node");

	const kvStorage = container.get(Ports.KVStorage);

	const Api = container.get(Ports.Api);

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
						createLocationMachine(container, ctx.nodeID!)
					);

					return {
						locationRef,
					};
				}),
				spawnMessageMachine: assign<NodeMachineCtx>((ctx, event) => {
					return {
						messageRef: spawn(
							createMessageMachine(container, ctx.nodeID!),
							"message"
						),
					};
				}),
			},
			services: {
				register: async (ctx, event) => {
					logger.debug("registering node");

					const Key = "node-id";

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
			},
		}
	);
};

export type NodeMachine = ReturnType<typeof createNodeMachine>;
