import { config } from "@/util/config";
import { createDirIfNotExist } from "../storage";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { ModManifest, Profile } from "./types";
import { v4 } from "uuid";
import { installBepInEx } from "./bepinex";

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
	mods: [],
	path: "",
};

async function fromProfileSave(profile: Partial<ProfileSave>, uuid: string): Promise<Profile> {
	let mods: Array<ModManifest> = [];

	const profilePath = path.join(profilesPath, uuid);

	const pluginsPath = path.join(profilePath, "BepInEx", "plugins");

	if (existsSync(pluginsPath)) {
		const modFolders = await fs.readdir(pluginsPath);

		mods = await Promise.all(
			modFolders.map(async (modFolder) => {
				const manifestPath = path.join(pluginsPath, modFolder, "manifest.json");

				if (!existsSync(manifestPath)) {
					return null;
				}

				const buffer = (await fs.readFile(manifestPath, "utf-8")).replace("\ufeff", "");

				console.log(manifestPath);

				const manifest: ModManifest = JSON.parse(buffer);

				return manifest;
			})
		);
	}

	return {
		...defaultProfile,
		uuid: uuid,
		name: profile.name,
		mods,
		path: profilePath,
	};
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
}

export default ProfileManager;
