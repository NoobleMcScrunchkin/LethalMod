import { faDownload, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDistance } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useThunderModsContext } from "../context/ThunderMods";
import Button from "../Button";
import TextInput from "../TextInput";
import SelectInput from "../SelectInput";

const { shell, ipcRenderer } = window.require("electron");

interface Version {
	icon: string;
	version_number: string;
	description: string;
	full_name: string;
	dependencies: Array<string>;
	website_url?: string;
}

interface Package {
	name: string;
	owner: string;
	package_url: string;
	rating_score: number;
	full_name: string;
	has_nsfw_content: boolean;
	donation_link?: string;
	date_created: string;
	date_updated: string;
	versions?: Array<Version>;
	downloads?: number;
	categories: Array<string>;
}

function ModListItemGeneral({ pack, onClick }: { pack: Package; onClick: () => void }) {
	const formatter = Intl.NumberFormat("en", { notation: "compact", minimumFractionDigits: 1, maximumFractionDigits: 1 });

	return (
		<div className="flex flex-row gap-2 cursor-pointer" onClick={onClick}>
			<div className="w-12 h-12">
				<img src={pack.versions[0].icon ?? ""} className="aspect-square w-full h-full rounded bg-tertiary" />
			</div>
			<div className="grow flex flex-col">
				<div className="font-bold">
					{pack.name} <span className="text-sm font-bold text-muted">v{pack.versions[0].version_number}</span>
				</div>
				<div className="text-sm text-muted font-bold">{pack.owner}</div>
			</div>
			<div className="flex flex-col">
				<div className="flex flex-row items-center text-muted w-full justify-end">
					<div className="font-bold mr-1">{pack.rating_score}</div>
					<FontAwesomeIcon icon={faThumbsUp} />
				</div>
				<div className="flex flex-row items-center text-muted w-full justify-end">
					<div className="font-bold mr-1">{formatter.format(pack.downloads)}</div>
					<FontAwesomeIcon icon={faDownload} />
				</div>
			</div>
		</div>
	);
}

function ModListItemDetails({ pack, installOnClick }: { pack: Package; installOnClick: () => void }) {
	return (
		<div className="w-full flex flex-col">
			<div>{pack.versions[0].description}</div>
			<div className="text-muted">Updated: {formatDistance(new Date(pack.date_updated), new Date(), { addSuffix: true })}</div>
			<div className="text-muted">Categories: {pack.categories.join(", ")}</div>
			<div className="grid grid-cols-3 gap-2 mt-2">
				<Button className="grow" onClick={installOnClick}>
					Install
				</Button>
				{pack.versions[0].website_url ? (
					<Button
						className="grow"
						onClick={() => {
							shell.openExternal(pack.versions[0].website_url);
						}}>
						Website
					</Button>
				) : null}
				{pack.donation_link ? (
					<Button
						className="grow"
						onClick={() => {
							shell.openExternal(pack.donation_link);
						}}>
						Donate
					</Button>
				) : null}
			</div>
		</div>
	);
}

function ModListItem({ pack, open, onClick, installOnClick }: { pack: Package; open: boolean; onClick: () => void; installOnClick: () => void }) {
	return (
		<li className="p-2 gap-2 flex flex-col bg-secondary rounded-lg">
			<ModListItemGeneral pack={pack} onClick={onClick} />
			{open ? <ModListItemDetails pack={pack} installOnClick={installOnClick} /> : null}
		</li>
	);
}

