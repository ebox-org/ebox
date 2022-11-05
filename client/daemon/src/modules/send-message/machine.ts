import { interfaces } from "inversify";
import { assign, createMachine, sendParent } from "xstate";
import * as Ports from "../../ports";
import * as Op from "../message/operations.generated";
import { SetNodeIDEvent } from "../../internals/common-event";

export interface SendMachineCtx {
	nodeID?: string;
}

export type SendMessageEvent = {
	type: "SEND";
	toID: string;
	content: string;
	msgType?: string;
};

export type SendMachineEvent = SetNodeIDEvent | SendMessageEvent;

export const createSendMachine = (ctx: interfaces.Context) => () => {
	const logger = ctx.container
		.get<Ports.LoggerFactory>(Ports.LoggerFactory)
		.createLogger("node");

	const Api = ctx.container.get<Ports.Api>(Ports.Api);

	return createMachine<SendMachineCtx, SendMachineEvent>(
		{
			id: "send",
			initial: "idle",
			context: { nodeID: undefined },
			on: {
				SET_NODE_ID: {
					actions: [assign((ctx, event) => ({ nodeID: event.nodeID }))],
				},
			},
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
				sendMessage: async (ctx, _event) => {
					const event = _event as SendMessageEvent;
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
								fromID: ctx.nodeID!,
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

export type SendMachineFactory = ReturnType<typeof createSendMachine>;
export const SendMachineFactory = Symbol("SendMachineFactory");

export type SendMachine = ReturnType<SendMachineFactory>;
