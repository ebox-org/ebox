export interface Message {
	topic: string;
}

export type CommittedMessage<T extends Message = Message> = T & {
	id: string;
};

export type ConnectOptions = {
	after?: string;
};

export type Handler<T extends Message> = (
	message: CommittedMessage<T>
) => Promise<any> | any;

export interface MessageQueue {
	send<T extends Message>(message: T): Promise<CommittedMessage<T>>;

	// pull
	receive<T extends Message>(
		topic: string,
		callback: Handler<T>,
		options?: ConnectOptions
	): Promise<void>;

	// subscribe
	on<T extends Message>(
		topic: string,
		callback: Handler<T>,
		options?: ConnectOptions
	): this;

	off<T extends Message>(
		topic: string,
		callback: (message: CommittedMessage<T>) => Promise<any> | any
	): this;
}

export interface MessageQueueFactory {
	create(name: string): MessageQueue;
}

export const MessageQueueFactory = Symbol("MessageQueueFactory");
