import { Ports } from "@ebox/daemon";
import { injectable } from "inversify";
import { over } from "ok-value-error-reason";
import pDefer, { DeferredPromise } from "p-defer";
import { WebAppContainer } from "../container";

class Lock {
	private _defer!: DeferredPromise<unknown>;

	constructor() {
		this.renewLock();
		this._defer.resolve();
	}

	private renewLock() {
		this._defer = pDefer();

		return this._defer;
	}

	async acquire(handler: () => Promise<void>) {
		let defer;
		do {
			let prevDefer = this._defer;

			await this._defer.promise;

			if (prevDefer === this._defer) {
				defer = this.renewLock();
				break;
			}
		} while (true);

		try {
			await handler();
		} finally {
			defer.resolve();
		}
	}
}

class MessageQueueImpl implements Ports.MessageQueue {
	private readonly name;

	private readonly listeners;

	private readonly pullers;

	private readonly lock;

	private queue;

	constructor(name: string) {
		this.name = name;

		this.listeners = new Map<string, Set<Ports.Handler<Ports.Message>>>();

		this.pullers = new Map<string, DeferredPromise<unknown>>();

		this.lock = new Lock();

		this.queue = [] as any[];
	}

	send<T extends Ports.Message>(
		message: T
	): Promise<Ports.CommittedMessage<T>> {
		let cm = {
			id: String(this.queue.length),
			...message,
		} as Ports.CommittedMessage<T>;

		let defer = pDefer<Ports.CommittedMessage<T>>();

		this.queue.push(cm);

		this.lock.acquire(async () => {
			try {
				let receiver = this.pullers.get(message.topic);

				if (receiver) {
					this.pullers.delete(message.topic);

					receiver.resolve(cm);
				}

				let handlers = this.listeners.get(message.topic);

				const theHandlers = Array.from(handlers ?? []);

				if (handlers) {
					for (let handler of theHandlers) {
						over(handler, cm);
					}
				}
			} finally {
				defer.resolve(cm);
			}
		});

		return defer.promise;
	}

	receive<T extends Ports.Message>(
		topic: string,
		callback: Ports.Handler<T>,
		options?: Ports.ConnectOptions | undefined
	): Promise<void> {
		let receiver = this.pullers.get(topic);

		if (!receiver) {
			receiver = pDefer();
			this.pullers.set(topic, receiver);
		} else {
			this.pullers.delete(topic);
		}

		if (options?.after && +options.after < this.queue.length - 1) {
			for (let i = +options.after + 1; i < this.queue.length; i++) {
				let cm = this.queue[i];

				if (cm.topic === topic) {
					receiver.resolve(cm);
					break;
				}
			}
		}

		receiver.promise.then(() => {
			this.pullers.delete(topic);
		});

		return receiver.promise.then((cm) => callback(cm as any));
	}

	on<T extends Ports.Message>(
		topic: string,
		callback: Ports.Handler<T>,
		options?: Ports.ConnectOptions | undefined
	): this {
		let handlers = this.listeners.get(topic);

		if (!handlers) {
			handlers = new Set();
			this.listeners.set(topic, handlers);
		}

		handlers.add(callback as any);

		return this;
	}

	off<T extends Ports.Message>(
		topic: string,
		callback: (message: Ports.CommittedMessage<T>) => any
	): this {
		throw new Error("Method not implemented.");
	}
}

@injectable()
class MessageQueueFactoryImpl implements Ports.MessageQueueFactory {
	private readonly registry;

	constructor() {
		this.registry = new Map<string, MessageQueueImpl>();
	}

	create(name: string): Ports.MessageQueue {
		let queue = this.registry.get(name);

		if (!queue) {
			queue = new MessageQueueImpl(name);
			this.registry.set(name, queue);
		}

		return queue;
	}
}

WebAppContainer.bind(Ports.MessageQueueFactory).to(MessageQueueFactoryImpl);
