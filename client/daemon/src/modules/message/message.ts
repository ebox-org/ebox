import { inject, injectable, interfaces } from "inversify";
import { createMachine, sendParent } from "xstate";

import { ebModule } from "../../internals/decorators";

import * as Ports from "../../ports";
import { createMessageRootMachine, MessageRootMachineFactory } from "./machine";
import {
	createMessageListMachine,
	MessageListMachineFactory,
} from "./machine-list";
import {
	createMessageLoaderMachine,
	MessageLoaderMachineFactory,
} from "./machine-loader";
import {
	createMessageWriterMachine,
	MessageWriterMachineFactory,
} from "./machine-writer";

import * as Op from "./operations.generated";

@injectable()
@ebModule({
	setup: (container) => {
		container
			.bind(MessageLoaderMachineFactory)
			.toFactory(createMessageLoaderMachine);

		container
			.bind(MessageWriterMachineFactory)
			.toFactory(createMessageWriterMachine);

		container
			.bind(MessageListMachineFactory)
			.toFactory(createMessageListMachine);

		container
			.bind(MessageRootMachineFactory)
			.toFactory(createMessageRootMachine);

		container.bind(MessageModule).toSelf();
	},
})
export class MessageModule {
	private logger;

	constructor(
		@inject(Ports.LoggerFactory)
		private loggerFactory: Ports.LoggerFactory,

		@inject(MessageRootMachineFactory)
		public readonly createMachine: MessageRootMachineFactory
	) {
		this.logger = this.loggerFactory.createLogger("Message");
	}
}
