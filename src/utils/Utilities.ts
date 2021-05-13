import { PATH_SEPARATOR } from "./Environment.ts";
export function isStringArray(array: unknown[] | unknown): boolean {
	if (!Array.isArray(array)) return false;
	for (const item of array) {
		if (typeof item !== "string") return false;
	}
	return true;
}

export function prependCwdToPath(path: string) {
	return `${Deno.cwd()}${PATH_SEPARATOR}${path}`;
}
