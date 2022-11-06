import { Ports } from "@ebox/daemon";
import { WebAppContainer } from "../container";
import {
	ApolloClient,
	InMemoryCache,
	NormalizedCacheObject,
} from "@apollo/client";

const API =
	import.meta.env.PROD || !import.meta.env.VITE_API
		? "/graphql-router"
		: `${import.meta.env.VITE_API}/graphql-router`;

const ApiClient = new ApolloClient({
	uri: API,
	cache: new InMemoryCache(),
});

WebAppContainer.bind(Ports.Api).toConstantValue(ApiClient);
