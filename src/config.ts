import coffee from "coffee";

const CONFIG_KEY_OUTPUT_DIRECTORY = "outputDirectory";
const CONFIG_KEY_DENOM_VERSION = "denomVersion";
const CONFIG_KEY_BINARY_NAME = "binaryName";
const CONFIG_KEY_PACKAGE_INFO_FILE_NAME = "packageInfoFileName";
const CONFIG_KEY_DENO_ENV = "deno.env";
const CONFIG_KEY_DENO_DIR = "deno.env.DENO_DIR";

const CONFIG_DEFAULT_DENO_DIR = "deno";

export function getOutputDirectory(): string {
	return coffee.get(CONFIG_KEY_OUTPUT_DIRECTORY).string();
}
export function getDenomVersion(): string {
	return coffee.get(CONFIG_KEY_DENOM_VERSION).string();
}
export function getBinaryName(): string {
	return coffee.get(CONFIG_KEY_BINARY_NAME).string();
}
export function getPackageInfoFileName(): string {
	return coffee.get(CONFIG_KEY_PACKAGE_INFO_FILE_NAME).string();
}
export function getDenoEnvDefault(): Record<string, string> {
	return <Record<string, string>>coffee.get(CONFIG_KEY_DENO_ENV).value;
}

export function getDenoDirectory(): string {
	if (coffee.has(CONFIG_KEY_DENO_DIR)) {
		return coffee.get(CONFIG_KEY_DENO_DIR).string();
	}
	return CONFIG_DEFAULT_DENO_DIR;
}
