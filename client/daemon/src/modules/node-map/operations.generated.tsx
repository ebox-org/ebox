import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  join__FieldSet: any;
  link__Import: any;
};

export type LocationInput = {
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  nodeID: Scalars['ID'];
};

export type Message = {
  __typename?: 'Message';
  content: Scalars['String'];
  fromID: Scalars['ID'];
  messageID: Scalars['ID'];
  messageType: Scalars['String'];
  toID: Scalars['ID'];
};

export type MessageInput = {
  content: Scalars['String'];
  fromID: Scalars['ID'];
  messageType: Scalars['String'];
  toID: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  sendMessage: Message;
  upLocation: Scalars['Boolean'];
  upNode?: Maybe<Node>;
};


export type MutationSendMessageArgs = {
  message: MessageInput;
};


export type MutationUpLocationArgs = {
  input: LocationInput;
};


export type MutationUpNodeArgs = {
  node: NodeInput;
};

export type Nearby = {
  __typename?: 'Nearby';
  distance: Scalars['Float'];
  node: Node;
};

export type Node = {
  __typename?: 'Node';
  name: Scalars['String'];
  nodeID: Scalars['ID'];
};

export type NodeInput = {
  name: Scalars['String'];
  nodeId?: InputMaybe<Scalars['ID']>;
};

export type Query = {
  __typename?: 'Query';
  findNearbyNodes?: Maybe<Array<Maybe<Nearby>>>;
  getMessage: Array<Message>;
  node?: Maybe<Node>;
};


export type QueryFindNearbyNodesArgs = {
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
};


export type QueryGetMessageArgs = {
  toID: Scalars['ID'];
};


export type QueryNodeArgs = {
  nodeID: Scalars['ID'];
};

export type Subscription = {
  __typename?: 'Subscription';
  messageReceived: Message;
};


export type SubscriptionMessageReceivedArgs = {
  toID: Scalars['ID'];
};

export enum Join__Graph {
  Location = 'LOCATION',
  Message = 'MESSAGE',
  Node = 'NODE'
}

export enum Link__Purpose {
  /** `EXECUTION` features provide metadata necessary for operation execution. */
  Execution = 'EXECUTION',
  /** `SECURITY` features provide metadata necessary to securely resolve fields. */
  Security = 'SECURITY'
}

export type FindNearByNodesQueryVariables = Exact<{
  lat: Scalars['Float'];
  long: Scalars['Float'];
}>;


export type FindNearByNodesQuery = { __typename?: 'Query', findNearbyNodes?: Array<{ __typename?: 'Nearby', distance: number, node: { __typename?: 'Node', nodeID: string, name: string } } | null> | null };


export const FindNearByNodesDocument = gql`
    query findNearByNodes($lat: Float!, $long: Float!) {
  findNearbyNodes(latitude: $lat, longitude: $long) {
    node {
      nodeID
      name
    }
    distance
  }
}
    `;

/**
 * __useFindNearByNodesQuery__
 *
 * To run a query within a React component, call `useFindNearByNodesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindNearByNodesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindNearByNodesQuery({
 *   variables: {
 *      lat: // value for 'lat'
 *      long: // value for 'long'
 *   },
 * });
 */
export function useFindNearByNodesQuery(baseOptions: Apollo.QueryHookOptions<FindNearByNodesQuery, FindNearByNodesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindNearByNodesQuery, FindNearByNodesQueryVariables>(FindNearByNodesDocument, options);
      }
export function useFindNearByNodesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindNearByNodesQuery, FindNearByNodesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindNearByNodesQuery, FindNearByNodesQueryVariables>(FindNearByNodesDocument, options);
        }
export type FindNearByNodesQueryHookResult = ReturnType<typeof useFindNearByNodesQuery>;
export type FindNearByNodesLazyQueryHookResult = ReturnType<typeof useFindNearByNodesLazyQuery>;
export type FindNearByNodesQueryResult = Apollo.QueryResult<FindNearByNodesQuery, FindNearByNodesQueryVariables>;