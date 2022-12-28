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
import { Message } from "./machine-list";


export interface MessageLoaderCtx {
	nodeID: string;
	buffer: Set<string>;
}

export type MessageLoaderMachineEvent = EventObject;

export const ReceivedMessage = "ReceivedMessage";
export type ReceivedMessage = {
	topic: typeof ReceivedMessage;
	message: Message;
};

export const createMessageLoaderMachine =
	(ctx: interfaces.Context) => (nodeID: string) => {
		const container = ctx.container;

		const logger = container
			.get<Ports.LoggerFactory>(Ports.LoggerFactory)
			.createLogger("MessageLoader");

		const Api = container.get<Ports.Api>(Ports.Api);

		const globalMQ = container.get<GlobalMQ>(GlobalMQ);

		return createMachine<MessageLoaderCtx, MessageLoaderMachineEvent>(
			{
				id: "message-loader",
				initial: "idle",
				context: {
					nodeID,
					buffer: new Set(),
				},
				states: {
					idle: {
						always: "fetching",
					},
					fetching: {
						invoke: {
							src: "getMessages",
							onDone: {
								target: "enqueuing",
							},
							onError: "fetchedFailed",
						},
					},
					enqueuing: {
						invoke: {
							src: "enqueueMessage",
							onDone: {
								target: "fetched",
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
				actions: {},
				services: {
					getMessages: async (ctx, event) => {
						logger.debug("start get message");

						const res = await Api.query<
							Op.GetMessageQuery,
							Op.GetMessageQueryVariables
						>({
							query: Op.GetMessageDocument,
							variables: {
								toID: ctx.nodeID!,
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
					enqueueMessage: (ctx, _event: any) => async (send) => {
						const data = _event.data as Message[];

						logger.debug(`got ${data.length}`);

						for (let m of data) {
							if (ctx.buffer.has(m.messageID)) {
								continue;
							}

							logger.debug(`sending message to mq ${m.messageID}`);

							await globalMQ.send<ReceivedMessage>({
								topic: ReceivedMessage,
								message: m,
							});

							ctx.buffer.add(m.messageID);

							logger.info(`sent message to mq ${m.messageID}`);
						}
					},
				},
			}
		);
	};

export type MessageLoaderMachineFactory = ReturnType<
	typeof createMessageLoaderMachine
>;
export const MessageLoaderMachineFactory = Symbol(
	"MessageLoaderMachineFactory"
);

export type MessageLoaderMachine = ReturnType<MessageLoaderMachineFactory>;

export type MessageLoaderMachineActor = ActorRefFrom<MessageLoaderMachine>;

export type MessageLoaderMachineState = StateFrom<MessageLoaderMachine>;
