import { config } from "@/util/config";
import { extractAllTo } from "@/util/extract";
import { existsSync } from "fs";
import fs from "fs/promises";
import path from "path";
import { createDirIfNotExist } from "../storage";
import axios from "axios";
import { parse } from "yaml";
import { ExportYaml, Profile } from "./types";
import ProfileManager from "./manage";
import ModInstallerQueue from "./modQueue";

const { storagePath } = config.storage;

async function importProfileFromFile(filePath: string, existingProfile?: Profile): Promise<boolean> {
	const currentImportPath = path.join(storagePath, "currentImport");

	if (existsSync(currentImportPath)) {
		await fs.rm(currentImportPath, { recursive: true });
	}

	createDirIfNotExist(currentImportPath);

	await extractAllTo(filePath, currentImportPath);

	const yamlPath = path.join(currentImportPath, "export.r2x");

	if (!existsSync(yamlPath)) {
		return false;
	}

	const yaml = await fs.readFile(yamlPath, "utf-8");

	const exportInfo = parse(yaml) as ExportYaml;

	let profile: Profile | null = null;

	if (existingProfile === undefined) {
		profile = await ProfileManager.createProfile({ name: exportInfo.profileName });
	} else {
		profile = existingProfile;
	}

	if (!profile) {
		return false;
	}

	ProfileManager.setCurrentProfile(profile);

	const full_names = exportInfo.mods.map((pack) => {
		const versionString = pack.version.major + "." + pack.version.minor + "." + pack.version.patch;
		return pack.name + "-" + versionString;
	});

	ModInstallerQueue.addToQueueFromFullNames(full_names);

	await new Promise((resolve) => {
		ModInstallerQueue.registerCallBack((queue) => {
			if (queue.length === 0) resolve(true);
		});
	});

	const importBepPath = path.join(currentImportPath, "BepInEx");

	if (existsSync(importBepPath)) {
		const profileBepPath = path.join(profile.path, "BepInEx");

		createDirIfNotExist(profileBepPath);

		await fs.cp(importBepPath, profileBepPath, { recursive: true });
	}

	const importConfigPath = path.join(currentImportPath, "config");

	if (existsSync(importBepPath)) {
		const profileConfigPath = path.join(profile.path, "BepInEx", "config");

		createDirIfNotExist(profileConfigPath);

		await fs.cp(importConfigPath, profileConfigPath, { recursive: true });
	}

	return true;
}

async function importProfileFromCode(code: string, existingProfile?: Profile): Promise<boolean> {
	const importsPath = path.join(storagePath, "imports");

	createDirIfNotExist(importsPath);

	try {
		const { data } = (await axios.get(`https://thunderstore.io/api/experimental/legacyprofile/get/${code}`)) as { data: string };

		const buffer = Buffer.from(data.split("\n")[1].replace("\r", ""), "base64");

		const thisImportPath = path.join(importsPath, code + ".r2z");

		await fs.writeFile(thisImportPath, buffer);

		const result = importProfileFromFile(thisImportPath, existingProfile);

		await fs.rm(thisImportPath);

		return result;
	} catch (e) {
		console.error(e);
		return false;
	}
}

export { importProfileFromFile, importProfileFromCode };
