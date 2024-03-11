import { useEffect, useRef, useState } from "react";

interface Version {
	icon: string;
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
	versions: Array<Version>;
}

interface ModListProperties {
	packages: Array<Package>;
	onUpdate?: (query: string, page: number) => void;
	error: string;
	loading: boolean;
	limit: number;
	total: number;
}

export default function ModList({ packages, onUpdate, error, loading, limit, total }: ModListProperties) {
	const listRef = useRef<HTMLDivElement>();
	const [searchTerm, setSearchTerm] = useState("");
	const [page, setPage] = useState(0);

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			setPage(0);
			scrollToTop();

			if (onUpdate) {
				onUpdate(searchTerm, 0);
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
		}
	};

	const incrementPage = () => {
		if ((page + 2) * limit > total) return;

		setPage(page + 1);

		if (onUpdate) {
			onUpdate(searchTerm, page + 1);
		}
	};

	const lowerBound = page * limit + 1;

	let upperBound = (page + 1) * limit;

	upperBound = upperBound > lowerBound + packages.length - 1 ? lowerBound + packages.length - 1 : upperBound;

	return (
		<div className="w-full flex grow flex-col bg-background-secondary overflow-y-hidden">
			<div className="min-h-16 flex flex-row gap-2 p-2">
				<input type="text" className="grow bg-background-tertiary outline-0 rounded-lg p-2" autoComplete="off" placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />
				<div className="flex flex-row gap-2"></div>
			</div>
			<div ref={listRef} className="grow overflow-y-auto">
				{error ? (
					<div>{error}</div>
				) : (
					<>
						<ul className="w-full p-2 flex flex-col gap-2">
							{loading
								? [...Array(limit)].map((index) => <li key={index} className="h-16 p-2 gap-2 flex flex-row bg-white opacity-5 rounded-lg"></li>)
								: packages.map((mod) => (
										<li key={mod.full_name} className="h-16 p-2 gap-2 flex flex-row bg-background-tertiary rounded-lg">
											<div className="w-12 h-12">
												<img src={mod.versions[0].icon ?? ""} className="aspect-square w-full h-full rounded bg-background-quaternary" />
											</div>
											<div>{mod.name}</div>
										</li>
									))}
						</ul>
						<div className="w-full gap-2 p-2 text-text-muted flex flex-row items-center justify-center">
							<button className="bg-background-tertiary hover:bg-background-quaternary rounded-lg w-6 h-6" onClick={decrementPage}>
								⏴
							</button>
							<div>
								{lowerBound} - {upperBound}
							</div>
							<button className="bg-background-tertiary hover:bg-background-quaternary rounded-lg w-6 h-6" onClick={incrementPage}>
								⏵
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
