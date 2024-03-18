import { LocalModsProvider } from "../components/context/LocalMods";
import LocalMods from "../components/pages/LocalMods";
import WithSidebar from "../components/templates/WithSidebar";

export default function InstalledMods() {
	return (
		<WithSidebar>
			<LocalModsProvider>
				<LocalMods />
			</LocalModsProvider>
		</WithSidebar>
	);
}
