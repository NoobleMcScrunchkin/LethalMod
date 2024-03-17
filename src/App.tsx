import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import InstalledMods from "./pages/InstalledMods";
import GetMods from "./pages/GetMods";
import { ApolloProvider } from "@apollo/client";
import "./index.css";
import { client } from "./apollo";

const root = createRoot(document.getElementById("react-root"));
root.render(
	<ApolloProvider client={client}>
		<HashRouter>
			<Routes>
				<Route path="/" element={<InstalledMods />} />
				<Route path="/getMods" element={<GetMods />} />
			</Routes>
		</HashRouter>
	</ApolloProvider>
);
