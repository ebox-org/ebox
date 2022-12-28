/**
 * This is temporary until we have a xstate/rfcs
 */
import { interfaces, injectable, inject } from "inversify";
import {
	ActorRefFrom,
	AnyActorRef,
	AnyStateMachine,
	assign,
	createMachine,
	EventObject,
	spawn,
	StateFrom,
} from "xstate";
import { Context } from "./context-module";
import { ebModule } from "./decorators";

export type AnyMachineFactory = interfaces.FactoryCreator<AnyStateMachine>;

export const SpawnActor = "SpawnActor";
export interface SpawnActor extends EventObject {
	type: typeof SpawnActor;
	machine: AnyStateMachine;
	id: string;
	actorType?: string;
}

export const StopActor = "StopActor";
export interface StopActor extends EventObject {
	type: typeof StopActor;
	id: string;
	actorType?: string;
}

export type ActorCenterEvent = SpawnActor | StopActor;

type Actors = {
	[key: string]: {
		actor: AnyActorRef;
		actorType?: string;
	};
};

export interface ActorCenterCtx {
	actors: Actors;
}

export const createActorCenter = (container: interfaces.Context) => () => {
	return createMachine<ActorCenterCtx, ActorCenterEvent>(
		{
			id: "actor-center",
			initial: "idle",
			context: {
				actors: {},
			},
			states: {
				idle: {
					always: {
						target: "running",
					},
				},
				running: {
					on: {
						[SpawnActor]: {
							actions: ["spawnActor"],
						},
						[StopActor]: {
							actions: ["stopActor"],
						},
					},
				},
			},
		},
		{
			actions: {
				spawnActor: assign((ctx, _event) => {
					const event = _event as SpawnActor;

					if (ctx.actors[event.id]) {
						throw new Error(`Actor with id ${event.id} already exists`);
					}

					const machine = event.machine;

					const actor = spawn(machine as any, event.id) as AnyActorRef;

					return {
						actors: {
							...ctx.actors,
							[event.id]: {
								actor,
								actorType: event.actorType,
							},
						},
					};
				}),
				stopActor: assign((ctx, _event) => {
					const event = _event as StopActor;

					const actor = ctx.actors[event.id];
					if (!actor) {
						throw new Error(`No actor registered for ${event.id}`);
					}

					actor.actor.stop?.();

					const { [event.id]: _, ...actors } = ctx.actors;

					return {
						actors,
					};
				}),
			},
		}
	);
};

export type ActorCenterFactory = ReturnType<typeof createActorCenter>;
export const ActorCenterFactory = Symbol("ActorCenterFactory");

export type ActorCenterMachine = ReturnType<ActorCenterFactory>;

@injectable()
@ebModule({
	setup: (container) => {
		container.bind(ActorCenterFactory).toFactory(createActorCenter);

		container.bind<ActorCenterModule>(ActorCenterModule).toSelf();
	},
})
export class ActorCenterModule {
	private actorRef?: ActorRefFrom<ActorCenterMachine>;

	constructor(
		@inject(ActorCenterFactory)
		public readonly createMachine: ActorCenterFactory
	) {
		//
	}

	public setRef(ref: ActorRefFrom<ActorCenterMachine>) {
		this.actorRef = ref;
	}

	get ref() {
		return this.actorRef!;
	}

	spawnActor<T extends AnyStateMachine>(
		machine: T,
		id: string,
		actorType?: string
	) {
		this.ref.send({
			type: SpawnActor,
			machine,
			id,
			actorType,
		});
	}
}

export const selectActor =
	(id: string) => (state: StateFrom<ActorCenterMachine>) => {
		return state.context.actors[id]?.actor;
	};

export const selectAllActors =
	(actorType: string) => (state: StateFrom<ActorCenterMachine>) => {
		const actors = state.context.actors;
		const result = [];

		for (const id in actors) {
			const actor = actors[id];
			if (actor.actorType === actorType) {
				result.push(actor.actor);
			}
		}

		return result;
	};
