import { interfaces } from "inversify";
import { assign, createMachine, sendParent, EventObject } from "xstate";
import * as Ports from "../../ports";
import * as Op from "../message/operations.generated";
import { SetNodeIDEvent } from "../../internals/common-event";

export interface ThreadWriterCtx {
	nodeID: string;
}

export const ReceivedMessage = "ReceivedMessage";
export type ReceivedMessage = {
	type: "ReceivedMessage";
	toID: string;
	content: string;
	msgType?: string;
};

export type ThreadWriterEvent = EventObject | ReceivedMessage;

export const createThreadWriterMachine =
	(ctx: interfaces.Context) => (nodeID: string) => {
		const logger = ctx.container
			.get<Ports.LoggerFactory>(Ports.LoggerFactory)
			.createLogger("ThreadWriter");

		const Api = ctx.container.get<Ports.Api>(Ports.Api);

		return createMachine<ThreadWriterCtx, ThreadWriterEvent>(
			{
				id: "send",
				initial: "idle",
				context: { nodeID },
				on: {},
				states: {
					idle: {
						always: "subscribing",
					},
					subscribing: {
						invoke: {
							src: "subscribe",
							onDone: "running",
						},
					},
					running: {
						on: {
							[ReceivedMessage]: {
								actions: ["updateThread"],
							},
						},
					},
				},
				exit: [],
			},
			{
				actions: {
					updateThread: async (ctx, _event) => {
						const event = _event as ReceivedMessage;

						//
					},
				},
				services: {
					subscribe: (ctx, _event) => (send) => {},
				},
			}
		);
	};

export type ThreadWriterMachineFactory = ReturnType<
	typeof createThreadWriterMachine
>;
export const ThreadWriterMachineFactory = Symbol("ThreadWriterMachineFactory");

export type ThreadWriter = ReturnType<ThreadWriterMachineFactory>;
