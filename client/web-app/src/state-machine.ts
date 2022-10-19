import "./adapters";

import { bootstrap } from "@ebox/daemon";
import { useActor, useSelector } from "@xstate/react";
import React from "react";
import { ActorRef, EventObject } from "xstate";

import { Boostrapper } from "./container";

export const Daemon = Boostrapper.bootstrap();

type TypeSnapShot = ReturnType<typeof Daemon["root"]["getSnapshot"]>;

type Selector<T> = (snapshot: TypeSnapShot) => T | undefined;

export function useDaemonActor<T>(selector: Selector<T>) {
	const snapshot = Daemon.root.getSnapshot();

	const actor = selector(snapshot);

	return actor;
}