import { Container } from "inversify";

export interface DaemonModule {
	new?(): any;

	setup(container: Container): void;
}
