import { interfaces } from "inversify";
import { over } from "ok-value-error-reason";
import { ActorRefFrom, assign, createMachine } from "xstate";
import * as Ports from "../../ports";
import {
	FindNearByNodesDocument,
	FindNearByNodesQueryVariables,
	FindNearByNodesQuery,
} from "./operations.generated";
import { SetNodeIDEvent } from "../../internals/common-event";

export interface NearbyNode {
	id: string;
	distance: number;
}

export interface NodeMapMachineCtx {
	nearbyNodes: NearbyNode[];
	currentNodeID?: string;
}


export type NodeMapMachineEvents = SetNodeIDEvent;

export const createNodeMapMachine = (ctx: interfaces.Context) => () => {
	const container = ctx.container;
	const logger = container
		.get<Ports.LoggerFactory>(Ports.LoggerFactory)
		.createLogger("NodeMap");

	const geo = container.get<Ports.GeoLocation>(Ports.GeoLocation);

	const Api = container.get<Ports.Api>(Ports.Api);

	return createMachine<NodeMapMachineCtx, NodeMapMachineEvents>(
		{
			id: "NodeMap",
			initial: "idle",
			context: {
				nearbyNodes: [],
			},
			on: {
				SET_NODE_ID: {
					actions: assign((ctx, event) => {
						return {
							currentNodeID: event.nodeID,
						};
					}),
				},
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

export type NodeMapMachineFactory = ReturnType<typeof createNodeMapMachine>;

export const NodeMapMachineFactory = Symbol("NodeMapMachineFactory");

export type NodeMapMachine = ReturnType<NodeMapMachineFactory>;

export type NodeMapActorRef = ActorRefFrom<NodeMapMachine>;
