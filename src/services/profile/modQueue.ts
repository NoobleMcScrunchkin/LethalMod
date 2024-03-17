import { gql } from "@/__generated__/gql";
import { client } from "@/apollo";
import ProfileManager from "./manage";
import { downloadFile } from "@/util/downloadFile";
import { ModManifest, PackageVersion, Profile } from "./types";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { createDirIfNotExist } from "../storage";
import { config } from "@/util/config";
import { extractAllTo } from "@/util/extract";

const { storagePath } = config.storage;

const GET_MOD_QUEUE = gql(`
  query GET_MOD_QUEUE($full_name: String!) {
    dependencyList(full_name: $full_name) {
      packages {
        name
        full_name
        dependencies
        description
        download_url
				version_number
				website_url
        file_size
        icon
      }
      missing
    }
  }
`);

class ModInstallerQueue {
	static queue: Array<PackageVersion> = [];
	static installing = false;

	static callback: (queue: Array<PackageVersion>) => void = () => {
		return;
	};

	static enqueue(...el: Array<PackageVersion>) {
		ModInstallerQueue.queue.push(...el);
	}

	static dequeue() {
		return ModInstallerQueue.queue.length !== 0 ? ModInstallerQueue.queue.shift() : "No executable element";
	}

	static setCallBack(callback: (queue: Array<PackageVersion>) => void) {
		ModInstallerQueue.callback = callback;
	}

	static async addToQueueFromMod(full_name: string): Promise<Array<PackageVersion>> {
		const { data } = await client.query({ query: GET_MOD_QUEUE, variables: { full_name } });

		ModInstallerQueue.enqueue(...data.dependencyList.packages);

		ModInstallerQueue.callback(ModInstallerQueue.queue);

		if (ModInstallerQueue.installing === false) {
			ModInstallerQueue.startInstallingMods();
		}

		return ModInstallerQueue.queue;
	}

	static async startInstallingMods() {
		ModInstallerQueue.installing = true;

		while (ModInstallerQueue.queue.length !== 0) {
			const current = ModInstallerQueue.dequeue();
			if (current === "No executable element") {
				break;
			}

			await installMod(ProfileManager.currentProfile, current);

			ModInstallerQueue.callback(ModInstallerQueue.queue);
		}
		ModInstallerQueue.installing = false;
	}
}

async function installMod(profile: Profile, packageVersion: PackageVersion) {
	const { full_name } = packageVersion;

	console.log(`Installing ${full_name}`);

	const folderNameForFullName = full_name.split("-").slice(0, -1).join("-");
	const { path: profilePath } = profile;

	const tempPath = path.join(storagePath, "temp");

	if (existsSync(tempPath)) {
		await fs.rm(tempPath, { recursive: true });
	}

	let filePath = "";

	let sizeDoesntMatch = true;

	while (sizeDoesntMatch) {
		filePath = await downloadFile(packageVersion.download_url, tempPath);

		if (filePath === null) {
			console.log("Failed downloading");
			continue;
		}

		if ((await fs.stat(filePath)).size === packageVersion.file_size) sizeDoesntMatch = false;
	}

	if (filePath.endsWith(".zip")) {
		try {
			await extractAllTo(filePath, tempPath);
		} catch (e) {
			console.log(`Failed installing ${full_name}: Extracting failed`, e);

			await fs.rm(tempPath, { recursive: true });
			return false;
		}

		await fs.unlink(filePath);

		const bepinexTempPath = path.join(tempPath, "BepInEx");
		const bepinexProfilePath = path.join(profilePath, "BepInEx");

		if (existsSync(bepinexTempPath)) {
			await Promise.all(
				(await fs.readdir(bepinexTempPath)).map(async (file) => {
					const currentPath = path.join(bepinexTempPath, file);

					const stat = await fs.lstat(currentPath);

					if (stat.isFile()) {
						const newPath = path.join(bepinexProfilePath, file);
						await fs.copyFile(currentPath, newPath);
					} else {
						let newPath = "";
						if (file === "plugins") {
							newPath = path.join(bepinexProfilePath, file, folderNameForFullName);
						} else {
							newPath = path.join(bepinexProfilePath, file);
						}
						createDirIfNotExist(newPath);
						await fs.cp(currentPath, newPath, { recursive: true });
					}
				})
			);
		} else {
			await Promise.all(
				(await fs.readdir(tempPath)).map(async (file) => {
					const currentPath = path.join(tempPath, file);

					const stat = await fs.lstat(currentPath);

					if (!stat.isFile()) {
						let newPath = "";
						if (file === "plugins") {
							newPath = path.join(bepinexProfilePath, file, folderNameForFullName);
						} else {
							if (file === "patchers" || file === "config" || file === "core") {
								newPath = path.join(bepinexProfilePath, file);
							} else {
								newPath = path.join(bepinexProfilePath, "plugins", folderNameForFullName);
							}
						}
						createDirIfNotExist(newPath);
						await fs.cp(currentPath, newPath, { recursive: true });
					} else {
						const newPath = path.join(bepinexProfilePath, "plugins", folderNameForFullName, file);
						await fs.cp(currentPath, newPath);
					}
				})
			);
		}

		const namespace = folderNameForFullName.split("-")[0];

		const newManifest: ModManifest = {
			name: packageVersion.name,
			full_name: packageVersion.full_name,
			version_number: packageVersion.version_number,
			description: packageVersion.description,
			dependencies: packageVersion.dependencies,
			namespace,
			website_url: packageVersion.website_url,
			icon: packageVersion.icon,
		};

		createDirIfNotExist(path.join(profilePath, "BepInEx", "plugins", folderNameForFullName));
		await fs.writeFile(path.join(profilePath, "BepInEx", "plugins", folderNameForFullName, "manifest.json"), JSON.stringify(newManifest));
	}

	await fs.rm(tempPath, { recursive: true });

	console.log(`Done installing ${full_name}`);
}

export default ModInstallerQueue;
