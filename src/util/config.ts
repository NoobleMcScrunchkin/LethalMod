import { getStoragePath } from "../services/storage";
import path from "path";
import * as dotenv from "dotenv";

dotenv.config();
interface AppConfig {
	storage: {
		storagePath: string;
		profilesPath: string;
		thunderstorePath: string;
	};
	graphql: {
		url: string;
	};
	isDev: boolean;
}

function getAppConfig(): AppConfig {
	const storagePath = getStoragePath();

	return {
		storage: {
			storagePath,
			profilesPath: path.join(storagePath, "profiles"),
			thunderstorePath: path.join(storagePath, "thunderstore"),
		},
		graphql: {
			url: "https://thunder.aslett.io/api/graphql",
		},
		isDev: process.env.APP_DEV === "true",
	};
}

const config: AppConfig = getAppConfig();

export { config };
export type { AppConfig };
