import * as React from "react";
import { useActor, useSelector } from "@xstate/react";
import { Daemon } from "../../state-machine";

export const NodeMap = () => {
	const nearbyNodes = useSelector(
		Daemon.RootActor,
		Daemon.NodeMap.Selector.selectNearbyNodes
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

function ReadyNodeMap() {
	const nearbyNodes = useSelector(
		Daemon.RootActor,
		Daemon.NodeMap.Selector.selectNearbyNodes
	);

	// if (re.loading) {
	// 	return <div>loading</div>;
	// }
	// if (re.error || !re.data) {
	// 	return <div>error</div>;
	// }
	// const nodes = re.data.findNearbyNodes;
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
}
