export interface Logger {
	debug(...messages: any[]): this;
	info: (...messages: any[]) => this;
	warn: (...messages: any[]) => this;
	error: (...messages: any[]) => this;
}

export interface LoggerFactory {
	createLogger: (...tags: string[]) => Logger;
}

export const LoggerFactory = Symbol("LoggerFactory");
