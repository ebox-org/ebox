import { useSelector } from "@xstate/react";
import React from "react";
import { Link } from "react-router-dom";
import { ActorRefFrom } from "xstate";
import { interfaces } from "@ebox/daemon";
import { Daemon } from "../../state-machine";
import { useMatchSelector } from "../../shared/hooks/use-suspend-selector";

export type Tabs = {};

export const Tabs = (props: Tabs) => {
	return (
		<>
			<Link to="/">Home</Link>
			<br></br>
			<React.Suspense>
				<Threads />
			</React.Suspense>
			<Link to="/me">Me</Link>
			<br></br>
		</>
	);
};

type Threads = {};

function Threads({}: Threads) {
	const nodeActor = useMatchSelector(
		Daemon.actor,
		"running",
		(s) => s.context.nodeRef!
	);

	const messageRef = useMatchSelector(
		nodeActor,
		"registered",
		(s) => s.context.messageRef!
	);

	const threads = useMatchSelector(messageRef, Daemon.Message.selectRecentThreads);

	const threadEls = threads.map((thread) => (
		<>
			<Link to={`/thread/${thread}`}>{thread}</Link>
			<br></br>
		</>
	));

	return <>{threadEls}</>;
}
