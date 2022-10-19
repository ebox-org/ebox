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

export type SendMsgToMutationVariables = Exact<{
  msgInput: MessageInput;
}>;


export type SendMsgToMutation = { __typename?: 'Mutation', sendMessage: { __typename?: 'Message', messageID: string, fromID: string, toID: string, messageType: string, content: string } };

export type GetMessageQueryVariables = Exact<{
  toID: Scalars['ID'];
}>;


export type GetMessageQuery = { __typename?: 'Query', getMessage: Array<{ __typename?: 'Message', messageID: string, fromID: string, toID: string, messageType: string, content: string }> };


export const SendMsgToDocument = gql`
    mutation sendMsgTo($msgInput: MessageInput!) {
  sendMessage(message: $msgInput) {
    messageID
    fromID
    toID
    messageType
    content
  }
}
    `;
export type SendMsgToMutationFn = Apollo.MutationFunction<SendMsgToMutation, SendMsgToMutationVariables>;

/**
 * __useSendMsgToMutation__
 *
 * To run a mutation, you first call `useSendMsgToMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMsgToMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMsgToMutation, { data, loading, error }] = useSendMsgToMutation({
 *   variables: {
 *      msgInput: // value for 'msgInput'
 *   },
 * });
 */
export function useSendMsgToMutation(baseOptions?: Apollo.MutationHookOptions<SendMsgToMutation, SendMsgToMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendMsgToMutation, SendMsgToMutationVariables>(SendMsgToDocument, options);
      }
export type SendMsgToMutationHookResult = ReturnType<typeof useSendMsgToMutation>;
export type SendMsgToMutationResult = Apollo.MutationResult<SendMsgToMutation>;
export type SendMsgToMutationOptions = Apollo.BaseMutationOptions<SendMsgToMutation, SendMsgToMutationVariables>;
export const GetMessageDocument = gql`
    query getMessage($toID: ID!) {
  getMessage(toID: $toID) {
    messageID
    fromID
    toID
    messageType
    content
  }
}
    `;

/**
 * __useGetMessageQuery__
 *
 * To run a query within a React component, call `useGetMessageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMessageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMessageQuery({
 *   variables: {
 *      toID: // value for 'toID'
 *   },
 * });
 */
export function useGetMessageQuery(baseOptions: Apollo.QueryHookOptions<GetMessageQuery, GetMessageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMessageQuery, GetMessageQueryVariables>(GetMessageDocument, options);
      }
export function useGetMessageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMessageQuery, GetMessageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMessageQuery, GetMessageQueryVariables>(GetMessageDocument, options);
        }
export type GetMessageQueryHookResult = ReturnType<typeof useGetMessageQuery>;
export type GetMessageLazyQueryHookResult = ReturnType<typeof useGetMessageLazyQuery>;
export type GetMessageQueryResult = Apollo.QueryResult<GetMessageQuery, GetMessageQueryVariables>;