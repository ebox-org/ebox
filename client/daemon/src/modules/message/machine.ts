import { ActorRefFrom, assign, createMachine, spawn } from "xstate";
import { DaemonContainer } from "../../container";
import * as Ports from "../../ports";
import { faker } from "@faker-js/faker";
import { over } from "ok-value-error-reason";

import * as Op from "./operations.generated";
import { sendParent } from "xstate/lib/actions";
import { interfaces } from "inversify";
import { SendMachine, SendMessageModule } from "../send-message";

export interface Message {
	fromID: string;
	messageID: string;
	messageType: string;
	content: string;
}

export interface MessageCtx {
	nodeID?: string;
	messages: Message[];
	sendRef: ActorRefFrom<SendMachine>;
}

export type SetNodeIDEvent = {
	type: "SET_NODE_ID";
	nodeID: string;
};

export type MessageMachineEvent = SetNodeIDEvent;

export const createMessageMachine = (ctx: interfaces.Context) => () => {
	const container = ctx.container;

	const logger = container
		.get<Ports.LoggerFactory>(Ports.LoggerFactory)
		.createLogger("message");

	const Api = container.get<Ports.Api>(Ports.Api);

	return createMachine<MessageCtx, MessageMachineEvent>(
		{
			id: "message",
			initial: "idle",
			context: {
				nodeID: undefined,
				messages: [],
				sendRef: spawn(
					container.get<SendMessageModule>(SendMessageModule).createMachine()
				),
			},
			states: {
				idle: {
					on: {
						SET_NODE_ID: {
							actions: assign((ctx, event) => {
								return {
									nodeID: event.nodeID,
								};
							}),
							target: "fetching",
						},
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
				setMessages: assign((ctx, event: any) => {
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
							toID: "",
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


export type MessageMachineFactory = ReturnType<typeof createMessageMachine>;
export const MessageMachineFactory = Symbol("MessageMachineFactory");

export type MessageMachine = ReturnType<MessageMachineFactory>;