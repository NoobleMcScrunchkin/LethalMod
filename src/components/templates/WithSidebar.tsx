import { useNavigate, matchPath, useLocation } from "react-router-dom";
import SidebarItem from "./templatePieces/SidebarItem";
import Base from "./Base";
import { faCloudArrowDown, faCloudArrowUp, faDownload, faFileDownload, faFileUpload, faPlayCircle, faWrench } from "@fortawesome/free-solid-svg-icons";
import Spacer from "../Spacer";
import SidebarCategory from "./templatePieces/SidebarCategory";
import { TryCatchReturnType } from "../../services/events/tryCatch";
import { useErrorContext } from "../context/Error";
import { useDialogContext } from "../context/Dialog";

interface WithSidebarProperties {
	children: React.ReactNode;
}

const { ipcRenderer } = window.require("electron");

function SidebarItems() {
	const { setError } = useErrorContext();
	const { setDialog } = useDialogContext();

	const navigate = useNavigate();
	const location = useLocation();

	const launchGame = async () => {
		const data = (await ipcRenderer.invoke("LAUNCH_GAME")) as TryCatchReturnType<undefined>;

		if (data.success === false) {
			setError({ title: "Failed to launch game", message: data.error.message });
			console.error(data.error);
			return;
		}
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
				<SidebarItem
					icon={faWrench}
					onClick={() => {
						navigate("/");
					}}
					highlight={matchPath("/", location.pathname) !== null}>
					Installed Mods
				</SidebarItem>
				<SidebarItem
					icon={faDownload}
					onClick={() => {
						navigate("/getMods");
					}}
					highlight={matchPath("/getMods", location.pathname) !== null}>
					Get Mods
				</SidebarItem>
			</SidebarCategory>
			<Spacer />
			<SidebarCategory name="Import">
				<SidebarItem
					icon={faFileDownload}
					onClick={() => {
						console.log(1);
					}}>
					Import File
				</SidebarItem>
				<SidebarItem
					icon={faCloudArrowDown}
					onClick={() => {
						console.log(1);
					}}>
					Import Code
				</SidebarItem>
			</SidebarCategory>
			<Spacer />
			<SidebarCategory name="Export">
				<SidebarItem
					icon={faFileUpload}
					onClick={() => {
						console.log(1);
					}}>
					Export File
				</SidebarItem>
				<SidebarItem
					icon={faCloudArrowUp}
					onClick={() => {
						console.log(1);
					}}>
					Export Code
				</SidebarItem>
			</SidebarCategory>
		</>
	);
}

export default function WithSidebar({ children }: WithSidebarProperties) {
	return (
		<Base>
			<div className="flex flex-row h-full w-full">
				<div className="bg-secondary min-w-64 pt-2 flex flex-col">
					<SidebarItems />
				</div>
				<div className="grow">{children}</div>
			</div>
		</Base>
	);
}
