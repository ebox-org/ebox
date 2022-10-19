import { over } from "ok-value-error-reason";
import { assign, createMachine } from "xstate";
import { DaemonContainer } from "../../container";
import * as Ports from "../../ports";
import {
	FindNearByNodesDocument,
	FindNearByNodesQueryVariables,
	FindNearByNodesQuery,
} from "./operations.generated";

interface NearbyNode {
	id: string;
	distance: number;
}

export interface NodeMapMachineCtx {
	nearbyNodes: NearbyNode[];
}

export const createNodeMapMachine = (container: DaemonContainer) => {
	const logger = container.get(Ports.LoggerFactory).createLogger("NodeMap");

	const geo = container.get(Ports.GeoLocation);

	const Api = container.get(Ports.Api);

	return createMachine<NodeMapMachineCtx>(
		{
			id: "NodeMap",
			initial: "idle",
			context: {
				nearbyNodes: [],
			},
			states: {
				idle: {
					always: "fetching",
				},
				fetching: {
					invoke: {
						src: "findNearByNodes",
						onDone: {
							target: "waiting",
							actions: "setNearbyNodes",
						},
						onError: {
							target: "fetchFailed",
						},
					},
				},
				waiting: {
					after: {
						2000: "fetching",
					},
				},
				fetchFailed: {
					after: {
						5000: "fetching",
					},
				},
			},
		},
		{
			actions: {
				setNearbyNodes: assign((ctx, event: any) => {
					return {
						nearbyNodes: event.data,
					};
				}),
			},

			services: {
				findNearByNodes: async (ctx, event) => {
					logger.debug("getting nearby nodes");

					const coords = await over(geo.getCurrentPosition);

					if (!coords.ok) {
						throw coords.reason;
					}

					const res = await Api.mutate<
						FindNearByNodesQuery,
						FindNearByNodesQueryVariables
					>({
						mutation: FindNearByNodesDocument,
						variables: {
							lat: coords.value.latitude,
							long: coords.value.longitude,
						},
					});

					if (res.errors?.length) {
						throw res.errors;
					}

					let nearbyNodes: NearbyNode[] =
						res.data?.findNearbyNodes?.map((v) => {
							return {
								id: v?.node.nodeID!,
								distance: v?.distance!,
							};
						}) ?? [];

					return nearbyNodes;
				},
			},
		}
	);
};

export type NodeMapMachine = ReturnType<typeof createNodeMapMachine>;