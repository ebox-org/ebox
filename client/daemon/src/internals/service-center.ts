import { AnyStateMachine, AnyInterpreter, interpret } from "xstate";
import { default as TreeModel } from "tree-model";

class ServiceNode {
	machine;

	service;

	constructor(machine: AnyStateMachine) {
		this.machine = machine;
		this.service = interpret(machine);
	}

	appendChild(child: ServiceNode) {
		return this;
	}
}

class ServiceCenter {
	constructor() {}

	root!: ServiceNode;

	spawn(machine: AnyStateMachine, parent?: ServiceNode) {
		if (!parent) {
			this.root.appendChild(new ServiceNode(machine));
		} else {
			parent.appendChild(new ServiceNode(machine));
		}
	}

	stop() {
		this.root.service.stop();
	}
}
