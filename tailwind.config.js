import { red, zinc } from "tailwindcss/colors";

export default {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				titlebar: zinc["900"],
				highlight: zinc["600"],
				primary: zinc["900"],
				secondary: zinc["800"],
				tertiary: zinc["700"],
				error: red["500"],
			},
			textColor: {
				primary: zinc["100"],
				secondary: zinc["200"],
				subtle: zinc["400"],
				muted: zinc["500"],
			},
		},
	},
	variants: {},
	plugins: [],
};
