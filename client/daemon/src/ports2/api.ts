import {
	ApolloClient,
	InMemoryCache,
	NormalizedCacheObject,
} from "@apollo/client";

export type Api = ApolloClient<NormalizedCacheObject>;
export const Api = Symbol("Api");
