import { inject, injectable, interfaces } from "inversify";
import { createMachine, sendParent } from "xstate";
import { Module } from "../../internals/decorators";

import * as Ports from "../../ports";
import { createMessageMachine } from "./machine";

import * as Op from "./operations.generated";

export type MessageMachineFactory = ReturnType<typeof createMessageMachine>;
export const MessageMachineFactory = Symbol("MessageMachineFactory");

export type MessageMachine = ReturnType<MessageMachineFactory>;

@injectable()
@Module({
	setup: (container) => {
		container.bind(MessageMachineFactory).toFactory(createMessageMachine);
		container.bind(MessageModule).toSelf();
	},
})
export class MessageModule {
	private logger;

	constructor(
		@inject(Ports.LoggerFactory)
		private loggerFactory: Ports.LoggerFactory,

		@inject(MessageMachineFactory)
		private machineFactory: MessageMachineFactory
	) {
		this.logger = this.loggerFactory.createLogger("Message");
	}

	createMachine(nodeID: string) {
		return this.machineFactory(nodeID);
	}
}
