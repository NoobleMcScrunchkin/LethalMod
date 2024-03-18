import { ThunderModsProvider } from "../components/context/ThunderMods";
import AvailableModList from "../components/pages/AvailableModList";
import WithSidebar from "../components/templates/WithSidebar";

export default function GetMods() {
	return (
		<WithSidebar>
			<ThunderModsProvider>
				<AvailableModList />
			</ThunderModsProvider>
		</WithSidebar>
	);
}
