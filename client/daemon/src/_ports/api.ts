import {
	ApolloClient,
	InMemoryCache,
	NormalizedCacheObject,
} from "@apollo/client";
import { Token } from "../container";

export type Api = ApolloClient<NormalizedCacheObject>;
export const Api = Token.create<Api>("api");
