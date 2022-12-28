import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Tabs } from "@src/features/tabs";
import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import { Node } from "../features/node";
import { NodeMap } from "../features/node-map";
import { useMatchSelector } from "../shared/hooks/use-suspend-selector";
import { Daemon } from "../state-machine";

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
				element: <div>thread</div>,
				children: [{}],
			},
			{
				path: "me",
				element: <Node />,
			},
		],
	},
]);

export function App() {
	return (
		<React.Suspense fallback="loading">
			<RouterProvider router={router} />
		</React.Suspense>
	);
}

type ReadyApp = { children?: React.ReactNode };

function ReadyApp(props: ReadyApp) {
	const nodeActor = useMatchSelector(Daemon, "running", (s) => {
		return s.context.nodeRef!;
	});

	// const sendRef = useMatchSelector(
	// 	nodeActor,
	// 	"registered",
	// 	(s) => s.context.sendRef!
	// );

	return (
		<Grid2 container spacing={2} rowSpacing={1}>
			<Grid2 lg={2}>
				<Tabs />
			</Grid2>
			<Grid2 xs={12} lg={10}>
				<Outlet />
			</Grid2>
			{/* <Grid2 xs={12} lg={8}>
				<NodeMap actor={nodeMapActor} />
			</Grid2>
			<Grid2 lg={4}>
				<Node />
			</Grid2>
			<MessageInput actor={sendRef} />
			<hr />
			<MessageList actor={nodeActor} /> */}
		</Grid2>
	);
}
