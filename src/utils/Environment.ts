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

export const PATH_SEPARATOR = pathSeparator;

export const isWindowsOS = () => Deno.build.os === "windows";
export const isLinuxOS = () => Deno.build.os === "linux";
export const isDarwinOS = () => Deno.build.os === "darwin";
