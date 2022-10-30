import { Container, inject, injectable, interfaces } from "inversify";
import { createMachine, sendParent } from "xstate";

import * as Ports from "../../ports";
import { DaemonModule } from "../../internals/interfaces";

import * as Op from "../message/operations.generated";

export type SendMachineEvent = {
	type: "SEND";
	toID: string;
	content: string;
	msgType?: string;
};

export interface SendMachineCtx {
	nodeID: string;
}

const createSendMachine = (ctx: interfaces.Context) => (nodeID: string) => {
	const logger = ctx.container
		.get<Ports.LoggerFactory>(Ports.LoggerFactory)
		.createLogger("node");

	const Api = ctx.container.get<Ports.Api>(Ports.Api);

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
export type SendMachineFactory = ReturnType<typeof createSendMachine>;

export type SendMachine = ReturnType<SendMachineFactory>;

export const SendMachineFactory = Symbol("SendMachineFactory");

@injectable()
class SendMessage {
	@inject(SendMachineFactory)
	private createSendMachine!: SendMachineFactory;

	sendMessageTo(toID: string) {
		return this.createSendMachine(toID);
	}
}

export const SendMessageModule: DaemonModule = {
	setup(container: Container) {
		container
			.bind<SendMachine>(SendMachineFactory)
			.toFactory(createSendMachine);
		container.bind<SendMessage>(SendMessage).toSelf();
	},
};
