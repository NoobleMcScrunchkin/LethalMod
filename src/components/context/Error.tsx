import { QueuePackageVersion } from "../../services/profile/modQueue";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

const { ipcRenderer } = window.require("electron");

interface ErrorProps {
	title: string;
	message: string;
}

const ErrorContext = createContext<{
	setError: (error: ErrorProps) => void;
} | null>(null);

function ErrorProvider({ children }: { children: ReactNode }) {
	const [shown, setShown] = useState(false);
	const [title, setTitle] = useState("Error");
	const [message, setMessage] = useState("Default Error Message");

	useEffect(() => {
		ipcRenderer.on("FAILED_MODS", (_, failedMods: Array<QueuePackageVersion>) => {
			setError({
				title: "Failed to install some mods",
				message: `Failed to install the following mods:\n${failedMods.map((mod) => mod.name).join("\n")}`,
			});
		});
	});

	const setError = (error: ErrorProps) => {
		setTitle(error.title);
		setMessage(error.message);
		setShown(true);
	};

	const values = useMemo(() => {
		return { setError };
	}, []);

	return (
		<ErrorContext.Provider value={values}>
			{shown ? (
				<>
					<div
						className="absolute w-full h-full bg-black z-10 opacity-50"
						onClick={() => {
							setShown(false);
						}}></div>
					<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-error p-2 w-1/2 rounded flex flex-col gap-4">
						<div className="font-bold text-2xl">{title}</div>
						<div dangerouslySetInnerHTML={{ __html: message.replace("\n", "<br/>") }}></div>
					</div>
				</>
			) : null}
			{children}
		</ErrorContext.Provider>
	);
}

function useErrorContext() {
	const context = useContext(ErrorContext);

	if (context === null) {
		throw new Error(`Bills context must be used within the provider`);
	}

	return context;
}

export { ErrorContext, useErrorContext, ErrorProvider };
