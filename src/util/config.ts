import { getStoragePath } from "../services/storage";
import path from "path";
import * as dotenv from "dotenv";

dotenv.config();

interface AppConfig {
	storage: {
		storagePath: string;
		thunderstorePath: string;
	};
	graphql: {
		url: string;
	};
}

function getAppConfig(): AppConfig {
	const storagePath = getStoragePath();

	return {
		storage: {
			storagePath,
			thunderstorePath: path.join(storagePath, process.env.THUNDERSTORE_STORAGE_PATH),
		},
		graphql: {
			url: process.env.GRAPHQL_API,
		},
	};
}

const config: AppConfig = getAppConfig();

export { config };
export type { AppConfig };
