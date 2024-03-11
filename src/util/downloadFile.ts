import { createDirIfNotExist } from "@/services/storage";
import fetch from "node-fetch";
import fs from "fs";

async function downloadFile(url: string, path: string, fileName: string): Promise<void> {
	createDirIfNotExist(path);

	const filePath = `${path}/${fileName}`;

	console.log(url);

	const res = await fetch(url);

	const fileStream = fs.createWriteStream(filePath);

	await new Promise((resolve, reject) => {
		res.body.pipe(fileStream);
		res.body.on("error", reject);
		fileStream.on("finish", resolve);
	});
}

export { downloadFile };
