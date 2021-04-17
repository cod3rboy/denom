import { getDenoEnvDefault } from "../config.ts";

// Determine the path separator of host operating system
let pathSeparator = "";
switch (Deno.build.os) {
	case "linux":
	case "darwin":
		pathSeparator = "/";
		break;
	case "windows":
		pathSeparator = "\\";
		break;
	default:
		throw Error("Unexpected platform : " + Deno.build.os);
}
export const isWindowsOS = () => Deno.build.os === "windows";
export const isLinuxOS = () => Deno.build.os === "linux";
export const isDarwinOS = () => Deno.build.os === "darwin";

export function getBuildTarget(): string {
	return Deno.build.target;
}

export const PATH_SEPARATOR = pathSeparator;
export const DENO_BINARY_NAME = isWindowsOS() ? "deno.exe" : "deno";

// Load map of Deno Environment Variables and their values
const denoEnvMap: Map<string, string> = new Map();
// todo: also add custom environment variables from package info to this map
// Set default environment variables. This overrides any custom environment variables set in package info.
const defaultDenoEnv = getDenoEnvDefault();
for (const key in defaultDenoEnv) denoEnvMap.set(key, defaultDenoEnv[key]);

interface EnvironmentVariableMapping {
	[variableName: string]: string;
}
export function getEnvironmentVariablesForDeno(): EnvironmentVariableMapping {
	const map: EnvironmentVariableMapping = {};
	for (const [key, value] of denoEnvMap.entries()) {
		map[key] = value;
	}
	return map;
}

export function getEnvironmentVariableForDeno(key: string): string | undefined {
	return denoEnvMap.get(key);
}
