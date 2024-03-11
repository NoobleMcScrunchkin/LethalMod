import { homedir } from "os";
import path from "path";
import { name } from "../../../package.json";
import fs from "fs";

function getStoragePath(): string {
	const home = homedir();
	return path.join(home, name + "-storage");
}

function createDirIfNotExist(dirPath: string): void {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
	}
}

export { getStoragePath, createDirIfNotExist };
