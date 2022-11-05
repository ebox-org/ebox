import "reflect-metadata";
import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import "./adapters";
import { WebAppContainer } from "./container";
import { useActor, useSelector } from "@xstate/react";
import { Actor, ActorRef, EventObject } from "xstate";
import { Daemon } from "./state-machine";
import { Node } from "./features/node";
import { NodeMap } from "./features/node-map";
import { MessageList } from "./features/message";
import { MessageInput } from "./features/message";
import { CssBaseline } from "@mui/material";

function App() {
	const running = useSelector(Daemon.RootActor, (s) => {
		return s?.matches("running");
	});

	if (!running) {
		return <>booting</>;
	}

	return <ReadyApp />;
}

interface ReadyApp {}

function ReadyApp() {
	const nodeActor = useSelector(Daemon.RootActor, (s) => {
		return s?.context?.nodeRef!;
	});

	const nodeMapActor = useSelector(
		Daemon.RootActor,
		(s) => s.context.nodeMapRef!
	);

	const sendRef = useSelector(nodeActor, (s) => s.context.sendRef);

	return (
		<>
			<CssBaseline />
			<Node />
			<hr />
			<NodeMap actor={nodeMapActor} />
			<hr />
			<MessageInput actor={sendRef} />
			<hr />
			<MessageList actor={nodeActor} />
		</>
	);
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		{/* <ApolloProvider client={ApiClient}> */}
		<>{/* <NodeMap /> */}</>
		{/* </ApolloProvider> */}
		<App />
	</React.StrictMode>
);
