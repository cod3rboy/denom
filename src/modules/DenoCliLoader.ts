import { PATH_SEPARATOR, isWindowsOS } from "../utils/Environment.ts";
import { download } from "download";
import { readZip } from "jszip";

const DENO_FILE_NAME = "deno-" + Deno.build.target + ".zip";
const DENO_URL = `https://github.com/denoland/deno/releases/latest/download/${DENO_FILE_NAME}`;
const DENO_VERSION_URL = `https://github.com/denoland/deno/releases/download/{version}/${DENO_FILE_NAME}`;

export const DENO_SAVE_DIR = "deno" + PATH_SEPARATOR + "bin";
export const DENO_BINARY_NAME = isWindowsOS() ? "deno.exe" : "deno";

export class DenoCliLoader {
	_downloadURL: string;
	_versionTag: string;

	constructor(version?: string) {
		if (version !== undefined) {
			this._downloadURL = DENO_VERSION_URL.replace("{version}", version);
			this._versionTag = `deno@${version}`;
		} else {
			this._versionTag = "deno@latest";
			this._downloadURL = DENO_URL;
		}
	}

	async download(savePath?: string): Promise<string> {
		try {
			// Downloading
			const downloadFile = await download(this._downloadURL, {
				dir: savePath,
				file: DENO_FILE_NAME,
				mode: 0o777,
			});
			return downloadFile.fullPath;
		} catch (err) {
			throw new Error(
				`Failed to download ${this._versionTag}! ${err.message}.`
			);
		}
	}

	async unzip(
		pathToZip: string,
		removeAfterUnzip: true,
		destinationPath?: string
	): Promise<void> {
		if (!destinationPath) {
			try {
				destinationPath = Deno.cwd();
			} catch (err) {
				destinationPath = "./";
			}
		}
		try {
			// Unzipping
			const zipFile = await readZip(pathToZip);
			await zipFile.unzip(destinationPath);
		} catch (err) {
			throw new Error(`Failed to unzip ${this._versionTag}!`);
		}
		if (removeAfterUnzip) await Deno.remove(pathToZip);
	}
}
