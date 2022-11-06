import { Container as _Container, inject as _inject } from "inversify";

export { injectable } from "inversify";

export class Token<T> {
	private constructor(public readonly identifier: Symbol) {}

	static create<T>(name: string) {
		return new Token<T>(Symbol(name));
	}
}

export class DaemonContainer {
	private _container = new _Container({
		defaultScope: "Singleton",
	});

	constructor() {}

	bind<T>(token: Token<T>) {
		return this._container.bind<T>(token.identifier as symbol);
	}

	get<T>(token: Token<T>) {
		return this._container.get<T>(token.identifier as symbol);
	}
}

export const inject = <T>(token: Token<T>) =>
	_inject<T>(token.identifier as symbol);
