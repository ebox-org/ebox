import { Container, inject, injectable } from "inversify";

import { Module } from "../../internals/decorators";
import { createSendMachine } from "./machine";

export type SendMachineFactory = ReturnType<typeof createSendMachine>;
export const SendMachineFactory = Symbol("SendMachineFactory");

export type SendMachine = ReturnType<SendMachineFactory>;

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

	createMachine() {
		return this.createSendMachine();
	}
}
