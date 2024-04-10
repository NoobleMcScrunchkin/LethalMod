import { ReactNode } from "react";

export default function SidebarCategory({ children, name }: { children: ReactNode; name: string }) {
	return (
		<div className="w-full flex flex-col">
			<div className="ml-2 text-sm font-bold text-subtle">{name}</div>
			<div className="flex flex-col">{children}</div>
		</div>
	);
}
