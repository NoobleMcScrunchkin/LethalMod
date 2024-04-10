import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

const DialogContext = createContext<{
	setDialog: (node: ReactNode) => void;
} | null>(null);

function DialogProvider({ children }: { children: ReactNode }) {
	const [shown, setShown] = useState(false);
	const [node, setNode] = useState<ReactNode>(null);

	const setDialog = (node: ReactNode) => {
		setNode(node);
		setShown(true);
	};

	const values = useMemo(() => {
		return { setDialog };
	}, []);

	return (
		<DialogContext.Provider value={values}>
			{shown ? (
				<>
					<div
						className="absolute w-full h-full bg-black z-10 opacity-50"
						onClick={() => {
							setShown(false);
						}}></div>
					<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-error p-2 w-1/2 rounded flex flex-col gap-4">{node}</div>
				</>
			) : null}
			{children}
		</DialogContext.Provider>
	);
}

function useDialogContext() {
	const context = useContext(DialogContext);

	if (context === null) {
		throw new Error(`Bills context must be used within the provider`);
	}

	return context;
}

export { DialogContext, useDialogContext, DialogProvider };
