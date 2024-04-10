import AdmZip from "adm-zip";
import path from "path";
import fs from "fs/promises";

async function zipAllToBuffer(folder: string): Promise<Buffer> {
	const adm = new AdmZip();

	const files = await fs.readdir(folder);

	for (const file of files) {
		const filePath = path.join(folder, file);
		const stats = await fs.stat(filePath);

		if (stats.isDirectory()) {
			adm.addLocalFolder(filePath, file);
		} else {
			adm.addLocalFile(filePath);
		}
	}

	return adm.toBuffer();
}

export { zipAllToBuffer };
