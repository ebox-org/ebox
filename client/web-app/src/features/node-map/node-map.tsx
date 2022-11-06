import * as React from "react";
import { useActor, useSelector } from "@xstate/react";
import { Daemon } from "../../state-machine";
import { ActorRefFrom } from "xstate";
import { interfaces } from "@ebox/daemon";

export interface NodeMap {
	actor: interfaces.NodeMapActorRef;
}

export const NodeMap = (props: NodeMap) => {
	const nearbyNodes = useSelector(
		props.actor,
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
