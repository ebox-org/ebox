import { ActorRefFrom, assign, createMachine, spawn } from "xstate";
import { DaemonContainer } from "../../container";
import * as Ports from "../../ports";
import { faker } from "@faker-js/faker";
import { over } from "ok-value-error-reason";

import * as Op from "./operations.generated";
import { sendParent } from "xstate/lib/actions";

export interface Message {
	fromID: string;
	messageID: string;
	messageType: string;
	content: string;
}

export interface MessageCtx {
	nodeID: string;
	messages: Message[];
	sendRef: ActorRefFrom<SendMachine>;
}

export const createMessageMachine = (
	container: DaemonContainer,
	nodeID: string
) => {
	const logger = container.get(Ports.LoggerFactory).createLogger("node");

	const Api = container.get(Ports.Api);

	return createMachine<MessageCtx>(
		{
			id: "message",
			initial: "idle",
			context: {
				nodeID,
				messages: [],
				sendRef: spawn(createSendMachine(container, nodeID)),
			},
			states: {
				idle: {
					always: {
						target: "fetching",
					},
				},
				fetching: {
					invoke: {
						src: "getMessages",
						onDone: {
							target: "fetched",
							actions: ["setMessages"],
						},
						onError: "fetchedFailed",
					},
				},
				fetched: {
					after: {
						2000: {
							target: "fetching",
						},
					},
				},
				fetchedFailed: {
					after: {
						5000: "fetching",
					},
				},
			},
		},
		{
			actions: {
				setMessages: assign((ctx, event) => {
					const messages = event.data;

					return {
						messages,
					};
				}),
			},
			services: {
				getMessages: async (ctx, event) => {
					logger.debug("start get message");

					const res = await Api.query<
						Op.GetMessageQuery,
						Op.GetMessageQueryVariables
					>({
						query: Op.GetMessageDocument,
						variables: {
							toID: nodeID,
						},
						fetchPolicy: "network-only",
					});

					if (res.errors) {
						throw res.errors;
					}

					const messages = res.data?.getMessage ?? [];

					logger.info("get message done");

					return messages;
				},
			},
		}
	);
};

export type MessageMachine = ReturnType<typeof createMessageMachine>;

export type SendMachineEvent = {
	type: "SEND";
	toID: string;
	msgType?: string;
	content: string;
};

export interface SendMachineCtx {
	nodeID: string;
}

export const createSendMachine = (
	container: DaemonContainer,
	nodeID: string
) => {
	const logger = container.get(Ports.LoggerFactory).createLogger("node");

	const Api = container.get(Ports.Api);

	return createMachine<SendMachineCtx, SendMachineEvent>(
		{
			id: "sendMessage",
			initial: "idle",
			context: { nodeID },
			states: {
				idle: {
					on: {
						SEND: {
							target: "sending",
						},
					},
				},
				sending: {
					invoke: {
						src: "sendMessage",
						onDone: {
							actions: ["signalFetch"],
							target: "idle",
						},
						onError: "idle",
					},
				},
			},
		},
		{
			actions: {
				signalFetch: sendParent("GET"),
			},
			services: {
				sendMessage: async (ctx, event) => {
					logger.debug("start get message");

					const res = await Api.mutate<
						Op.SendMsgToMutation,
						Op.SendMsgToMutationVariables
					>({
						mutation: Op.SendMsgToDocument,
						variables: {
							msgInput: {
								toID: event.toID,
								content: event.content,
								fromID: ctx.nodeID,
								messageType: event.msgType ?? "text",
							},
						},
					});

					if (res.errors) {
						throw res.errors;
					}

					logger.info("message sent");
				},
			},
		}
	);
};

export type SendMachine = ReturnType<typeof createSendMachine>;
