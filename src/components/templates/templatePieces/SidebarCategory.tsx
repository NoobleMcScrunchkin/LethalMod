import { ReactNode } from "react";

export default function SidebarCategory({ children, name }: { children: ReactNode; name: string }) {
	return (
		<div className="w-full h-4">
			<div className="ml-2 text-sm font-bold text-subtle">{name}</div>
			<div>{children}</div>
		</div>
	);
}
