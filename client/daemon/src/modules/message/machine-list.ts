import {
	ActorRefFrom,
	assign,
	createMachine,
	EventObject,
	ExtractEvent,
	StateFrom,
} from "xstate";
import * as Ports from "../../ports";
import { faker } from "@faker-js/faker";
import { over } from "ok-value-error-reason";

import * as Op from "./operations.generated";
import { sendParent } from "xstate/lib/actions";
import { interfaces } from "inversify";
import { ActorCenterModule } from "../../internals/actor-center";
import { GlobalMQ } from "../../internals/global-mq";
import { ReceivedMessage } from "./machine-loader";

export interface Message {
	fromID: string;
	messageID: string;
	messageType: string;
	content: string;
}

export type PageInfo = {
	startCursor: string;
	hasPreviousPage: boolean;
	endCursor: string;
	hasNextPage: boolean;
};

export interface MessageListCtx {
	nodeID: string;
	toID: string;
	data: Message[];
	// pageInfo?: PageInfo;
}

export const LoadNext = "LoadNext";
export type LoadNext = EventObject & {
	type: typeof LoadNext;
};

export const LoadPrevious = "LoadPrevious";
export type LoadPrevious = EventObject & {
	type: typeof LoadPrevious;
};

export const Updated = "Updated";
export type Updated = EventObject & {
	type: typeof Updated;
};

export type MessageListMachineEvent =
	| EventObject
	| LoadNext
	| LoadPrevious
	| Updated;

export const createMessageListMachine =
	(ctx: interfaces.Context) => (nodeID: string, toID: string) => {
		const container = ctx.container;

		const logger = container
			.get<Ports.LoggerFactory>(Ports.LoggerFactory)
			.createLogger("message-list");

		const Api = container.get<Ports.Api>(Ports.Api);

		const gmq = container.get<GlobalMQ>(GlobalMQ);

		return createMachine<MessageListCtx, MessageListMachineEvent>(
			{
				id: "message-list",
				initial: "idle",
				context: {
					nodeID,
					toID,
					data: [],
				},
				states: {
					idle: {
						always: "loading",
					},
					loading: {
						invoke: {
							src: "load",
							onDone: {
								target: "loaded",
							},
						},
					},
					loaded: {
						on: {
							[LoadNext]: {
								target: "loading",
							},
							[LoadPrevious]: {
								target: "loading",
							},
							[Updated]: {
								target: "loading",
							},
						},
					},
				},
			},
			{
				actions: {},
				services: {
					load: (ctx) => async (sendBack) => {},
				},
			}
		);
	};

export type MessageListMachineFactory = ReturnType<
	typeof createMessageListMachine
>;
export const MessageListMachineFactory = Symbol("MessageListMachineFactory");

export type MessageListMachine = ReturnType<MessageListMachineFactory>;

export type MessageListMachineActor = ActorRefFrom<MessageListMachine>;

export type MessageListMachineState = StateFrom<MessageListMachine>;
