import fs from "fs";

const regex = /function\s*(baseCommand)\s*\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\}/;

const js = fs.readFileSync("./node_modules/regedit/index.js", "utf-8");

const replacement = `
function baseCommand(cmd, arch) {
	return ['//Nologo', path.join(externalVBSFolderLocation, cmd), arch];
}
`;

const replaced = js.replace(regex, replacement);

fs.writeFileSync("./node_modules/regedit/index.js", replaced);
