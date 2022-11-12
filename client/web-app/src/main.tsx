import "reflect-metadata";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import "./adapters";
import { WebAppContainer } from "./container";
import { useActor } from "@xstate/react";
import { Actor, ActorRef, EventObject } from "xstate";
import { App } from "./shared/app";
import { AppBaseLine } from "./shared/app-base-line";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		{/* <ApolloProvider client={ApiClient}> */}
		<>{/* <NodeMap /> */}</>
		{/* </ApolloProvider> */}
		<AppBaseLine />
		<App />
	</React.StrictMode>
);
