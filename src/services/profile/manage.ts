import { config } from "@/util/config";
import { createDirIfNotExist } from "../storage";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { ModManifest, ModManifestExtra, Profile } from "./types";
import { v4 } from "uuid";
import { installBepInEx } from "./bepinex";
import { objectContains } from "@/util/objectContains";

const { profilesPath } = config.storage;

interface ProfileSave {
	name: string;
}

const defaultProfileSave: ProfileSave = {
	name: "",
};

function toProfileSave(profile: Partial<Profile>, initial: ProfileSave = defaultProfileSave): ProfileSave {
	return {
		...initial,
		name: profile.name,
	};
}

const defaultProfile: Profile = {
	uuid: "",
	name: "",
	path: "",
};

async function fromProfileSave(profile: Partial<ProfileSave>, uuid: string): Promise<Profile> {
	const profilePath = path.join(profilesPath, uuid);

	return {
		...defaultProfile,
		uuid: uuid,
		name: profile.name,
		path: profilePath,
	};
}

async function uninstallMod(profile: Profile, full_name: string) {
	const { path: profilePath } = profile;
	const bepinexProfilePath = path.join(profilePath, "BepInEx");

	const folderNameForFullName = full_name.split("-").slice(0, -1).join("-");

	if (existsSync(path.join(bepinexProfilePath, "plugins", folderNameForFullName))) await fs.rm(path.join(bepinexProfilePath, "plugins", folderNameForFullName), { recursive: true });
	if (existsSync(path.join(bepinexProfilePath, "core", folderNameForFullName))) await fs.rm(path.join(bepinexProfilePath, "core", folderNameForFullName), { recursive: true });
	if (existsSync(path.join(bepinexProfilePath, "patcher", folderNameForFullName))) await fs.rm(path.join(bepinexProfilePath, "patcher", folderNameForFullName), { recursive: true });
}

class ProfileManager {
	static currentProfile: Profile | null = null;

	static setCurrentProfile(profile: Profile): void {
		ProfileManager.currentProfile = profile;
	}

	static async createProfile({ name }: Partial<Profile>): Promise<Profile> {
		const uuid = v4();

		const profilePath = path.join(profilesPath, uuid);

		createDirIfNotExist(profilePath);

		const profileInfoPath = path.join(profilePath, "profile.json");

		const profileSave = toProfileSave({ name });

		await fs.writeFile(profileInfoPath, JSON.stringify(profileSave));

		await installBepInEx(profilePath);

		return fromProfileSave(profileSave, uuid);
	}

	static async getProfile(uuid: string): Promise<Profile | null> {
		const profilePath = path.join(profilesPath, uuid);

		const profileInfoPath = path.join(profilePath, "profile.json");

		if (!existsSync(profileInfoPath)) {
			console.log("Profile not found", { uuid, method: "getProfile" });
			return null;
		}

		const profileSave: ProfileSave = JSON.parse(await fs.readFile(profileInfoPath, "utf-8"));

		return fromProfileSave(profileSave, uuid);
	}

	static async getProfiles(): Promise<Array<Profile>> {
		const profiles = await fs.readdir(profilesPath);

		return (
			await Promise.all(
				profiles.map(async (uuid) => {
					return ProfileManager.getProfile(uuid);
				})
			)
		).filter((profile) => profile !== null);
	}

	static async editProfile(profile: Partial<Profile>): Promise<Profile | null> {
		const profilePath = path.join(profilesPath, profile.uuid);

		const profileInfoPath = path.join(profilePath, "profile.json");

		if (!existsSync(profileInfoPath)) {
			console.log("Profile not found", { profile, method: "editProfile" });
			return null;
		}

		const initialProfileSave: ProfileSave = JSON.parse(await fs.readFile(profileInfoPath, "utf-8"));

		const profileSave = toProfileSave(profile, initialProfileSave);

		fs.writeFile(profileInfoPath, JSON.stringify(profileSave));

		return fromProfileSave(profileSave, profile.uuid);
	}

	static async getMods(search = "") {
		const { uuid } = ProfileManager.currentProfile;

		let mods: Array<ModManifestExtra> = [];

		const profilePath = path.join(profilesPath, uuid);

		const pluginsPath = path.join(profilePath, "BepInEx", "plugins");

		if (existsSync(pluginsPath)) {
			const modFolders = await fs.readdir(pluginsPath);

			mods = await Promise.all(
				modFolders.map(async (modFolder) => {
					let manifestPath = path.join(pluginsPath, modFolder, "manifest.json");

					let enabled = false;

					if (!existsSync(manifestPath)) {
						manifestPath = path.join(pluginsPath, modFolder, "manifest.json.disabled");

						if (!existsSync(manifestPath)) {
							return null;
						}
					} else {
						enabled = true;
					}

					const buffer = (await fs.readFile(manifestPath, "utf-8")).replace("\ufeff", "");

					const manifest: ModManifest = JSON.parse(buffer);

					const modPath = path.join(pluginsPath, modFolder);

					return { ...manifest, enabled, path: modPath };
				})
			);
		}

		const filtered = mods.filter((mod) => {
			return objectContains(mod as unknown as Record<string, unknown>, search);
		});

		const sorted = filtered.sort((a, b) => {
			return a.name.localeCompare(b.name);
		});

		return sorted;
	}

	static async setModEnabled(folderPath: string, enable: boolean) {
		await toggleFileNames(folderPath, enable);
		await toggleFileNames(folderPath.replace("plugins", "core"), enable);
		await toggleFileNames(folderPath.replace("plugins", "patchers"), enable);
	}

	static async uninstallMod(full_name: string) {
		console.log("Uninstalling:", full_name);
		await uninstallMod(ProfileManager.currentProfile, full_name);
		console.log("Done Uninstalling:", full_name);
	}
}

async function toggleFileNames(folderPath: string, enable: boolean) {
	if (!existsSync(folderPath)) return;

	const filesFolders = await fs.readdir(folderPath);

	await Promise.all(
		filesFolders.map(async (file) => {
			const current = path.join(folderPath, file);

			const stat = await fs.lstat(current);

			if (stat.isFile()) {
				const newPath = enable ? current.replace(".disabled", "") : current + ".disabled";

				await fs.rename(current, newPath);
			} else {
				await toggleFileNames(current, enable);
			}
		})
	);
}

export default ProfileManager;
