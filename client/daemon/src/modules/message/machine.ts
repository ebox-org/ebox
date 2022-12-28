import { interfaces } from "inversify";
import { ActorRefFrom, createMachine, EventObject, StateFrom } from "xstate";

import { ActorCenterModule } from "../../internals/actor-center";
import * as Ports from "../../ports";
import { MessageLoaderMachineFactory } from "./machine-loader";
import { MessageWriterMachineFactory } from "./machine-writer";

export type { SetNodeIDEvent } from "../../internals/common-event";

export interface MessageRootCtx {
	nodeID: string;
}

export const HandleMessage = "HandleMessage";
export type HandleMessage = {
	topic: typeof HandleMessage;
};

export type MessageRootMachineEvent = EventObject;

export const createMessageRootMachine =
	(ctx: interfaces.Context) => (nodeID: string) => {
		const container = ctx.container;

		const logger = container
			.get<Ports.LoggerFactory>(Ports.LoggerFactory)
			.createLogger("message");

		const actorCenter = container.get<ActorCenterModule>(ActorCenterModule);

		return createMachine<MessageRootCtx, MessageRootMachineEvent>(
			{
				id: "message",
				initial: "idle",
				context: {
					nodeID,
				},
				states: {
					idle: {
						always: "booting",
					},
					booting: {
						invoke: {
							src: "start",
							onDone: "running",
						},
					},
					running: {},
				},
			},
			{
				actions: {},
				services: {
					start: async (ctx) => {
						const messageWriterMachine =
							container.get<MessageWriterMachineFactory>(
								MessageWriterMachineFactory
							)(ctx.nodeID);

						actorCenter.spawnActor(messageWriterMachine, "message-writer");

						const messageLoaderMachine =
							container.get<MessageLoaderMachineFactory>(
								MessageLoaderMachineFactory
							)(ctx.nodeID);

						actorCenter.spawnActor(messageLoaderMachine, "message-loader");
					},
				},
			}
		);
	};

export type MessageRootMachineFactory = ReturnType<
	typeof createMessageRootMachine
>;
export const MessageRootMachineFactory = Symbol("MessageRootMachineFactory");

export type MessageRootMachine = ReturnType<MessageRootMachineFactory>;

export type MessageRootMachineActor = ActorRefFrom<MessageRootMachine>;

export type MessageRootMachineState = StateFrom<MessageRootMachine>;
