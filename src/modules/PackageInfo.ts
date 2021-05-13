import { getPackageFileName } from "../config.ts";
import * as fs from "fs/mod.ts";
import { isStringArray } from "../utils/Utilities.ts";

interface ScriptDetail {
	name: string;
	path: string;
	args: string[];
	denoOptions: string[];
}
type PkgEntryValueType =
	| "string"
	| "number"
	| "boolean"
	| "string[]"
	| "object[]";

interface PkgEntryType {
	key: string;
	type: PkgEntryValueType;
}

type PkgEntryTypeWithDefault = PkgEntryType & {
	default: PkgInfoValueType;
};

type PkgInfoValueType = string | boolean | number | string[] | ScriptDetail[];

export const PKG_NAME: PkgEntryType = {
	key: "name",
	type: "string",
};
export const PKG_VERSION: PkgEntryType = {
	key: "version",
	type: "string",
};
export const PKG_MAIN_FILE: PkgEntryTypeWithDefault = {
	key: "main.entry",
	type: "string",
	default: "main.ts",
};
export const PKG_MAIN_ARGS: PkgEntryType = {
	key: "main.args",
	type: "string[]",
};

export const PKG_MAIN_DENO_OPTS: PkgEntryType = {
	key: "main.denoOptions",
	type: "string[]",
};
export const PKG_AUTHOR: PkgEntryType = {
	key: "author",
	type: "string",
};
export const PKG_DENO_VERSION: PkgEntryType = {
	key: "deno.version",
	type: "string",
};

export const PKG_SCRIPTS: PkgEntryType = {
	key: "scripts",
	type: "object[]",
};

const pkgInfo: Map<string, PkgInfoValueType> = new Map();

function fillPackageInfo(
	pkgJsonObj: Record<string, unknown>,
	prefixKey?: string
) {
	let prefix = "";
	if (prefixKey !== undefined) prefix = prefixKey;
	for (const key in pkgJsonObj) {
		const value = pkgJsonObj[key];
		const mapKey = `${prefix}.${key}`;
		const valueType = typeof value;
		const valueIsArray = Array.isArray(value);
		const valueIsStringArray = isStringArray(value);

		if (!valueIsArray && valueType == "object") {
			// Recursively fill nested-objects
			fillPackageInfo(<Record<string, unknown>>value, mapKey);
		} else if (
			valueType == "number" ||
			valueType == "string" ||
			valueType == "boolean" ||
			valueIsStringArray
		) {
			// Validate the key and its value type before setting it in map
			switch (mapKey) {
				case PKG_NAME.key:
					if (valueType !== PKG_NAME.type)
						throw new Error(
							`Expected '${PKG_NAME.type}' value for key '${mapKey}' but got '${valueType}' value`
						);
					break;
				case PKG_VERSION.key:
					if (valueType !== PKG_VERSION.type)
						throw new Error(
							`Expected '${PKG_VERSION.type}' value for key '${mapKey}' but got '${valueType}' value`
						);
					break;
				case PKG_MAIN_FILE.key:
					if (valueType !== PKG_MAIN_FILE.type)
						throw new Error(
							`Expected '${PKG_MAIN_FILE.type}' value for key '${mapKey}' but got '${valueType}' value`
						);
					break;
				case PKG_AUTHOR.key:
					if (valueType !== PKG_AUTHOR.type)
						throw new Error(
							`Expected '${PKG_AUTHOR.type}' value for key '${mapKey}' but got '${valueType}' value`
						);
					break;
				case PKG_MAIN_ARGS.key:
					if (!valueIsArray && !valueIsStringArray)
						throw new Error(
							`Expected '${PKG_MAIN_ARGS.type}' value for key '${mapKey}' but got '${valueType}' value`
						);
					else if (valueIsArray && !valueIsStringArray)
						throw new Error(
							`Expected '${PKG_MAIN_ARGS.type}' value for key '${mapKey}' but got 'Unknown Array' value`
						);
					break;
				case PKG_MAIN_DENO_OPTS.key:
					if (!valueIsArray && !valueIsStringArray)
						throw new Error(
							`Expected '${PKG_MAIN_DENO_OPTS.type}' value for key '${mapKey}' but got '${valueType}' value`
						);
					else if (valueIsArray && !valueIsStringArray)
						throw new Error(
							`Expected '${PKG_MAIN_DENO_OPTS.type}' value for key '${mapKey}' but got 'Unknown Array' value`
						);
					break;
				default:
					throw new Error(
						`Invalid key '${mapKey}' in ${getPackageInfoFileName()}`
					);
			}
			pkgInfo.set(mapKey, <PkgInfoValueType>value);
		} else {
			if (
				valueIsArray &&
				!valueIsStringArray &&
				PKG_SCRIPTS.key === mapKey
			) {
				// Array of ScriptDetail Objects
				const scripts: ScriptDetail[] = [];
				for (const s of <unknown[]>value) {
					const typeName = typeof s;
					if (!Array.isArray(s) && typeName === "object") {
						const detail = <ScriptDetail>s;
						if (detail.name === undefined) {
							throw new Error(
								`Missing 'name' property in script entry at key '${mapKey}'`
							);
						}
						if (detail.path === undefined) {
							throw new Error(
								`Missing 'path' property in script entry at key '${mapKey}'`
							);
						}
						if (typeof detail.name !== "string") {
							throw new Error(
								`'name' property must be a 'string' in script entry at key '${mapKey}'`
							);
						}
						if (typeof detail.path !== "string") {
							throw new Error(
								`'path' property must be a 'string' in script entry '${detail.name}' at key '${mapKey}`
							);
						}
						if (
							detail.args !== undefined &&
							!isStringArray(detail.args)
						) {
							throw new Error(
								`'args' property must be a 'string' array in script entry '${detail.name}' at key '${mapKey}'`
							);
						}
						if (
							detail.denoOptions !== undefined &&
							!isStringArray(detail.denoOptions)
						) {
							throw new Error(
								`'denoOptions' property must be a 'string' array in script entry '${detail.name}' at key '${mapKey}'`
							);
						}
						const scriptDetail: ScriptDetail = {
							name: detail.name,
							path: detail.path,
							args: detail.args ?? [],
							denoOptions: detail.denoOptions ?? [],
						};
						scripts.push(scriptDetail);
					} else {
						// Wrong value type
						throw new Error(
							`Expected array elements of type 'object' for key '${mapKey}' but got elements of type '${typeName}'`
						);
					}
				}
				pkgInfo.set(mapKey, scripts);
				return;
			}
			const unknownType = valueIsArray ? "Unknown Array" : valueType;
			throw new Error(
				`Unsupported value type '${unknownType}' found for key '${mapKey}' in ${getPackageInfoFileName()}`
			);
		}
	}
}

