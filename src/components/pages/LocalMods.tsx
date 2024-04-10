import { useLocalModsContext } from "../context/LocalMods";
import { useEffect, useRef, useState } from "react";
import Button from "../Button";
import TextInput from "../TextInput";
import { ModManifestExtra } from "../../services/profile/types";
import ToggleSwitch from "../ToggleSwitch";
import { useQuery } from "@apollo/client";
import { gql } from "../../__generated__/gql";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { TryCatchReturnType } from "../../services/events/tryCatch";
import { useErrorContext } from "../context/Error";

const { shell, ipcRenderer } = window.require("electron");

const GET_UPDATES = gql(`
	query GET_UPDATES($packages: [String!] = "") {
		updates(packages: $packages) {
			full_name
		}
	}
`);

function ModListItemGeneral({ pack, onClick, update }: { pack: ModManifestExtra; onClick: () => void; update: string }) {
	const { setError } = useErrorContext();
	const [versionOverride, setVersionOverride] = useState<string | null>(null);

	const setModEnabled = async (enable: boolean) => {
		const data = (await ipcRenderer.invoke("SET_MOD_ENABLED", pack.path, enable)) as TryCatchReturnType<undefined>;

		if (data.success === false) {
			setError({ title: "Failed to update mod", message: data.error.message });
			console.error(data.error);
			return;
		}
	};

	const updateMod = async () => {
		const data = (await ipcRenderer.invoke("QUEUE_MOD", update)) as TryCatchReturnType<undefined>;

		if (data.success === false) {
			setError({ title: "Failed to queue mod", message: data.error.message });
			console.error(data.error);
			return;
		}

		const split = update.split("-");
		setVersionOverride(split[split.length - 1]);
	};

	return (
		<div className="flex flex-row gap-2 cursor-pointer">
			<div className="flex flex-row grow gap-2" onClick={onClick}>
				<div className="w-12 h-12">
					<img src={pack.icon} className="aspect-square w-full h-full rounded bg-tertiary" />
				</div>
				<div className="grow flex flex-col">
					<div className="font-bold">
						{pack.name} <span className="text-sm font-bold text-muted">v{versionOverride ? versionOverride : pack.version_number}</span>
					</div>
					<div className="text-sm text-muted font-bold">{pack.namespace}</div>
				</div>
			</div>
			{update && !versionOverride ? (
				<div className="flex flex-col justify-center">
					<button
						onClick={() => {
							updateMod();
						}}
						className="hover:text-subtle">
						<FontAwesomeIcon icon={faDownload} />
					</button>
				</div>
			) : null}
			<div className="flex flex-col justify-center">
				<ToggleSwitch
					checked={pack.enabled}
					onChange={(el) => {
						setModEnabled(el.target.checked);
					}}
				/>
			</div>
		</div>
	);
}

function ModListItemDetails({ pack, uninstallMod }: { pack: ModManifestExtra; uninstallMod: () => void }) {
	const [firstUninstallClick, setFirstUninstallClick] = useState(false);

	return (
		<div className="w-full flex flex-col">
			<div>{pack.description}</div>
			<div className="text-muted">Categories: {pack.categories.join(", ")}</div>
			<div className="grid grid-cols-3 gap-2 mt-2">
				<Button
					className={firstUninstallClick ? "bg-red-500 hover:bg-red-800" : ""}
					grow
					onClick={() => {
						if (firstUninstallClick) {
							uninstallMod();
						} else {
							setFirstUninstallClick(true);
						}
					}}>
					{firstUninstallClick ? "Are you sure?" : "Uninstall"}
				</Button>
				{pack.website_url ? (
					<Button
						className="grow"
						onClick={() => {
							shell.openExternal(pack.website_url);
						}}>
						Website
					</Button>
				) : null}
				{pack.donation_url ? (
					<Button
						className="grow"
						onClick={() => {
							shell.openExternal(pack.donation_url);
						}}>
						Donate
					</Button>
				) : null}
			</div>
		</div>
	);
}

