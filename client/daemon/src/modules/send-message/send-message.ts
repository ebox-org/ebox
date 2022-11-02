import { Container, inject, injectable } from "inversify";

import { Module } from "../../internals/decorators";
import { createSendMachine } from "./machine";

export type SendMachineEvent = {
	type: "SEND";
	toID: string;
	content: string;
	msgType?: string;
};

export interface SendMachineCtx {
	nodeID: string;
}

export type SendMachineFactory = ReturnType<typeof createSendMachine>;

export type SendMachine = ReturnType<SendMachineFactory>;

export const SendMachineFactory = Symbol("SendMachineFactory");

@injectable()
@Module({
	setup(container: Container) {
		container
			.bind<SendMachine>(SendMachineFactory)
			.toFactory(createSendMachine);
		container.bind<SendMessageModule>(SendMessageModule).toSelf();
	},
})
export class SendMessageModule {
	@inject(SendMachineFactory)
	private createSendMachine!: SendMachineFactory;

	createMachine(toID: string) {
		return this.createSendMachine(toID);
	}
}
