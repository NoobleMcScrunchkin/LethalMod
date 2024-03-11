const colors = require("tailwindcss/colors");

module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: colors.blue["900"],
				secondary: colors.zinc["100"],
				"background-primary": colors.zinc["900"],
				"background-secondary": colors.zinc["800"],
				"background-tertiary": colors.zinc["700"],
				"background-quaternary": colors.zinc["600"],
				"text-primary": colors.zinc["100"],
				"text-secondary": colors.zinc["200"],
				"text-muted": colors.zinc["500"],
			},
		},
	},
	variants: {},
	plugins: [],
};
