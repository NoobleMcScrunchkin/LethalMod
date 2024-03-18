import { classed } from "@tw-classed/react";

export default classed.button("bg-tertiary hover:bg-highlight", {
	variants: {
		noPadding: { true: "p-0", false: "p-2" },
		grow: { true: "grow" },
		rounding: {
			none: "rounded-none",
			small: "rounded-sm",
			medium: "rounded",
			large: "rounded-lg",
			full: "rounded-full",
		},
	},
	defaultVariants: {
		rounding: "medium",
		noPadding: "false",
	},
});
