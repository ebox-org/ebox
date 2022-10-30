import { Container } from "inversify";

export interface DaemonModule {
	setup(container: Container): void;
}
