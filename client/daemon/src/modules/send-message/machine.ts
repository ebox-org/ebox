import { interfaces } from "inversify";
import { assign, createMachine, sendParent } from "xstate";
import * as Ports from "../../ports";
import * as Op from "../message/operations.generated";
import { SendMachineCtx, SendMachineEvent } from "./send-message";

export const createSendMachine =
	(ctx: interfaces.Context) => (nodeID: string) => {
		const logger = ctx.container
			.get<Ports.LoggerFactory>(Ports.LoggerFactory)
			.createLogger("node");

		const Api = ctx.container.get<Ports.Api>(Ports.Api);

		return createMachine<SendMachineCtx, SendMachineEvent>(
			{
				id: "sendMessage",
				initial: "idle",
				context: { nodeID },
				// on: {
				// 	SEND: {
				// 		actions: ["scheduleSend"],
				// 	},
				// },
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
					// scheduleSend: assign((ctx, event) => {
					// 	return {};
					// }),
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
