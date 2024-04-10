import { exec } from "child_process";
import { LETHAL_COMPANY_STEAM_ID } from "@/util/constants";
import { getSteamPath } from "steam-path";
import path from "path";
import { Profile } from "./types";

async function launchGame(profile: Profile) {
	const preloaderDllPath = path.join(profile.path, "BepInEx", "core", "BepInEx.Preloader.dll");

	const steam = await getSteamPath();

	const steamExe = path.join(steam.path, "steam.exe");

	exec(`"${steamExe}" -applaunch ${LETHAL_COMPANY_STEAM_ID} --doorstop-enable true --doorstop-target ${preloaderDllPath}`);
}

export { launchGame };
