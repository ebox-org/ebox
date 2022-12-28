import { useSelector } from "@xstate/react";
import pDefer from "p-defer";
import React from "react";
import { ActorRef, Subscribable } from "xstate";

type SubscribableActorRef = ActorRef<any, any> & Subscribable<any>;

type EmittedFromActorRef<TActor extends SubscribableActorRef> =
	TActor extends Subscribable<infer Emitted> ? Emitted : never;

type SelectorOfActorRef<TActor extends SubscribableActorRef, T> = (
	state: EmittedFromActorRef<TActor>
) => T;

const defaultSelector = (state: any) => state;

function useSuspendSelector<TActor extends SubscribableActorRef>(
	actorRef: TActor,
	isReady: SelectorOfActorRef<TActor, boolean>
): EmittedFromActorRef<TActor>;
function useSuspendSelector<TActor extends SubscribableActorRef, T>(
	actorRef: TActor,
	isReady: SelectorOfActorRef<TActor, boolean>,
	selector: SelectorOfActorRef<TActor, T>
): T;
function useSuspendSelector(
	actorRef: SubscribableActorRef,
	isReady: SelectorOfActorRef<SubscribableActorRef, boolean>,
	selector?: SelectorOfActorRef<SubscribableActorRef, any>
): any {
	const defer = React.useMemo(() => {
		return pDefer();
	}, []);

	useSelector(actorRef, (state) => {
		if (!isReady(state)) {
			throw defer.promise;
		}

		return;
	});

	const selectorFn = selector ?? defaultSelector;

	return useSelector(actorRef, selectorFn as any);
}

type StateValueFrom<TActor extends SubscribableActorRef> = Parameters<
	EmittedFromActorRef<TActor>["matches"]
>[0];

function useSuspendMatch<TActor extends SubscribableActorRef>(
	actorRef: TActor,
	readyState: StateValueFrom<TActor>
): void {
	useSuspendSelector(actorRef, (state) => {
		return state.matches(readyState);
	});
}

function useMatchSelector<TActor extends SubscribableActorRef>(
	actorRef: TActor,
	readyState: StateValueFrom<TActor>
): EmittedFromActorRef<TActor>;
function useMatchSelector<TActor extends SubscribableActorRef, T>(
	actorRef: TActor,
	readyState: StateValueFrom<TActor>,
	selector: SelectorOfActorRef<TActor, T>
): T;
function useMatchSelector(
	actorRef: SubscribableActorRef,
	readyState: StateValueFrom<SubscribableActorRef>,
	selector?: SelectorOfActorRef<SubscribableActorRef, any>
) {
	return useSuspendSelector(
		actorRef,
		(state) => {
			return state.matches(readyState);
		},
		selector as any
	);
}

export { useSuspendMatch, useSuspendSelector, useMatchSelector };
