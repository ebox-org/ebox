import * as React from "react";
import { useActor, useSelector } from "@xstate/react";
import { Daemon } from "../../state-machine";

export const NodeMap = () => {
	const nodeMap = useSelector(
		Daemon.Root.Machine,
		(ref) => ref.context.nodeMapRef
	);

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
