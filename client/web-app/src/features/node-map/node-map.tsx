import * as React from "react";
import { useActor, useSelector } from "@xstate/react";
import { Daemon } from "../../state-machine";
import { ActorRefFrom } from "xstate";
import { interfaces } from "@ebox/daemon";
import { useMatchSelector } from "../../shared/hooks/use-suspend-selector";

export type NodeMap = {};

export const NodeMap = (props: NodeMap) => {
	const nodeMapActor = useMatchSelector(
		Daemon.actor,
		"running",
		(s) => s.context.nodeMapRef!
	);

	const nearbyNodes = useSelector(
		nodeMapActor,
		Daemon.NodeMap.selectNearbyNodes
	);

	if (!nearbyNodes) {
		return null;
	}

	return (
		<div>
			Node map:
			{nearbyNodes?.map((n) => (
				<div key={n?.id}>
					{n?.id} - {n?.distance}
				</div>
			))}
		</div>
	);
};
