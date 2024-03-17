import path from "path";
import { setExternalVBSLocation } from "regedit";
import ProfileManager from "./services/profile/manage";
import { Browser } from "./services/browser";

process.traceProcessWarnings = true;

const vbsPath = path.join(process.resourcesPath, "vbs");
setExternalVBSLocation(vbsPath);

ProfileManager.getProfile("09c8de31-da64-4b23-b938-ea12a91db0e0").then((profile) => {
	ProfileManager.setCurrentProfile(profile);
});

Browser.init();
