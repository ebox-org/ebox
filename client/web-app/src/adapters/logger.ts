import { WebAppContainer } from "../container";
import { Ports } from "@ebox/daemon";
import { injectable } from "inversify";

class LoggerImpl implements Ports.Logger {
	constructor(private readonly prefix: string) {}

	debug(...messages: any[]): this {
		console.debug(`[${this.prefix}]`, ...messages);
		return this;
	}

	info(...messages: any[]): this {
		console.info(`[${this.prefix}]`, ...messages);
		return this;
	}

	warn(...messages: any[]): this {
		console.warn(...messages);
		return this;
	}

	error(...messages: any[]): this {
		console.error(`[${this.prefix}]`, ...messages);
		return this;
	}
}

@injectable()
class LoggerFactoryImpl implements Ports.LoggerFactory {
	createLogger(name: string): Ports.Logger {
		return new LoggerImpl(name);
	}
}

WebAppContainer.bind(Ports.LoggerFactory).to(LoggerFactoryImpl);
