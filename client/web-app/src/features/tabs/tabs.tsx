import React from "react";
import { Link } from "react-router-dom";

import { useMatchSelector } from "../../shared/hooks/use-suspend-selector";
import { Daemon } from "../../state-machine";

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
		Daemon,
		"running",
		(s) => s.context.nodeRef!
	);

	const messageRef = useMatchSelector(
		nodeActor,
		"registered",
		(s) => s.context.messageRef!
	);

	// const threads = useMatchSelector(messageRef, Daemon.Message.selectRecentThreads);
	const threads: any[] = [];

	const threadEls = threads.map((thread) => (
		<>
			<Link to={`/thread/${thread}`}>{thread}</Link>
			<br></br>
		</>
	));

	return <>{threadEls}</>;
}
