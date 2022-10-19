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

export type UpdateLocationMutationVariables = Exact<{
  nodeID: Scalars['ID'];
  lat: Scalars['Float'];
  long: Scalars['Float'];
}>;


export type UpdateLocationMutation = { __typename?: 'Mutation', upLocation: boolean };


export const UpdateLocationDocument = gql`
    mutation updateLocation($nodeID: ID!, $lat: Float!, $long: Float!) {
  upLocation(input: {nodeID: $nodeID, latitude: $lat, longitude: $long})
}
    `;
export type UpdateLocationMutationFn = Apollo.MutationFunction<UpdateLocationMutation, UpdateLocationMutationVariables>;

/**
 * __useUpdateLocationMutation__
 *
 * To run a mutation, you first call `useUpdateLocationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLocationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLocationMutation, { data, loading, error }] = useUpdateLocationMutation({
 *   variables: {
 *      nodeID: // value for 'nodeID'
 *      lat: // value for 'lat'
 *      long: // value for 'long'
 *   },
 * });
 */
export function useUpdateLocationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLocationMutation, UpdateLocationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLocationMutation, UpdateLocationMutationVariables>(UpdateLocationDocument, options);
      }
export type UpdateLocationMutationHookResult = ReturnType<typeof useUpdateLocationMutation>;
export type UpdateLocationMutationResult = Apollo.MutationResult<UpdateLocationMutation>;
export type UpdateLocationMutationOptions = Apollo.BaseMutationOptions<UpdateLocationMutation, UpdateLocationMutationVariables>;