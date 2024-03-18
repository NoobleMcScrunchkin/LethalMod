import { ipcMain } from "electron";
import ProfileManager from "../profile/manage";
import { Profile } from "../profile/types";
import { launchGame } from "../profile/launch";

ipcMain.handle("CREATE_PROFILE", (_, profile: Partial<Profile>) => {
	return ProfileManager.createProfile(profile);
});

ipcMain.handle("EDIT_PROFILE", (_, profile: Partial<Profile>) => {
	return ProfileManager.editProfile(profile);
});

ipcMain.handle("GET_PROFILES", () => {
	return ProfileManager.getProfiles();
});

ipcMain.handle("GET_PROFILE", (_, uuid: string) => {
	return ProfileManager.getProfile(uuid);
});

ipcMain.handle("LAUNCH_GAME", () => {
	return launchGame(ProfileManager.currentProfile);
});

ipcMain.handle("GET_MODS", (_, search: string) => {
	return ProfileManager.getMods(search);
});

ipcMain.handle("SET_MOD_ENABLED", (_, path: string, enabled: boolean) => {
	return ProfileManager.setModEnabled(path, enabled);
});

ipcMain.handle("UNINSTALL_MOD", (_, full_name: string) => {
	return ProfileManager.uninstallMod(full_name);
});
