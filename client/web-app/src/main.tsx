import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import "./adapters";
import { bootstrap } from "@ebox/daemon";
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
	const running = useSelector(Daemon.root, (s) => {
		return s.matches("running");
	});

	if (running) {
		return (
			<>
				<CssBaseline />

				<Node />
				<hr />
				<NodeMap />
				<hr />
				<MessageInput />
				<hr />
				<MessageList />
			</>
		);
	}

	return <>booting</>;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		{/* <ApolloProvider client={ApiClient}> */}
		<>{/* <NodeMap /> */}</>
		{/* </ApolloProvider> */}
		<App />
	</React.StrictMode>
);
