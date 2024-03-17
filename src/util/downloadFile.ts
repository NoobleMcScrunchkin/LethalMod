import { createDirIfNotExist } from "@/services/storage";
import fetch from "node-fetch";
import type { Response } from "node-fetch";
import fs from "fs";

async function downloadFile(url: string, path: string, fileName?: string): Promise<string> {
	createDirIfNotExist(path);

	let res: Response | null = null;

	try {
		res = await fetch(url, {});
	} catch (err) {
		console.log(err);
		return null;
	}

	const resFileName = res.url.split("/").pop();

	const filePath = `${path}/${fileName ? fileName : resFileName}`;

	const fileStream = fs.createWriteStream(filePath);

	await new Promise((resolve, reject) => {
		res.body.pipe(fileStream);
		res.body.on("error", reject);
		fileStream.on("finish", resolve);
	});

	return filePath;
}

export { downloadFile };
