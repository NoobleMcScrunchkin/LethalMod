import type { CodegenConfig } from "@graphql-codegen/cli";
import * as dotenv from "dotenv";

dotenv.config();

const config: CodegenConfig = {
	schema: process.env.GRAPHQL_API,
	documents: ["src/**/*.tsx", "src/**/*.ts"],
	generates: {
		"./src/__generated__/": {
			preset: "client",
			presetConfig: {
				fragmentMasking: false,
				gqlTagName: "gql",
			},
		},
	},
	ignoreNoDocuments: true,
};

export default config;
