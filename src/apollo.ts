import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
	uri: "https://thunder.aslett.io/api/graphql",
	cache: new InMemoryCache(),
});

export { client };
