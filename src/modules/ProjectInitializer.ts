import { DenoCliLoader } from "./DenoCliLoader.ts";
import { getDenoDirectory } from "../config.ts";
import { Input, prompt } from "prompt";
import {
	PKG_NAME,
	PKG_VERSION,
	PKG_MAIN_FILE,
	PKG_AUTHOR,
	generatePackageFile,
	packageInfoFileExists,
	addPackageInfo,
} from "./PackageInfo.ts";
export class ProjectInitializer {
	hasInitialized(): boolean {
		// Check package file in current working directory
		// todo : also check presence of deno cli binary
		return packageInfoFileExists();
	}
	async init(): Promise<void> {
		console.log("Initializing project ...");
		// Generate package file
		const projectInfoFromConsole = await this.showPrompt();
		for (const [key, value] of projectInfoFromConsole) {
			addPackageInfo(key, value);
		}
		generatePackageFile();

		// Load Deno Cli
		const denoCliLoader = new DenoCliLoader();
		const denoCliZipPath = await denoCliLoader.download(getDenoDirectory());
		await denoCliLoader.unzip(denoCliZipPath);
		console.log("DONE!");
	}
	async showPrompt(): Promise<Map<string, unknown>> {
		// Project initialization questions
		// todo : handle empty values for fast failing

		const result = await prompt([
			{
				name: PKG_NAME.key,
				message: "Project Name",
				type: Input,
				default: "MyDenomProject",
			},
			{
				name: PKG_VERSION.key,
				message: "Version",
				type: Input,
				default: "0.0.1",
			},
			{
				name: PKG_AUTHOR.key,
				message: "Author",
				type: Input,
				default: "Unknown",
			},
			{
				name: PKG_MAIN_FILE.key,
				message: "Main entry file",
				type: Input,
				default: "main.ts",
			},
		]);
		const resultMap: Map<string, unknown> = new Map();
		const name = result[PKG_NAME.key];
		const version = result[PKG_VERSION.key];
		const author = result[PKG_AUTHOR.key];
		const mainFile = result[PKG_MAIN_FILE.key];
		if (name && version && author && mainFile) {
			resultMap.set(PKG_NAME.key, name);
			resultMap.set(PKG_VERSION.key, version);
			resultMap.set(PKG_AUTHOR.key, author);
			resultMap.set(PKG_MAIN_FILE.key, mainFile);
			return resultMap;
		} else {
			throw new Error(`Failed to initialize denom project!`);
		}
	}
}
