import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import "./index.css";

const client = new ApolloClient({
	uri: "http://localhost:4000/api/graphql",
	cache: new InMemoryCache(),
});

const root = createRoot(document.body);
root.render(
	<main className="bg-background-primary w-screen h-screen overflow-y-auto text-text-primary flex flex-col">
		<ApolloProvider client={client}>
			<HashRouter>
				<Routes>
					<Route path="/" element={<Dashboard />} />
				</Routes>
			</HashRouter>
		</ApolloProvider>
	</main>
);