export async function loadPackage(packageInfoFilePath: string) {
	const pkgJsonString = await Deno.readTextFile(packageInfoFilePath);
	const pkgJson = <Record<string, unknown>>JSON.parse(pkgJsonString);
	fillPackageInfo(pkgJson);
}

export function getPackageInfo(key: string): PkgInfoValueType | undefined {
	return pkgInfo.get(key);
}

export function getScriptDetail(scriptName: string): ScriptDetail | undefined {
	let scripts = getPackageInfo(PKG_SCRIPTS.key);
	scripts = <ScriptDetail[]>scripts ?? [];
	for (const script of scripts) {
		if (script.name === scriptName) return script;
	}
}

export function addPackageInfo(key: string, value: unknown): boolean {
	// todo : validate key also
	if (
		typeof value === "string" ||
		typeof value === "number" ||
		typeof value === "boolean" ||
		isStringArray(value)
	) {
		pkgInfo.set(key, <PkgInfoValueType>value);
		return true;
	}
	return false;
}

function serializePackageInfo(dotNesting = true): string {
	const objToSerialize: Record<string, PkgInfoValueType> = {};
	for (const [key, value] of pkgInfo) {
		const keys: string[] = key.split(".");
		if (keys.length === 1 || !dotNesting) {
			objToSerialize[key] = value;
			continue;
		}
		// Handle dotted keys for nesting
		let nestedTarget: Record<string, unknown> = objToSerialize;
		let i = 0;
		while (i < keys.length - 1) {
			nestedTarget[keys[i]] = {};
			nestedTarget = <Record<string, unknown>>nestedTarget[keys[i]];
			i++;
		}
		nestedTarget[keys[i]] = value;
	}
	return JSON.stringify(objToSerialize);
}

export function generatePackageFile(): void {
	const serializedInfo = serializePackageInfo();
	const packageFile = getPackageInfoFileName();
	Deno.writeTextFileSync(packageFile, serializedInfo);
}

export function packageInfoFileExists(): boolean {
	return fs.existsSync(getPackageInfoFileName());
}

export function getPackageInfoFileName(): string {
	return getPackageFileName();
}
