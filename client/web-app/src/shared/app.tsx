import React from "react";
import { useSelector } from "@xstate/react";
import { Daemon } from "../state-machine";
import { Node } from "../features/node";
import { NodeMap } from "../features/node-map";
import { MessageList } from "../features/message";
import { MessageInput } from "../features/message";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { AppBaseLine } from "./app-base-line";
import {
	createBrowserRouter,
	RouterProvider,
	createRoutesFromElements,
	Route,
	Link,
	Outlet,
} from "react-router-dom";
import { Tabs } from "../features/tabs";
import {
	useMatchSelector,
	useSuspendSelector,
} from "./hooks/use-suspend-selector";

const router = createBrowserRouter([
	{
		path: "/",
		element: <ReadyApp />,
		children: [
			{
				path: "/",
				element: <NodeMap />,
			},
			{
				path: "/thread/:nodeId",
				element: <div>chat</div>,
				children: [{}],
			},
			{
				path: "me",
				element: <Node />,
			},
		],
	},
]);

interface AppLayout {}

function AppLayout(props: AppLayout) {
	return <></>;
}

export function App() {
	// const running = useSelector(Daemon.actor, (s) => {
	// 	return s?.matches("running");
	// });

	// if (!running) {
	// 	return <>booting</>;
	// }

	// return <RouterProvider router={router} />;

	return (
		<React.Suspense fallback="loading">
			<ReadyApp />
		</React.Suspense>
	);
}

type ReadyApp = { children?: React.ReactNode };

function ReadyApp(props: ReadyApp) {
	const nodeActor = useMatchSelector(Daemon.actor, "running", (s) => {
		return s.context.nodeRef!;
	});

	return <div>ok</div>;

	// const sendRef = useMatchSelector(
	// 	nodeActor,
	// 	"registered",
	// 	(s) => s.context.sendRef!
	// );

	// return (
	// 	<Grid container spacing={2} rowSpacing={1}>
	// 		<Grid lg={2}>
	// 			<Tabs />
	// 		</Grid>
	// 		<Grid xs={12} lg={10}>
	// 			<Outlet />
	// 		</Grid>
	// 		{/* <Grid xs={12} lg={8}>
	// 			<NodeMap actor={nodeMapActor} />
	// 		</Grid>
	// 		<Grid lg={4}>
	// 			<Node />
	// 		</Grid>
	// 		<MessageInput actor={sendRef} />
	// 		<hr />
	// 		<MessageList actor={nodeActor} /> */}
	// 	</Grid>
	// );
}
