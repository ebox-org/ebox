import * as React from "react";
import { useActor, useSelector } from "@xstate/react";
import { useDaemonActor } from "../../state-machine";

export const NodeMap = () => {
	const nodeMap = useDaemonActor((s) => {
		return s.context.nodeMapRef;
	});

	const nearbyNodes = useSelector(nodeMap!, (s) => {
		return s.context?.nearbyNodes ?? [];
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
};
