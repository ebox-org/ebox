import { useSelector } from "@xstate/react";
import React from "react";
import { Daemon, useDaemonActor } from "../../state-machine";

export function Node() {
	const nodeActor = useDaemonActor((d) => d.context.nodeRef);

	const nodeId = useSelector(nodeActor, (s) => {
		return s.context?.nodeID;
	});

	return <>This node: {nodeId}</>;
}
