import { Container, inject, injectable } from "inversify";

import { ebModule } from "../../internals/decorators";
import { createSendMachine, SendMachine, SendMachineFactory } from "./machine";

@injectable()
@ebModule({
	setup(container: Container) {
		container
			.bind<SendMachine>(SendMachineFactory)
			.toFactory(createSendMachine);
		container.bind<SendMessageModule>(SendMessageModule).toSelf();
	},
})
export class SendMessageModule {
	constructor(
		@inject(SendMachineFactory)
		public readonly createMachine: SendMachineFactory
	) {}
}
