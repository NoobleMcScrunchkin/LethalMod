import { ModManifestExtra } from "../../services/profile/types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

const { ipcRenderer } = window.require("electron");

const LocalModsContext = createContext<{
	packages: Array<ModManifestExtra>;
	loading: boolean;
	onUpdate: (search: string, page: number) => void;
} | null>(null);

function LocalModsProvider({ children }: { children: ReactNode }) {
	const [loading, setLoading] = useState(true);
	const [packages, setPackages] = useState<Array<ModManifestExtra>>([]);
	const [search, setSearch] = useState("");

	useEffect(() => {
		getMods();
	}, [search]);

	const getMods = () => {
		setLoading(true);

		ipcRenderer.invoke("GET_MODS", search).then((mods: Array<ModManifestExtra>) => {
			setPackages(mods);

			setLoading(false);
		});
	};

	const handleUpdate = (search: string) => {
		setSearch(search);
	};

	const values = useMemo(() => {
		return { packages: loading ? [] : packages, loading, onUpdate: handleUpdate };
	}, [packages, loading]);

	return <LocalModsContext.Provider value={values}>{children}</LocalModsContext.Provider>;
}

function useLocalModsContext() {
	const context = useContext(LocalModsContext);

	if (context === null) {
		throw new Error(`Bills context must be used within the provider`);
	}

	return context;
}

export { LocalModsContext, useLocalModsContext, LocalModsProvider };