function ModListItem({ pack, open, onClick, update }: { pack: ModManifestExtra; open: boolean; onClick: () => void; update?: string }) {
	const { setError } = useErrorContext();
	const [uninstalled, setUninstalled] = useState(false);

	const uninstallMod = async () => {
		const data = (await ipcRenderer.invoke("UNINSTALL_MOD", pack.full_name)) as TryCatchReturnType<undefined>;

		if (data.success === false) {
			setError({ title: "Failed to uninstall mod", message: data.error.message });
			console.error(data.error);
			return;
		} else {
			setUninstalled(true);
		}
	};

	if (uninstalled) return null;

	return (
		<li className="p-2 gap-2 flex flex-col bg-secondary rounded-lg">
			<ModListItemGeneral pack={pack} onClick={onClick} update={update} />
			{open ? <ModListItemDetails pack={pack} uninstallMod={uninstallMod} /> : null}
		</li>
	);
}

export default function ModList() {
	const { setError } = useErrorContext();
	const { packages, onUpdate, loading } = useLocalModsContext();

	const [fetchedUpdates, setFetchedUpdates] = useState(false);
	const [downloadingUpdates, setDownloadingUpdates] = useState(false);

	const { data, refetch } = useQuery(GET_UPDATES, {
		variables: {
			packages: [],
		},
	});

	useEffect(() => {
		if (!fetchedUpdates && packages.length > 0) {
			refetch({ packages: packages.map((p) => p.full_name) });
			setFetchedUpdates(true);
		}
	}, [packages, fetchedUpdates]);

	const updateMods = () => {
		data?.updates.forEach(async (update) => {
			const data = (await ipcRenderer.invoke("QUEUE_MOD", update.full_name)) as TryCatchReturnType<undefined>;

			if (data.success === false) {
				setError({ title: "Failed to queue mod", message: data.error.message });
				console.error(data.error);
				return;
			}
		});
		setDownloadingUpdates(true);
	};

	const listRef = useRef<HTMLDivElement>();
	const [searchTerm, setSearchTerm] = useState("");
	const [page, setPage] = useState(0);
	const [itemOpenIndex, setItemOpenIndex] = useState(-1);

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			setPage(0);
			scrollToTop();

			if (onUpdate) {
				onUpdate(searchTerm, 0);
				setItemOpenIndex(-1);
			}
		}, 300);

		return () => clearTimeout(delayDebounceFn);
	}, [searchTerm]);

	useEffect(() => {
		scrollToTop();
	}, [page]);

	const scrollToTop = () => {
		if (listRef.current) {
			listRef.current.scrollTo(0, 0);
		}
	};

	return (
		<div className="w-full flex h-full flex-col bg-primary overflow-y-hidden relative">
			<div className="min-h-16 flex flex-row gap-2 p-2">
				<TextInput grow autoComplete="off" placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />
				{data?.updates.length ? <Button onClick={updateMods}>Update Mods</Button> : null}
			</div>
			<div ref={listRef} className="grow overflow-y-auto">
				<>
					<ul className="w-full p-2 pt-0 flex flex-col gap-2">
						{loading ? (
							[...Array(20)].map((_, index) => <li key={index} className="h-16 p-2 gap-2 flex flex-row bg-secondary rounded-lg"></li>)
						) : packages.length === 0 ? (
							<div className="text-muted">No packages installed</div>
						) : (
							packages.map((pack, index) => (
								<ModListItem
									key={pack.full_name}
									pack={pack}
									open={itemOpenIndex === index}
									onClick={() => {
										setItemOpenIndex(itemOpenIndex === index ? -1 : index);
									}}
									update={downloadingUpdates ? undefined : data?.updates.find((p) => p.full_name.includes(pack.full_name.split("-").slice(0, -1).join("-")))?.full_name}
								/>
							))
						)}
					</ul>
				</>
			</div>
		</div>
	);
}
