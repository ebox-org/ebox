import { ModuleOption } from '../../internals/decorators';
import { createMessageRootMachine, MessageRootMachineFactory } from './machine';
import { createMessageListMachine, MessageListMachineFactory } from './machine-list';
import { createMessageLoaderMachine, MessageLoaderMachineFactory } from './machine-loader';
import { createMessageWriterMachine, MessageWriterMachineFactory } from './machine-writer';

export const MessageModule: ModuleOption = {
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
	},
};
