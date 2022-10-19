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

export interface NodeMachineCtx {
	nodeID: string;
}

export const createLocationMachine = (
	container: DaemonContainer,
	nodeID: string
) => {
	const logger = container.get(Ports.LoggerFactory).createLogger("node");

	const kvStorage = container.get(Ports.KVStorage);

	const Api = container.get(Ports.Api);

	const geo = container.get(Ports.GeoLocation);

	return createMachine<NodeMachineCtx>(
		{
			id: "location",
			initial: "idle",
			context: { nodeID },
			states: {
				idle: {
					always: {
						target: "updating",
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
							nodeID: ctx.nodeID,
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

export type LocationMachine = ReturnType<typeof createLocationMachine>;