import { ipcMain } from "electron";
import ModInstallerQueue from "../profile/modQueue";

ipcMain.handle("QUEUE_MOD", (_, full_name: string) => {
	return ModInstallerQueue.addToQueueFromMod(full_name);
});

ipcMain.handle("GET_QUEUE", () => {
	return ModInstallerQueue.queue;
});
