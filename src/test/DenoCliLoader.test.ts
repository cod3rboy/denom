import {
	DENO_SAVE_DIR,
	DenoCliLoader,
	DENO_BINARY_NAME,
} from "../modules/DenoCliLoader.ts";
import { fileCheckSumMd5 } from "../utils/CheckSum.ts";
import { assertEquals, assertNotEquals } from "testing/asserts.ts";
import * as fs from "fs/mod.ts";
import { PATH_SEPARATOR } from "../utils/Environment.ts";
import { getOutputDirectory } from "../config.ts";

function getDenoSaveDirectory(): string {
	return `${Deno.cwd()}${PATH_SEPARATOR}${getOutputDirectory()}${PATH_SEPARATOR}${DENO_SAVE_DIR}`;
}

Deno.test({
	name: `Download deno cli into project for first time`,
	async fn(): Promise<void> {
		const SAVE_PATH = getDenoSaveDirectory();
		// Delete save directory if already exists
		if (await fs.exists(SAVE_PATH)) {
			await Deno.remove(SAVE_PATH, { recursive: true });
		}
		await Deno.mkdir(SAVE_PATH, { recursive: true });
		const cliLoader = new DenoCliLoader();
		const cliZipPath = await cliLoader.download(SAVE_PATH);
		assertEquals(
			await fs.exists(cliZipPath),
			true,
			"Path does not exist for downloaded Deno cli zip file"
		);
		await cliLoader.unzip(cliZipPath, true, SAVE_PATH);
		assertNotEquals(await fs.exists(cliZipPath), true);

		const denoBinaryPath = SAVE_PATH + PATH_SEPARATOR + DENO_BINARY_NAME;
		assertEquals(
			await fs.exists(denoBinaryPath),
			true,
			"Deno binary file was not extracted from downloaded zip"
		);
		// Remove Binary file
		await Deno.remove(SAVE_PATH, { recursive: true });
	},
});

Deno.test({
	name: `Overwriting existing deno cli into project`,
	async fn(): Promise<void> {
		// Mock deno binary in the project
		const SAVE_PATH = getDenoSaveDirectory();
		const denoBinaryPath = SAVE_PATH + PATH_SEPARATOR + DENO_BINARY_NAME;
		// Remove any existing Deno Cli before mocking it.
		await fs.emptyDir(SAVE_PATH);
		await fs.ensureFile(denoBinaryPath);
		assertEquals(
			await fs.exists(denoBinaryPath),
			true,
			"Failed to mock deno binary in the project!"
		);
		// Calculate hash of mocked binary
		const mockHash: string = fileCheckSumMd5(denoBinaryPath);
		// Overwriting mocked deno binary
		const cliLoader = new DenoCliLoader();
		const cliZipPath = await cliLoader.download(SAVE_PATH);
		assertEquals(
			await fs.exists(cliZipPath),
			true,
			"Path does not exist for downloaded Deno cli zip file"
		);
		await cliLoader.unzip(cliZipPath, true, SAVE_PATH);
		assertNotEquals(await fs.exists(cliZipPath), true);
		assertEquals(
			await fs.exists(denoBinaryPath),
			true,
			"Deno binary file was not extracted from downloaded zip"
		);
		// Calculate hash of extracted binary
		const extractedFileHash = fileCheckSumMd5(denoBinaryPath);
		// Compare the hashes of deno binary and its mock file to ensure that binary is overwritten after extraction from zip file.
		assertNotEquals(
			extractedFileHash,
			mockHash,
			"Mocked deno binary is not overwritten"
		);
		// Remove Binary file
		await Deno.remove(SAVE_PATH, { recursive: true });
	},
});
