import { useActor, useSelector } from "@xstate/react";
import React from "react";
import { Daemon } from "../../state-machine";

export function Node() {
	const nodeActor = useSelector(
		Daemon.Root.Actor,
		(ref) => ref.context.nodeRef
	);

	const nodeId = useSelector(nodeActor!, (s) => {
		return s.context?.nodeID;
	});

	return <>This node: {nodeId}</>;
}
