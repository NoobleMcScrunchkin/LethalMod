import { ipcMain } from "electron";
import ModInstallerQueue from "../profile/modQueue";
import { tryCatch } from "./tryCatch";

ipcMain.handle("QUEUE_MOD", (_, full_name: string) => {
	return tryCatch(async () => {
		return ModInstallerQueue.addToQueueFromMod(full_name);
	});
});

ipcMain.handle("GET_QUEUE", () => {
	return tryCatch(async () => {
		return ModInstallerQueue.queue;
	});
});
