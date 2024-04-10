import { stringify } from "yaml";
import { ExportYaml, Profile } from "./types";
import ProfileManager from "./manage";
import { createDirIfNotExist } from "../storage";
import { config } from "@/util/config";
import { existsSync } from "fs";
import path from "path";
import fs from "fs/promises";
import { zipAllToBuffer } from "@/util/zip";
import axios from "axios";

const { storagePath } = config.storage;

async function createExportYaml(profile: Profile): Promise<string> {
	const mods = await ProfileManager.getMods("", profile);

	const modsToExport = mods.map((mod) => {
		const version = mod.version_number.split(".");
		return {
			name: `${mod.namespace}-${mod.name}`,
			version: {
				major: parseInt(version[0]),
				minor: parseInt(version[1]),
				patch: parseInt(version[2]),
			},
			enabled: mod.enabled,
		};
	});

	const yaml: ExportYaml = {
		profileName: profile.name,
		mods: [
			{
				name: "BepInEx-BepInExPack",
				version: {
					major: 5,
					minor: 4,
					patch: 2100,
				},
				enabled: true,
			},
			...modsToExport,
		],
	};

	return stringify(yaml);
}

async function copyConfigsFromProfileToExport(profilePath: string, exportPath: string) {
	const read = await fs.readdir(profilePath);

	for (const file of read) {
		const profileFilePath = path.join(profilePath, file);
		const exportFilePath = path.join(exportPath, file);
		const stats = await fs.stat(profileFilePath);

		if (stats.isDirectory()) {
			createDirIfNotExist(exportFilePath);
			await copyConfigsFromProfileToExport(profileFilePath, exportFilePath);
		} else {
			if (file.endsWith(".json") || file.endsWith(".txt")) {
				await fs.copyFile(profileFilePath, exportFilePath);
			}
		}
	}
}

async function cleanEmptyFoldersRecursively(filepath: string) {
	const isDir = (await fs.stat(filepath)).isDirectory();

	if (!isDir) {
		return;
	}

	let files = await fs.readdir(filepath);

	if (files.length > 0) {
		files.forEach(function (file) {
			const fullPath = path.join(filepath, file);
			cleanEmptyFoldersRecursively(fullPath);
		});

		files = await fs.readdir(filepath);
	}

	if (files.length == 0) {
		await fs.rm(filepath, { recursive: true });
		return;
	}
}

async function createExport(profile: Profile): Promise<Buffer> {
	const yaml = await createExportYaml(profile);

	const exportsPath = path.join(storagePath, "exports");
	const profileExportPath = path.join(exportsPath, profile.name);

	if (existsSync(profileExportPath)) {
		await fs.rm(profileExportPath, { recursive: true });
	}

	createDirIfNotExist(profileExportPath);

	const yamlPath = path.join(profileExportPath, "export.r2x");

	await fs.writeFile(yamlPath, yaml);

	const configDir = path.join(profile.path, "BepInEx", "config");
	const configExportDir = path.join(profileExportPath, "config");

	await fs.cp(configDir, configExportDir, { recursive: true });

	const bepProfile = path.join(profile.path, "BepInEx");
	const bepExport = path.join(profileExportPath, "BepInEx");

	await copyConfigsFromProfileToExport(bepProfile, bepExport);
	await cleanEmptyFoldersRecursively(bepExport);

	const buffer = await zipAllToBuffer(profileExportPath);

	await fs.rm(profileExportPath, { recursive: true, force: true });

	return buffer;
}

async function createExportFile(profile: Profile): Promise<string> {
	const buffer = await createExport(profile);

	const exportsPath = path.join(storagePath, "exports");
	const profileExportPath = path.join(exportsPath, profile.name + ".r2z");

	await fs.writeFile(profileExportPath, buffer);

	return profileExportPath;
}

async function createExportCode(profile: Profile): Promise<string> {
	const buffer = await createExport(profile);

	const base64 = "#r2modman\n" + buffer.toString("base64");

	const { data } = (await axios.post("https://thunderstore.io/api/experimental/legacyprofile/create/", base64, {
		headers: { "Content-Type": "application/octet-stream" },
	})) as { data: { key?: string } };

	if (!data.key) {
		throw new Error("Failed to create export code");
	}

	return data.key;
}

export { createExportYaml, createExport, createExportCode, createExportFile };
