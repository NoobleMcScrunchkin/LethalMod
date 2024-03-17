import { app, BrowserWindow, session } from "electron";
import ModInstallerQueue from "./profile/modQueue";
import "./events";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export class Browser {
	static mainWindow: BrowserWindow | null = null;

	static async createWindow(): Promise<void> {
		await session.defaultSession.loadExtension("C:/Users/riley/AppData/Local/Google/Chrome/User Data/Default/Extensions/jdkknkkbebbapilgoeccciglkfbmbnfm/4.9.0_0");
		await session.defaultSession.loadExtension("C:/Users/riley/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/5.0.2_2");

		Browser.mainWindow = new BrowserWindow({
			height: 600,
			width: 800,
			webPreferences: {
				preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
				nodeIntegration: true,
				contextIsolation: false,
			},
			frame: false,
		});

		Browser.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

		Browser.mainWindow.webContents.openDevTools();

		Browser.mainWindow.on("closed", () => {
			Browser.mainWindow = null;
		});

		Browser.afterWindowCreation();
	}

	static afterWindowCreation(): void {
		session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
			callback({
				responseHeaders: {
					...details.responseHeaders,
					"Content-Security-Policy": ["*"],
				},
			});
		});

		ModInstallerQueue.setCallBack((queue) => {
			try {
				Browser.mainWindow.webContents.send("QUEUE_UPDATED", queue);
			} catch (e) {
				console.log("FAILED TO EMIT");
			}
		});
	}

	static init(): void {
		if (require("electron-squirrel-startup")) {
			app.quit();
		}

		app.on("ready", Browser.createWindow);

		app.on("window-all-closed", () => {
			if (process.platform !== "darwin") {
				app.quit();
			}
		});

		app.on("activate", () => {
			if (BrowserWindow.getAllWindows().length === 0) {
				Browser.createWindow();
			}
		});
	}
}
