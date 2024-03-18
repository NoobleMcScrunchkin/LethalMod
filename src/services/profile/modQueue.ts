import { gql } from "@/__generated__/gql";
import { client } from "@/apollo";
import ProfileManager from "./manage";
import { downloadFile } from "@/util/downloadFile";
import { ModManifest, Profile } from "./types";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { createDirIfNotExist } from "../storage";
import { config } from "@/util/config";
import { extractAllTo } from "@/util/extract";
import { Get_Mod_QueueQuery } from "@/__generated__/graphql";
import { compareVersions } from "compare-versions";

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
				package {
					donation_link
					categories
				}
      }
      missing
    }
  }
`);

type QueuePackageVersion = Get_Mod_QueueQuery["dependencyList"]["packages"][number];

class ModInstallerQueue {
	static queue: Array<QueuePackageVersion> = [];
	static installing = false;

	static callback: (queue: Array<QueuePackageVersion>) => void = () => {
		return;
	};

	static async enqueue(...els: Array<QueuePackageVersion>) {
		await Promise.all(
			els.map(async (el) => {
				const folderNameForFullName = el.full_name.split("-").slice(0, -1).join("-");

				const inQueueAlready = ModInstallerQueue.queue.find((queueEl) => queueEl.full_name.includes(folderNameForFullName));

				if (inQueueAlready) {
					if (compareVersions(inQueueAlready.version_number, el.version_number) !== -1) return;
				}

				const pluginPath = path.join(ProfileManager.currentProfile.path, "BepInEx", "plugins", folderNameForFullName);

				if (existsSync(pluginPath)) {
					const manifestPath = path.join(pluginPath, "manifest.json");

					if (existsSync(manifestPath)) {
						const manifest = JSON.parse(await fs.readFile(manifestPath, "utf-8")) as ModManifest;

						if (compareVersions(manifest.version_number, el.version_number) !== -1) {
							return;
						}
					}
				}

				ModInstallerQueue.queue.push(el);
			})
		);
	}

	static dequeue() {
		return ModInstallerQueue.queue.length !== 0 ? ModInstallerQueue.queue.shift() : "No executable element";
	}

	static setCallBack(callback: (queue: Array<QueuePackageVersion>) => void) {
		ModInstallerQueue.callback = callback;
	}

	static async addToQueueFromMod(full_name: string): Promise<Array<QueuePackageVersion>> {
		const { data } = await client.query({ query: GET_MOD_QUEUE, variables: { full_name } });

		await ModInstallerQueue.enqueue(...data.dependencyList.packages);

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

async function installMod(profile: Profile, packageVersion: QueuePackageVersion) {
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

		if (existsSync(path.join(bepinexProfilePath, "plugins", folderNameForFullName))) await fs.rm(path.join(bepinexProfilePath, "plugins", folderNameForFullName), { recursive: true });
		if (existsSync(path.join(bepinexProfilePath, "core", folderNameForFullName))) await fs.rm(path.join(bepinexProfilePath, "core", folderNameForFullName), { recursive: true });
		if (existsSync(path.join(bepinexProfilePath, "patcher", folderNameForFullName))) await fs.rm(path.join(bepinexProfilePath, "patcher", folderNameForFullName), { recursive: true });

		if (existsSync(bepinexTempPath)) {
			await Promise.all(
				(await fs.readdir(bepinexTempPath)).map(async (file) => {
					const currentPath = path.join(bepinexTempPath, file);

					const stat = await fs.lstat(currentPath);

					if (stat.isFile()) {
						const newPath = path.join(bepinexProfilePath, file);
						await fs.copyFile(currentPath, newPath);
					} else {
						const newPath = path.join(bepinexProfilePath, file, folderNameForFullName);
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
								if (file === "config") {
									newPath = path.join(bepinexProfilePath, file);
								} else {
									newPath = path.join(bepinexProfilePath, file, folderNameForFullName);
								}
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
			donation_url: packageVersion.package.donation_link,
			categories: packageVersion.package.categories,
			icon: packageVersion.icon,
		};

		createDirIfNotExist(path.join(profilePath, "BepInEx", "plugins", folderNameForFullName));
		await fs.writeFile(path.join(profilePath, "BepInEx", "plugins", folderNameForFullName, "manifest.json"), JSON.stringify(newManifest));
	}

	await fs.rm(tempPath, { recursive: true });

	console.log(`Done installing ${full_name}`);
}

export default ModInstallerQueue;
