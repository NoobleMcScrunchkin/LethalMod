import { faAngleDown, faAngleUp, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useEffect, useRef } from "react";
import Queue from "../Queue";

interface BaseTemplateProps {
	children: ReactNode;
	title?: string;
}

export default function BaseTemplate({ children, title }: BaseTemplateProps) {
	const mainRef = useRef(null);

	const minimize = () => {
		ipcRenderer.send("MINIMIZE");
	};
	const maximize = () => {
		ipcRenderer.send("MAXIMIZE");
	};
	const close = () => {
		ipcRenderer.send("CLOSE");
	};

	useEffect(() => {
		document.title = title ?? "LethalMod";
	}, []);

	return (
		<div className="flex flex-col w-screen h-screen overflow-hidden select-none">
			<div className="w-full h-6 flex flex-row [-webkit-app-region:drag;] bg-titlebar text-primary ps-2">
				<div className="title grow">
					<span className="font-bold">Lethal</span>Mod
				</div>
				<div className="flex flex-row [-webkit-app-region:no-drag;]">
					<Queue mainRef={mainRef} />
					<div onClick={minimize} className="w-6 h-6 text-center hover:bg-highlight">
						<FontAwesomeIcon icon={faAngleDown} color="currentColor" />
					</div>
					<div onClick={maximize} className="w-6 h-6 text-center hover:bg-highlight">
						<FontAwesomeIcon icon={faAngleUp} color="currentColor" />
					</div>
					<div onClick={close} className="w-6 h-6 text-center hover:bg-red-500">
						<FontAwesomeIcon icon={faXmark} color="currentColor" />
					</div>
				</div>
			</div>
			<main ref={mainRef} className="bg-primary w-screen grow overflow-y-auto text-primary flex flex-col relative">
				{children}
			</main>
		</div>
	);
}

const { ipcRenderer } = window.require("electron");
