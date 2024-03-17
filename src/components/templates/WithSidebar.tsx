import { useNavigate } from "react-router-dom";
import SidebarItem from "../SidebarItem";
import Base from "./Base";
import { faDownload, faPlayCircle, faWrench } from "@fortawesome/free-solid-svg-icons";
import Spacer from "../Spacer";
import SidebarCategory from "../SidebarCategory";

interface WithSidebarProperties {
	children: React.ReactNode;
}

const { ipcRenderer } = window.require("electron");

function SidebarItems() {
	const navigate = useNavigate();

	const launchGame = () => {
		ipcRenderer.invoke("LAUNCH_GAME");
	};

	return (
		<>
			<SidebarItem
				icon={faPlayCircle}
				onClick={() => {
					launchGame();
				}}>
				Launch Game
			</SidebarItem>
			<Spacer />
			<SidebarCategory name="Mods">
				<SidebarItem icon={faWrench} onClick={() => navigate("/")}>
					Installed Mods
				</SidebarItem>
				<SidebarItem icon={faDownload} onClick={() => navigate("/getMods")}>
					Get Mods
				</SidebarItem>
			</SidebarCategory>
		</>
	);
}

export default function WithSidebar({ children }: WithSidebarProperties) {
	return (
		<Base>
			<div className="flex flex-row h-full w-full">
				<div className="bg-secondary min-w-64 pt-2">
					<SidebarItems />
				</div>
				<div className="grow">{children}</div>
			</div>
		</Base>
	);
}
