import { ProjectInitializer } from "./ProjectInitializer.ts";
import { getVersionInfo } from "../utils/BuildInfo.ts";
import { prependCwdToPath } from "../utils/Utilities.ts";
import { Confirm } from "prompt";
import { lazer } from "lazer";
import { exists } from "fs/mod.ts";
import { execute } from "./ScriptExecutor.ts";
import {
	getPackageInfoFileName,
	getPackageInfo,
	getScriptDetail,
	PKG_SCRIPTS,
	PKG_MAIN_FILE,
	PKG_MAIN_ARGS,
	PKG_MAIN_DENO_OPTS,
} from "./PackageInfo.ts";

// Commands and aliases mapping
const commands = {
	run: ["--run", "-r"],
	update: ["--update", "-u"],
	version: ["--version", "-v"],
	help: ["--help", "-h"],
};

const SCRIPT_SYMBOL_PREFIX = "$";

/**
 * Interprets the command line arguments and invokes target action
 *
 * @param args List of command line arguments
 */
export async function processArgs(args: string[]): Promise<void> {
	if (args.length === 0) {
		// No command
		// Initializes New Project
		lazer().print_green_ln("Initializing project ...");
		const initializer = new ProjectInitializer();
		let shouldInitialize = true;
		if (initializer.hasInitialized()) {
			// Already initialized
			// Take user confirmation before re-initializing
			shouldInitialize = await Confirm.prompt(
				"Project already initialized. Do you want to initialize again ?"
			);
		}
		if (shouldInitialize) await initializer.init();
	} else if (commands.run.includes(args[0])) {
		// `--run` command
		const isScript: boolean =
			args[1] !== undefined && args[1].startsWith(SCRIPT_SYMBOL_PREFIX);
		if (isScript) {
			// Execute script
			const scriptName = args[1].substring(1);
			const scriptDetail = getScriptDetail(scriptName);
			if (scriptDetail === undefined) {
				// Script not found
				throw new Error(
					`Script entry with name '${scriptName}' does not exist in ${getPackageInfoFileName()} at key ${
						PKG_SCRIPTS.key
					}`
				);
			}
			// Make sure script file exists
			if (!(await exists(prependCwdToPath(scriptDetail.path)))) {
				throw new Error(
					`Script file '${
						scriptDetail.path
					}' does not exist for script entry name '${
						scriptDetail.name
					}' found in ${getPackageInfoFileName()}`
				);
			}
			// Get cli arguments for the script
			const cliArgs = args.length > 2 ? args.slice(2) : [];
			// Execute script
			await execute(
				scriptDetail.path,
				cliArgs.concat(scriptDetail.args),
				scriptDetail.denoOptions
			);
		} else {
			// Execute main file
			const mainFile =
				<string>getPackageInfo(PKG_MAIN_FILE.key) ??
				PKG_MAIN_FILE.default;
			// Make sure main file exists
			if (!(await exists(prependCwdToPath(mainFile)))) {
				// No execution entry point
				throw new Error(
					`Cannot find execution entry point : ${mainFile}`
				);
			}
			// Get arguments and deno options for main file
			const cliArgs = args.length > 1 ? args.slice(1) : [];
			const pkgArgs = <string[]>getPackageInfo(PKG_MAIN_ARGS.key) ?? [];
			const mainDenoOpts =
				<string[]>getPackageInfo(PKG_MAIN_DENO_OPTS.key) ?? [];
			// Execute main file
			await execute(mainFile, cliArgs.concat(pkgArgs), mainDenoOpts);
		}
	} else if (commands.update.includes(args[0])) {
		// `update` command
	} else if (commands.version.includes(args[0])) {
		// `version` command
		console.log(getVersionInfo());
	} else if (commands.help.includes(args[0])) {
		// `help` command
	} else {
		// Unknown command
		throw new Error(`Unknown command : ${args[0]}`);
	}
}
