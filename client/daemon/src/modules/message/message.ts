import { inject, injectable, interfaces } from "inversify";
import { createMachine, sendParent } from "xstate";
import { DaemonContainer2 } from "../../container2";

import * as Ports from "../../ports";

import * as Op from "./operations.generated";

@injectable()
export class Message {
	@inject(Ports.LoggerFactory)
	private loggerFactory!: Ports.LoggerFactory;

	private logger;

	constructor() {
		this.logger = this.loggerFactory.createLogger("Message");
	}
}
