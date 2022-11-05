import { assign, createMachine } from "xstate";
import { DaemonContainer } from "../../container";
import * as Ports from "../../ports";
import { faker } from "@faker-js/faker";
import { over } from "ok-value-error-reason";

import {
	UpdateLocationDocument,
	UpdateLocationMutation,
	UpdateLocationMutationVariables,
} from "./operations.generated";
import { interfaces } from "inversify";
import { SetNodeIDEvent } from "../../internals/common-event";

export interface NodeMachineCtx {
	nodeID?: string;
}

export type LocationMachineEvent = SetNodeIDEvent;

export const createLocationMachine = (ctx: interfaces.Context) => () => {
	const container = ctx.container;

	const logger = container
		.get<Ports.LoggerFactory>(Ports.LoggerFactory)
		.createLogger("node");

	const kvStorage = container.get<Ports.KVStorage>(Ports.KVStorage);

	const Api = container.get<Ports.Api>(Ports.Api);

	const geo = container.get<Ports.GeoLocation>(Ports.GeoLocation);

	return createMachine<NodeMachineCtx, LocationMachineEvent>(
		{
			id: "location",
			initial: "idle",
			context: { nodeID: undefined },
			states: {
				idle: {
					on: {
						SET_NODE_ID: {
							actions: assign((ctx, event) => {
								return {
									nodeID: event.nodeID,
								};
							}),
							target: "updating",
						},
					},
				},
				updating: {
					invoke: {
						src: "upLocation",
						onDone: {
							target: "updated",
						},
						onError: "updatedFailed",
					},
				},
				updated: {
					after: {
						5000: "updating",
					},
				},
				updatedFailed: {
					after: {
						5000: "updating",
					},
				},
			},
		},
		{
			actions: {},
			services: {
				upLocation: async (ctx, event) => {
					const coords = await over(geo.getCurrentPosition);

					if (!coords.ok) {
						throw coords.reason;
					}

					const res = await Api.mutate<
						UpdateLocationMutation,
						UpdateLocationMutationVariables
					>({
						mutation: UpdateLocationDocument,
						variables: {
							lat: coords.value.latitude,
							long: coords.value.longitude,
							nodeID: ctx.nodeID!,
						},
					});

					if (res.errors) {
						throw res.errors;
					}
				},
			},
		}
	);
};
