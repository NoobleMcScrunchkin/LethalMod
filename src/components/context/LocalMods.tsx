import { TryCatchReturnType } from "../../services/events/tryCatch";
import { ModManifestExtra } from "../../services/profile/types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useErrorContext } from "./Error";

const { ipcRenderer } = window.require("electron");

const LocalModsContext = createContext<{
	packages: Array<ModManifestExtra>;
	loading: boolean;
	onUpdate: (search: string, page: number) => void;
} | null>(null);

function LocalModsProvider({ children }: { children: ReactNode }) {
	const { setError } = useErrorContext();
	const [loading, setLoading] = useState(true);
	const [packages, setPackages] = useState<Array<ModManifestExtra>>([]);
	const [search, setSearch] = useState("");

	useEffect(() => {
		getMods();
	}, [search]);

	const getMods = async () => {
		setLoading(true);

		const data = (await ipcRenderer.invoke("GET_MODS", search)) as TryCatchReturnType<ModManifestExtra[]>;

		if (data.success === false) {
			setError({ title: "Failed to get installed mods", message: data.error.message });
			console.error(data.error);
			return;
		} else {
			setPackages(data.result);

			setLoading(false);
		}
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
