interface Profile {
	uuid: string;
	name: string;
	path: string;
}

interface ModManifest {
	namespace: string;
	name: string;
	description: string;
	version_number: string;
	dependencies: Array<string>;
	categories: Array<string>;
	website_url: string;
	donation_url: string;
	full_name: string;
	icon: string;
}

interface ModManifestExtra extends ModManifest {
	enabled: boolean;
	path: string;
}

interface PackageVersion {
	full_name: string;
	dependencies: Array<string>;
	description: string;
	download_url: string;
	file_size: number;
	icon: string;
	version_number: string;
	name: string;
	website_url: string;
}

interface ExportMod {
	name: string;
	version: {
		major: number;
		minor: number;
		patch: number;
	};
	enabled: boolean;
}

interface ExportYaml {
	profileName: string;
	mods: Array<ExportMod>;
}

export type { Profile, ModManifest, PackageVersion, ModManifestExtra, ExportYaml, ExportMod };
