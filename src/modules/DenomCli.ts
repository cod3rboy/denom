import { getVersionInfo } from "../utils/BuildInfo.ts";
// Commands and aliases mapping
const commands = {
	run: ["run", "-r"],
	update: ["update", "-u"],
	version: ["--version", "-v"],
	help: ["--help", "-h"],
};

/**
 * Interprets the command line arguments and invokes target action
 *
 * @param args List of command line arguments
 */
export function processArgs(args: string[]): void {
	if (args.length === 0) {
		// No command
	} else if (commands.run.includes(args[0])) {
		// `run` command
	} else if (commands.update.includes(args[0])) {
		// `update` command
	} else if (commands.version.includes(args[0])) {
		// `version` command
		console.log(getVersionInfo());
	} else if (commands.help.includes(args[0])) {
		// `help` command
	} else {
		// Unknown command
	}
}
