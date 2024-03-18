import path from "path";
import { setExternalVBSLocation } from "regedit";
import ProfileManager from "./services/profile/manage";
import { Browser } from "./services/browser";
import { config } from "./util/config";

process.traceProcessWarnings = true;

const vbsPath = path.join(process.resourcesPath, "vbs");
setExternalVBSLocation(vbsPath);

ProfileManager.getProfile(config.isDev ? "09c8de31-da64-4b23-b938-ea12a91db0e0" : "80b59c92-134b-4cd4-90ac-a3dd5c3d5745").then((profile) => {
	ProfileManager.setCurrentProfile(profile);
});

Browser.init();
