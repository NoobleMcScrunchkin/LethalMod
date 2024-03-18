import { PackageVersion } from "../../../services/profile/types";
import { useEffect, useState } from "react";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { formatBytes } from "../../../util/formatBytes";
import TitlebarButton from "./TitlebarButton";

const { ipcRenderer } = window.require("electron");

function QueueList({ queue }: { queue: Array<PackageVersion> }) {
	return (
		<>
			<div className="fixed top-[1.6rem] right-[5rem] w-4 h-4">
				<div className="rotate-45 bg-tertiary w-6 h-6 rounded"></div>
			</div>
			<div className="fixed z-10 right-2 top-8 max-h-[calc(100vh-2rem)] bg-primary w-96 rounded flex flex-col shadow-lg border-2 border-tertiary">
				<div className="p-2 font-bold">Download Queue</div>
				<div className="flex flex-col p-2 pt-0 gap-2 grow overflow-auto">
					{queue.length > 0 ? (
						queue.map((pack, index) => (
							<div key={index} className="flex flex-row h-12 gap-2 items-center">
								<div className="h-full aspect-square">
									<img src={pack.icon} alt={pack.full_name} className="rounded" />
								</div>
								<div className="grow text-nowrap overflow-hidden">
									<div>{pack.name}</div>
									<div className="text-sm text-muted font-bold">v{pack.version_number}</div>
								</div>
								<div>{formatBytes(pack.file_size)}</div>
							</div>
						))
					) : (
						<div className="text-muted">Nothing in the queue...</div>
					)}
				</div>
			</div>
		</>
	);
}

export default function Queue({ mainRef }: { mainRef: React.RefObject<HTMLDivElement> }) {
	const [open, setOpen] = useState(false);
	const [queue, setQueue] = useState<Array<PackageVersion>>([]);

	const handleMainClick = () => {
		setOpen(false);
	};

	useEffect(() => {
		ipcRenderer.on("QUEUE_UPDATED", (_, newQueue: Array<PackageVersion>) => {
			setQueue(newQueue);
		});

		mainRef.current.addEventListener("click", handleMainClick);

		return () => {
			ipcRenderer.removeAllListeners("QUEUE_UPDATED");
			mainRef.current?.removeEventListener("click", handleMainClick);
		};
	}, []);

	return (
		<>
			<TitlebarButton
				icon={faCog}
				iconProps={{ spin: queue.length > 0 }}
				onClick={() => {
					setOpen(!open);
				}}
			/>
			{open ? <QueueList queue={queue} /> : null}
		</>
	);
}
