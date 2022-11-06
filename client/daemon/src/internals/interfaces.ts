import { Container } from "inversify";

export type Constructor = new (...args: any[]) => any;
export type GConstructor<T> = new (...args: any[]) => T;
export interface IModule {
	setup(container: Container): void;
}
