import { classed } from "@tw-classed/react";

export default classed.input("bg-secondary outline-0 rounded-lg p-2", { variants: { grow: { true: "grow" } }, defaultProps: { type: "text" } });
