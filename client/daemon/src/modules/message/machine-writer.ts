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

export interface MessageWriterCtx {
	nodeID: string;
	after: string;
}

export const WroteMessage = "WroteMessage";
export type WroteMessage = EventObject & {
	type: typeof WroteMessage;
	wroteID: string;
};

export type MessageWriterMachineEvent = EventObject | WroteMessage;

export type MessageEntity = {
	toID: string;
	fromID: string;
	messageID: string;
	messageType: string;
	content: string;
};

export const createMessageWriterMachine =
	(ctx: interfaces.Context) => (nodeID: string) => {
		const container = ctx.container;

		const logger = container
			.get<Ports.LoggerFactory>(Ports.LoggerFactory)
			.createLogger("message-writer");

		const Api = container.get<Ports.Api>(Ports.Api);

		const gmq = container.get<GlobalMQ>(GlobalMQ);

		return createMachine<MessageWriterCtx, MessageWriterMachineEvent>(
			{
				id: "message-writer",
				initial: "idle",
				context: {
					nodeID,
					after: "-1",
				},
				states: {
					idle: {
						always: "listening",
					},
					listening: {
						invoke: {
							src: "listen",
						},
						on: {
							[WroteMessage]: {
								actions: "updateAfter",
								target: "listening",
							},
						},
					},
				},
			},
			{
				actions: {
					updateAfter: assign((ctx, _event) => {
						const event = _event as WroteMessage;

						return {
							...ctx,
							after: event.wroteID,
						};
					}),
				},
				services: {
					listen: (ctx) => async (sendBack) => {
						await gmq.receive<ReceivedMessage>(
							ReceivedMessage,
							async (mqm) => {
								logger.info("received message", mqm);

								const message = mqm.message;

								const repoName = "messages"; //`msg-${message.fromID}`;

								const repo = await container
									.get<Ports.RepositoryManager>(Ports.RepositoryManager)
									.open<MessageEntity>(repoName);

								const existing = await repo.find({
									limit: 1,
								});

								if (!existing.length) {
									await repo.create({
										fromID: message.fromID,
										toID: message.fromID,
										messageID: message.messageID,
										messageType: message.messageType,
										content: message.content,
									});
								}

								logger.debug("writing message", mqm);

								sendBack({
									type: WroteMessage,
									wroteID: mqm.id,
								});
							},
							{
								after: ctx.after,
							}
						);
					},
				},
			}
		);
	};

export type MessageWriterMachineFactory = ReturnType<
	typeof createMessageWriterMachine
>;
export const MessageWriterMachineFactory = Symbol(
	"MessageWriterMachineFactory"
);

export type MessageWriterMachine = ReturnType<MessageWriterMachineFactory>;

export type MessageWriterMachineActor = ActorRefFrom<MessageWriterMachine>;

export type MessageWriterMachineState = StateFrom<MessageWriterMachine>;
