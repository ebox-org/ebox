import { WebAppContainer } from "../container";
import { Ports } from "@ebox/daemon";
import { injectable } from "inversify";

class LoggerImpl implements Ports.Logger {
	private prefix;
	constructor(...tags: string[]) {
		this.prefix = `[${tags.join("|")}]`;
	}

	debug(...messages: any[]): this {
		console.debug(this.prefix, ...messages);
		return this;
	}

	info(...messages: any[]): this {
		console.info(this.prefix, ...messages);
		return this;
	}

	warn(...messages: any[]): this {
		console.warn(this.prefix, ...messages);
		return this;
	}

	error(...messages: any[]): this {
		console.error(this.prefix, ...messages);
		return this;
	}
}

@injectable()
class LoggerFactoryImpl implements Ports.LoggerFactory {
	createLogger(...tags: string[]): Ports.Logger {
		return new LoggerImpl(...tags);
	}
}

WebAppContainer.bind(Ports.LoggerFactory).to(LoggerFactoryImpl);
