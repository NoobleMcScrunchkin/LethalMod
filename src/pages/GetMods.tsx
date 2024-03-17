import AvailableModList from "../components/AvailableModList";
import WithSidebar from "../components/templates/WithSidebar";

export default function GetMods() {
	return (
		<WithSidebar>
			<AvailableModList />
		</WithSidebar>
	);
}
