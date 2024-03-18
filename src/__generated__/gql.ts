/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n\tquery GET_UPDATES($packages: [String!] = \"\") {\n\t\tupdates(packages: $packages) {\n\t\t\tfull_name\n\t\t}\n\t}\n": types.Get_UpdatesDocument,
    "\n\tquery GET_PACKAGES($search: String, $offset: Int = 0, $limit: Int = 20) {\n\t\tpackages(search: $search, offset: $offset, limit: $limit) {\n      result {\n        name\n        owner\n        package_url\n        rating_score\n        full_name\n        has_nsfw_content\n        donation_link\n        date_created\n        date_updated\n\t\t\t\tdownloads\n\t\t\t\tcategories\n        versions {\n          icon\n\t\t\t\t\tversion_number\n\t\t\t\t\tdescription\n\t\t\t\t\tfull_name\n\t\t\t\t\tdependencies\n\t\t\t\t\twebsite_url\n        }\n      }\n      total\n\t\t}\n\t}\n": types.Get_PackagesDocument,
    "\n  query GET_BEPINEX_LINK {\n    packages(search: \"BepInEx-BepInExPack\") {\n      result {\n        versions {\n          download_url\n        }\n        full_name\n      }\n    }\n  }\n": types.Get_Bepinex_LinkDocument,
    "\n  query GET_MOD_QUEUE($full_name: String!) {\n    dependencyList(full_name: $full_name) {\n      packages {\n        name\n        full_name\n        dependencies\n        description\n        download_url\n\t\t\t\tversion_number\n\t\t\t\twebsite_url\n        file_size\n        icon\n\t\t\t\tpackage {\n\t\t\t\t\tdonation_link\n\t\t\t\t\tcategories\n\t\t\t\t}\n      }\n      missing\n    }\n  }\n": types.Get_Mod_QueueDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GET_UPDATES($packages: [String!] = \"\") {\n\t\tupdates(packages: $packages) {\n\t\t\tfull_name\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GET_UPDATES($packages: [String!] = \"\") {\n\t\tupdates(packages: $packages) {\n\t\t\tfull_name\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GET_PACKAGES($search: String, $offset: Int = 0, $limit: Int = 20) {\n\t\tpackages(search: $search, offset: $offset, limit: $limit) {\n      result {\n        name\n        owner\n        package_url\n        rating_score\n        full_name\n        has_nsfw_content\n        donation_link\n        date_created\n        date_updated\n\t\t\t\tdownloads\n\t\t\t\tcategories\n        versions {\n          icon\n\t\t\t\t\tversion_number\n\t\t\t\t\tdescription\n\t\t\t\t\tfull_name\n\t\t\t\t\tdependencies\n\t\t\t\t\twebsite_url\n        }\n      }\n      total\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GET_PACKAGES($search: String, $offset: Int = 0, $limit: Int = 20) {\n\t\tpackages(search: $search, offset: $offset, limit: $limit) {\n      result {\n        name\n        owner\n        package_url\n        rating_score\n        full_name\n        has_nsfw_content\n        donation_link\n        date_created\n        date_updated\n\t\t\t\tdownloads\n\t\t\t\tcategories\n        versions {\n          icon\n\t\t\t\t\tversion_number\n\t\t\t\t\tdescription\n\t\t\t\t\tfull_name\n\t\t\t\t\tdependencies\n\t\t\t\t\twebsite_url\n        }\n      }\n      total\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GET_BEPINEX_LINK {\n    packages(search: \"BepInEx-BepInExPack\") {\n      result {\n        versions {\n          download_url\n        }\n        full_name\n      }\n    }\n  }\n"): (typeof documents)["\n  query GET_BEPINEX_LINK {\n    packages(search: \"BepInEx-BepInExPack\") {\n      result {\n        versions {\n          download_url\n        }\n        full_name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GET_MOD_QUEUE($full_name: String!) {\n    dependencyList(full_name: $full_name) {\n      packages {\n        name\n        full_name\n        dependencies\n        description\n        download_url\n\t\t\t\tversion_number\n\t\t\t\twebsite_url\n        file_size\n        icon\n\t\t\t\tpackage {\n\t\t\t\t\tdonation_link\n\t\t\t\t\tcategories\n\t\t\t\t}\n      }\n      missing\n    }\n  }\n"): (typeof documents)["\n  query GET_MOD_QUEUE($full_name: String!) {\n    dependencyList(full_name: $full_name) {\n      packages {\n        name\n        full_name\n        dependencies\n        description\n        download_url\n\t\t\t\tversion_number\n\t\t\t\twebsite_url\n        file_size\n        icon\n\t\t\t\tpackage {\n\t\t\t\t\tdonation_link\n\t\t\t\t\tcategories\n\t\t\t\t}\n      }\n      missing\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;