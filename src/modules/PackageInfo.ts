import { getPackageInfoFileName } from "../config.ts";

type PkgEntryValueType = "string" | "number" | "boolean";

interface PkgEntryType {
	key: string;
	type: PkgEntryValueType;
}

type PkgInfoValueType = string | boolean | number;

export const PKG_NAME: PkgEntryType = {
	key: "name",
	type: "string",
};
export const PKG_VERSION: PkgEntryType = {
	key: "version",
	type: "string",
};
export const PKG_MAIN_FILE: PkgEntryType = {
	key: "mainFile",
	type: "string",
};
export const PKG_AUTHOR: PkgEntryType = {
	key: "author",
	type: "string",
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

		if (!valueIsArray && valueType == "object") {
			// Recursively fill nested-objects
			fillPackageInfo(<Record<string, unknown>>value, mapKey);
		} else if (
			valueType == "number" ||
			valueType == "string" ||
			valueType == "boolean"
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
				default:
					throw new Error(
						`Invalid key '${mapKey}' in ${getPackageInfoFileName()}`
					);
			}
			pkgInfo.set(mapKey, <PkgInfoValueType>value);
		} else {
			const unknownType = valueIsArray ? "Array" : valueType;
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
	if (pkgInfo !== undefined) {
		return pkgInfo.get(key);
	}
}
