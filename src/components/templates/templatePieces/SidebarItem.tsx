import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";

interface SidebarItemProperties {
	icon?: IconProp;
	children: ReactNode;
	onClick?: () => void;
	highlight?: boolean;
}

export default function SidebarItem({ icon, children, onClick, highlight = false }: SidebarItemProperties) {
	return (
		<div className={`w-full h-8 hover:bg-highlight flex flex-row p-1 ps-4 gap-2 cursor-pointer ${highlight ? "bg-tertiary" : ""}`} onClick={onClick}>
			{icon ? (
				<div className="w-6 text-center">
					<FontAwesomeIcon icon={icon} />
				</div>
			) : null}
			<div className="leading-6">{children}</div>
		</div>
	);
}