function InstallPackDialog({ installPack, clear }: { installPack: Package; clear: () => void }) {
	const [versionToInstall, setVersionToInstall] = useState<Version>(installPack.versions[0]);

	const handleInstall = () => {
		if (installPack && versionToInstall) {
			ipcRenderer.invoke("QUEUE_MOD", versionToInstall.full_name);
			clear();
		}
	};

	return (
		<>
			<div
				className="absolute z-10 h-full w-full bg-black opacity-50"
				onClick={() => {
					clear();
				}}
			/>
			<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-secondary p-2 w-1/2 rounded flex flex-col gap-4">
				<div className="font-bold text-xl">Install {installPack.name}</div>
				<div className="flex flex-row items-center gap-2">
					<div>Version:</div>
					<SelectInput
						grow
						onChange={(el) => {
							setVersionToInstall(installPack.versions.find((ver) => ver.full_name === el.target.value));
						}}
						defaultValue={installPack.versions[0].full_name}>
						{installPack.versions.map((version, index) => (
							<option key={index} value={version.full_name}>
								Version {version.version_number}
							</option>
						))}
					</SelectInput>
				</div>
				<div>
					<div>Dependencies:</div>
					<div className="max-h-32 overflow-y-auto break-words">
						{versionToInstall.dependencies.map((dependency, index) => (
							<div key={index}>{dependency}</div>
						))}
					</div>
				</div>
				<div className="grid grid-cols-2 gap-2">
					<Button
						className="grow"
						onClick={() => {
							handleInstall();
						}}>
						Install
					</Button>
					<Button
						className="grow"
						onClick={() => {
							clear();
						}}>
						Cancel
					</Button>
				</div>
			</div>
		</>
	);
}

export default function ModList() {
	const { packages, onUpdate, error, loading, limit, total } = useThunderModsContext();

	const listRef = useRef<HTMLDivElement>();
	const [searchTerm, setSearchTerm] = useState("");
	const [page, setPage] = useState(0);
	const [itemOpenIndex, setItemOpenIndex] = useState(-1);
	const [installPack, setInstallPack] = useState<Package | null>(null);

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

	const decrementPage = () => {
		if (page === 0) return;

		setPage(page - 1);

		if (onUpdate) {
			onUpdate(searchTerm, page - 1);
			setItemOpenIndex(-1);
		}
	};

	const incrementPage = () => {
		if ((page + 2) * limit > total) return;

		setPage(page + 1);

		if (onUpdate) {
			onUpdate(searchTerm, page + 1);
			setItemOpenIndex(-1);
		}
	};

	const lowerBound = page * limit + 1;

	let upperBound = (page + 1) * limit;

	upperBound = upperBound > lowerBound + packages.length - 1 ? lowerBound + packages.length - 1 : upperBound;

	return (
		<div className="w-full flex h-full flex-col bg-primary overflow-y-hidden relative">
			{installPack ? (
				<InstallPackDialog
					installPack={installPack}
					clear={() => {
						setInstallPack(null);
					}}
				/>
			) : null}
			<div className="min-h-16 flex flex-row gap-2 p-2">
				<TextInput grow autoComplete="off" placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />
			</div>
			<div ref={listRef} className="grow overflow-y-auto">
				{error ? (
					<div>{error}</div>
				) : (
					<>
						<ul className="w-full p-2 pt-0 flex flex-col gap-2">
							{loading ? (
								[...Array(limit)].map((_, index) => <li key={index} className="h-16 p-2 gap-2 flex flex-row bg-secondary rounded-lg"></li>)
							) : packages.length === 0 ? (
								<div className="text-muted">No packages found</div>
							) : (
								packages.map((pack, index) => (
									<ModListItem
										key={pack.full_name}
										pack={pack}
										open={itemOpenIndex === index}
										installOnClick={() => {
											setInstallPack(pack);
										}}
										onClick={() => {
											setItemOpenIndex(itemOpenIndex === index ? -1 : index);
										}}
									/>
								))
							)}
						</ul>
						{packages.length !== 0 ? (
							<div className="w-full gap-2 p-2 pt-0 text-muted flex flex-row items-center justify-center">
								<Button className="w-6 h-6" noPadding rounding="large" onClick={decrementPage}>
									⏴
								</Button>
								<div>
									{lowerBound} - {upperBound}
								</div>
								<Button className="w-6 h-6" noPadding rounding="large" onClick={incrementPage}>
									⏵
								</Button>
							</div>
						) : null}
					</>
				)}
			</div>
		</div>
	);
}
