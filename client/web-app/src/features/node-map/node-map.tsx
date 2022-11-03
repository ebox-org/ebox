import * as React from "react";
import { useActor, useSelector } from "@xstate/react";
import { Daemon } from "../../state-machine";

export const NodeMap = () => {
	// todo selector
	if (!Daemon.NodeMap.Actor) {
		return null;
	}

	return <ReadyNodeMap />;
};

function ReadyNodeMap() {
	const nearbyNodes = useSelector(Daemon.NodeMap.Actor!, (s) => {
		return s.context.nearbyNodes ?? [];
	});

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
