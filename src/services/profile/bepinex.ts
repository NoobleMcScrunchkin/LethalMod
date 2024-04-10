import { gql } from "@/__generated__/gql";
import { client } from "../../apollo";
import { downloadFile } from "@/util/downloadFile";
import { config } from "@/util/config";
import path from "path";
import fs from "fs/promises";
import { getAppPath } from "steam-path";
import { LETHAL_COMPANY_STEAM_ID } from "@/util/constants";
import { createDirIfNotExist } from "../storage";
import { extractAllTo } from "@/util/extract";

const GET_BEPINEX_LINK = gql(`
  query GET_BEPINEX_LINK {
		bepinex {
			versions {
				download_url
			}
			full_name
		}
  }
`);

async function installBepInEx(profilePath: string) {
	console.log("Installing BepInEx");

	const { storagePath } = config.storage;
	const { data } = await client.query({ query: GET_BEPINEX_LINK });

	if (!data.bepinex) {
		return false;
	}

	const { versions } = data.bepinex;

	const dlPath = path.join(storagePath, "BepInEx");
	const fileName = "BepInEx.zip";
	const filePath = path.join(dlPath, fileName);

	const res = await downloadFile(versions[0].download_url, dlPath, fileName);

	if (res === null) {
		console.log("Failed downloading");
		return;
	}

	extractAllTo(filePath, dlPath);

	const bepinexPackPath = path.join(dlPath, "BepInExPack");

	await fs.unlink(filePath);

	const game = await getAppPath(LETHAL_COMPANY_STEAM_ID);

	await Promise.all(
		(await fs.readdir(bepinexPackPath)).map(async (file) => {
			const currentPath = path.join(bepinexPackPath, file);

			const stat = await fs.lstat(currentPath);

			if (stat.isFile()) {
				const newPath = path.join(game.path, file);
				fs.copyFile(currentPath, newPath);
			} else {
				console.log(currentPath, profilePath, file);
				const newPath = path.join(profilePath, file);
				createDirIfNotExist(newPath);
				fs.cp(currentPath, newPath, { recursive: true });
			}
		})
	);

	await fs.rm(dlPath, { recursive: true });

	console.log("Install Complete");
}

export { installBepInEx };
