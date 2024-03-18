import type { CodegenConfig } from "@graphql-codegen/cli";
import { config as appConfig } from "./src/util/config";

const config: CodegenConfig = {
	schema: appConfig.graphql.url,
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
