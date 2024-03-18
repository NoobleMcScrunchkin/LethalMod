import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";

export default function TitlebarButton({ icon, onClick, children, iconProps }: { icon?: IconProp; onClick: () => void; children?: ReactNode; iconProps?: Omit<FontAwesomeIconProps, "icon"> }) {
	return (
		<div onClick={onClick} className="w-6 h-6 text-center hover:bg-highlight">
			{icon ? <FontAwesomeIcon icon={icon} color="currentColor" {...iconProps} /> : children}
		</div>
	);
}
