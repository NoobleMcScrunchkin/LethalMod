import { createDirIfNotExist } from "@/services/storage";
import AdmZip, { IZipEntry } from "adm-zip";
import path from "path";
import fs from "fs/promises";

async function sanitizedExtraction(entry: IZipEntry, outputPath: string): Promise<void> {
	const sanitizedTargetName = entry.entryName.split("\\").join("/");
	await createDirIfNotExist(path.dirname(path.join(outputPath, sanitizedTargetName)));
	if (entry.isDirectory) {
		await createDirIfNotExist(path.join(outputPath, sanitizedTargetName));
	} else {
		await fs.writeFile(path.join(outputPath, sanitizedTargetName), entry.getData());
	}
}

async function extractAllTo(filePath: string, extractPath: string): Promise<void> {
	const adm = new AdmZip(filePath);

	for (const entry of adm.getEntries()) {
		await sanitizedExtraction(entry, extractPath);
	}
}

export { extractAllTo };
