import { inject, injectable } from 'inversify';
import { createMachine } from 'xstate';

import { ebModule } from '../../internals/decorators';
import { createNodeMachine, NodeMachineFactory } from './machine';

// import { createMessageMachine, MessageMachine } from "../message";
@injectable()
@ebModule({
	setup: (container) => {
		container
			.bind<NodeMachineFactory>(NodeMachineFactory)
			.toFactory(createNodeMachine);
		container.bind(NodeModule).toSelf();
	},
})
export class NodeModule {
	constructor(
		@inject(NodeMachineFactory)
		public readonly createMachine: NodeMachineFactory
	) {}

	off() {}
}
