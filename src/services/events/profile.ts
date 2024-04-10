import { ipcMain } from "electron";
import ProfileManager from "../profile/manage";
import { Profile } from "../profile/types";
import { launchGame } from "../profile/launch";
import { createExportCode, createExportFile } from "../profile/export";
import { importProfileFromCode, importProfileFromFile } from "../profile/import";
import { tryCatch } from "./tryCatch";

ipcMain.handle("CREATE_PROFILE", async (_, profile: Partial<Profile>) => {
	return tryCatch(async () => {
		return ProfileManager.createProfile(profile);
	});
});

ipcMain.handle("EDIT_PROFILE", async (_, profile: Partial<Profile>) => {
	return tryCatch(async () => {
		return ProfileManager.editProfile(profile);
	});
});

ipcMain.handle("GET_PROFILES", async () => {
	return tryCatch(async () => {
		return ProfileManager.getProfiles();
	});
});

ipcMain.handle("GET_PROFILE", async (_, uuid: string) => {
	return tryCatch(async () => {
		return ProfileManager.getProfile(uuid);
	});
});

ipcMain.handle("LAUNCH_GAME", async () => {
	return tryCatch(async () => {
		return launchGame(ProfileManager.currentProfile);
	});
});

ipcMain.handle("GET_MODS", async (_, search: string) => {
	return tryCatch(async () => {
		return ProfileManager.getMods(search);
	});
});

ipcMain.handle("SET_MOD_ENABLED", async (_, path: string, enabled: boolean) => {
	return tryCatch(async () => {
		return ProfileManager.setModEnabled(path, enabled);
	});
});

ipcMain.handle("UNINSTALL_MOD", async (_, full_name: string) => {
	return tryCatch(async () => {
		return ProfileManager.uninstallMod(full_name);
	});
});

ipcMain.handle("EXPORT_PROFILE_CODE", async (_, uuid?: string) => {
	return tryCatch(async () => {
		const profile = uuid ? await ProfileManager.getProfile(uuid) : ProfileManager.currentProfile;

		return createExportCode(profile);
	});
});

ipcMain.handle("EXPORT_PROFILE_FILE", async (_, uuid?: string) => {
	return tryCatch(async () => {
		const profile = uuid ? await ProfileManager.getProfile(uuid) : ProfileManager.currentProfile;

		return createExportFile(profile);
	});
});

ipcMain.handle("IMPORT_PROFILE_CODE", async (_, code: string, uuid?: string) => {
	return tryCatch(async () => {
		return importProfileFromCode(code, uuid ? await ProfileManager.getProfile(uuid) : undefined);
	});
});

ipcMain.handle("IMPORT_PROFILE_FILE", async (_, filePath: string, uuid?: string) => {
	return tryCatch(async () => {
		return importProfileFromFile(filePath, uuid ? await ProfileManager.getProfile(uuid) : undefined);
	});
});
