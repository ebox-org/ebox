import './adapters';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'reflect-metadata';

import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './bootstrap/app';
import { AppBaseLine } from './bootstrap/app-base-line';


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		{/* <ApolloProvider client={ApiClient}> */}
		<>{/* <NodeMap /> */}</>
		{/* </ApolloProvider> */}
		<AppBaseLine />
		<App />
	</React.StrictMode>
);
