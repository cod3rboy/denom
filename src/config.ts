const CONFIG_OUTPUT_DIRECTORY = "output";
const CONFIG_DENOM_VERSION = "0.0.1";
const CONFIG_BINARY_NAME = "denom";
const CONFIG_PACKAGE_INFO_FILE_NAME = "denom.json";
const CONFIG_DENO_ENV = {
	DENO_DIR: "deno",
	DENO_INSTALL_ROOT: "deno/bin",
};

export function getOutputDirectory(): string {
	return CONFIG_OUTPUT_DIRECTORY;
}
export function getDenomVersion(): string {
	return CONFIG_DENOM_VERSION;
}
export function getBinaryName(): string {
	return CONFIG_BINARY_NAME;
}
export function getPackageInfoFileName(): string {
	return CONFIG_PACKAGE_INFO_FILE_NAME;
}
export function getDenoEnvDefault(): Record<string, string> {
	return <Record<string, string>>CONFIG_DENO_ENV;
}
export function getDenoDirectory(): string {
	return CONFIG_DENO_ENV.DENO_DIR;
}
