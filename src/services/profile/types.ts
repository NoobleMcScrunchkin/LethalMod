interface Profile {
	uuid: string;
	name: string;
	mods: Array<ModManifest>;
	path: string;
}

interface ModManifest {
	namespace: string;
	name: string;
	description: string;
	version_number: string;
	dependencies: Array<string>;
	website_url: string;
	full_name: string;
	icon: string;
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

export type { Profile, ModManifest, PackageVersion };
