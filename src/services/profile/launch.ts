import { exec } from "child_process";
import { LETHAL_COMPANY_STEAM_ID } from "@/util/constants";
import { getAppPath } from "steam-path";
import path from "path";
import { Profile } from "./types";

async function launchGame(profile: Profile) {
	const preloaderDllPath = path.join(profile.path, "BepInEx", "core", "BepInEx.Preloader.dll");

	const game = await getAppPath(LETHAL_COMPANY_STEAM_ID);

	const gameExe = path.join(game.path, "Lethal Company.exe");

	exec(`"${gameExe}" --doorstop-enable true --doorstop-target ${preloaderDllPath}`);
}

export { launchGame };
