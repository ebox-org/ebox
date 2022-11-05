import { Container, inject, injectable } from "inversify";

import { Module } from "../../internals/decorators";
import { createSendMachine, SendMachine, SendMachineFactory } from "./machine";

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
