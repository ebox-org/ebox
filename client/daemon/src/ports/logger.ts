import { Token } from "../container";

export interface Logger {
	debug(...messages: any[]): this;
	info: (...messages: any[]) => this;
	warn: (...messages: any[]) => this;
	error: (...messages: any[]) => this;
}

export interface LoggerFactory {
	createLogger: (name: string) => Logger;
}

export const LoggerFactory = Token.create<LoggerFactory>("LoggerFactory");
