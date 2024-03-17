/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type DependencyQuery = {
  __typename?: 'DependencyQuery';
  missing: Array<Scalars['String']['output']>;
  packages: Array<PackageVersion>;
};

export type Package = {
  __typename?: 'Package';
  categories: Array<Scalars['String']['output']>;
  date_created: Scalars['String']['output'];
  date_updated: Scalars['String']['output'];
  donation_link?: Maybe<Scalars['String']['output']>;
  downloads: Scalars['Int']['output'];
  full_name: Scalars['String']['output'];
  has_nsfw_content: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  is_deprecated: Scalars['Boolean']['output'];
  is_pinned: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  owner: Scalars['String']['output'];
  package_url: Scalars['String']['output'];
  rating_score: Scalars['Int']['output'];
  uuidv4?: Maybe<Scalars['String']['output']>;
  versions: Array<PackageVersion>;
};

export type PackageQuery = {
  __typename?: 'PackageQuery';
  result: Array<Package>;
  total: Scalars['Int']['output'];
};

export type PackageVersion = {
  __typename?: 'PackageVersion';
  date_created: Scalars['String']['output'];
  dependencies: Array<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  download_url: Scalars['String']['output'];
  downloads: Scalars['Int']['output'];
  file_size: Scalars['Int']['output'];
  full_name: Scalars['String']['output'];
  icon: Scalars['String']['output'];
  id: Scalars['String']['output'];
  is_active: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  uuid4?: Maybe<Scalars['String']['output']>;
  version_number: Scalars['String']['output'];
  website_url: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  dependencyList: DependencyQuery;
  packages: PackageQuery;
  version?: Maybe<PackageVersion>;
  versions: Array<PackageVersion>;
};


export type QueryDependencyListArgs = {
  full_name: Scalars['String']['input'];
};


export type QueryPackagesArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryVersionArgs = {
  full_name: Scalars['String']['input'];
};


export type QueryVersionsArgs = {
  package_id: Scalars['String']['input'];
};

export type Get_PackagesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type Get_PackagesQuery = { __typename?: 'Query', packages: { __typename?: 'PackageQuery', total: number, result: Array<{ __typename?: 'Package', name: string, owner: string, package_url: string, rating_score: number, full_name: string, has_nsfw_content: boolean, donation_link?: string | null, date_created: string, date_updated: string, downloads: number, categories: Array<string>, versions: Array<{ __typename?: 'PackageVersion', icon: string, version_number: string, description: string, full_name: string, dependencies: Array<string> }> }> } };

export type Get_Bepinex_LinkQueryVariables = Exact<{ [key: string]: never; }>;


export type Get_Bepinex_LinkQuery = { __typename?: 'Query', packages: { __typename?: 'PackageQuery', result: Array<{ __typename?: 'Package', full_name: string, versions: Array<{ __typename?: 'PackageVersion', download_url: string }> }> } };

export type Get_Mod_QueueQueryVariables = Exact<{
  full_name: Scalars['String']['input'];
}>;


export type Get_Mod_QueueQuery = { __typename?: 'Query', dependencyList: { __typename?: 'DependencyQuery', missing: Array<string>, packages: Array<{ __typename?: 'PackageVersion', name: string, full_name: string, dependencies: Array<string>, description: string, download_url: string, version_number: string, website_url: string, file_size: number, icon: string }> } };


export const Get_PackagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GET_PACKAGES"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"20"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"packages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"package_url"}},{"kind":"Field","name":{"kind":"Name","value":"rating_score"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"has_nsfw_content"}},{"kind":"Field","name":{"kind":"Name","value":"donation_link"}},{"kind":"Field","name":{"kind":"Name","value":"date_created"}},{"kind":"Field","name":{"kind":"Name","value":"date_updated"}},{"kind":"Field","name":{"kind":"Name","value":"downloads"}},{"kind":"Field","name":{"kind":"Name","value":"categories"}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"version_number"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"dependencies"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<Get_PackagesQuery, Get_PackagesQueryVariables>;
export const Get_Bepinex_LinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GET_BEPINEX_LINK"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"packages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"StringValue","value":"BepInEx-BepInExPack","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"download_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}}]}}]}}]}}]} as unknown as DocumentNode<Get_Bepinex_LinkQuery, Get_Bepinex_LinkQueryVariables>;
export const Get_Mod_QueueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GET_MOD_QUEUE"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"full_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dependencyList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"full_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"full_name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"packages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"dependencies"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"download_url"}},{"kind":"Field","name":{"kind":"Name","value":"version_number"}},{"kind":"Field","name":{"kind":"Name","value":"website_url"}},{"kind":"Field","name":{"kind":"Name","value":"file_size"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"missing"}}]}}]}}]} as unknown as DocumentNode<Get_Mod_QueueQuery, Get_Mod_QueueQueryVariables>;