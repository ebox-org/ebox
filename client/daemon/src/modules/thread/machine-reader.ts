import { interfaces } from "inversify";
import { assign, createMachine, sendParent, EventObject } from "xstate";
import * as Ports from "../../ports";
import * as Op from "../message/operations.generated";
import { SetNodeIDEvent } from "../../internals/common-event";

export interface ThreadReaderCtx {
	nodeID: string;
}

export const LoadMore = "LoadMore";
export type LoadMore = {
	type: "LoadMore";
	toID: string;
	content: string;
	msgType?: string;
};

export type ThreadReaderEvent = EventObject | LoadMore;

export const createThreadReaderMachine =
	(ctx: interfaces.Context) => (nodeID: string) => {
		const logger = ctx.container
			.get<Ports.LoggerFactory>(Ports.LoggerFactory)
			.createLogger("thread");

		const Api = ctx.container.get<Ports.Api>(Ports.Api);

		return createMachine<ThreadReaderCtx, ThreadReaderEvent>(
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
						on: {},
					},
					loadMore: {},
				},
				exit: [],
			},
			{
				actions: {},
				services: {
					subscribe: (ctx, _event) => (send) => {},
				},
			}
		);
	};

export type ThreadReaderMachineFactory = ReturnType<
	typeof createThreadReaderMachine
>;
export const ThreadReaderMachineFactory = Symbol("ThreadReaderMachineFactory");

export type ThreadReader = ReturnType<ThreadReaderMachineFactory>;
