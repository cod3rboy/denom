import { download } from "download";
import { readZip } from "jszip";
import * as path from "path/mod.ts";
import * as fs from "fs/mod.ts";

const DENO_FILE_NAME = "deno-" + Deno.build.target + ".zip";
const DENO_URL = `https://github.com/denoland/deno/releases/latest/download/${DENO_FILE_NAME}`;
const DENO_VERSION_URL = `https://github.com/denoland/deno/releases/download/{version}/${DENO_FILE_NAME}`;
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

	async download(saveDir: string): Promise<string> {
		try {
			if (!fs.existsSync(saveDir))
				Deno.mkdirSync(saveDir, { recursive: true });
			// Downloading
			const downloadFile = await download(this._downloadURL, {
				dir: saveDir,
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
		removeAfterUnzip = true,
		destinationDir?: string
	): Promise<void> {
		try {
			if (!destinationDir) {
				destinationDir = path.dirname(pathToZip);
			}
			if (!fs.existsSync(destinationDir)) Deno.mkdirSync(destinationDir);
			// Unzipping
			const zipFile = await readZip(pathToZip);
			await zipFile.unzip(destinationDir);
		} catch (err) {
			throw new Error(
				`Failed to unzip ${this._versionTag}! ${err.message}`
			);
		}
		if (removeAfterUnzip) await Deno.remove(pathToZip);
	}
}
