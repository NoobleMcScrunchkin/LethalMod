import { faAngleDown, faAngleUp, faXmark } from "@fortawesome/free-solid-svg-icons";
import { ReactNode, useEffect, useRef } from "react";
import Queue from "./templatePieces/Queue";
import TitlebarButton from "./templatePieces/TitlebarButton";
import { ErrorProvider } from "../context/Error";
import { DialogProvider } from "../context/Dialog";

interface BaseTemplateProps {
	children: ReactNode;
	title?: string;
}

export default function BaseTemplate({ children, title }: BaseTemplateProps) {
	const mainRef = useRef(null);

	const send = (event: "MINIMIZE" | "MAXIMIZE" | "CLOSE") => {
		ipcRenderer.send(event);
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
					<TitlebarButton
						onClick={() => {
							send("MINIMIZE");
						}}
						icon={faAngleDown}
					/>
					<TitlebarButton
						onClick={() => {
							send("MAXIMIZE");
						}}
						icon={faAngleUp}
					/>
					<TitlebarButton
						onClick={() => {
							send("CLOSE");
						}}
						icon={faXmark}
					/>
				</div>
			</div>
			<main ref={mainRef} className="bg-primary w-screen grow overflow-y-auto text-primary flex flex-col relative">
				<DialogProvider>
					<ErrorProvider>{children}</ErrorProvider>
				</DialogProvider>
			</main>
		</div>
	);
}

const { ipcRenderer } = window.require("electron");
