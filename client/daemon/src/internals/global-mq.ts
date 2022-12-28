import { injectable, interfaces } from "inversify";
import * as Ports from "../ports";
import { IModule } from "./interfaces";

export type GlobalMQ = Ports.MessageQueue;
export const GlobalMQ = Symbol("GlobalMQ");

export const globalMQFactory = (context: interfaces.Context) => {
	return context.container
		.get<Ports.MessageQueueFactory>(Ports.MessageQueueFactory)
		.create("global");
};

export const GlobalMQModule: IModule = {
	setup: (container) => {
		container.bind(GlobalMQ).toDynamicValue(globalMQFactory);
	},
};
