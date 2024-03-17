import { ipcMain } from "electron";
import { Browser } from "../browser";

ipcMain.on("MINIMIZE", (): void => {
	Browser.mainWindow?.minimize();
});

ipcMain.on("MAXIMIZE", (): void => {
	if (Browser.mainWindow?.isMaximized()) {
		Browser.mainWindow?.unmaximize();
	} else {
		Browser.mainWindow?.maximize();
	}
});

ipcMain.on("CLOSE", (): void => {
	Browser.mainWindow?.close();
});
