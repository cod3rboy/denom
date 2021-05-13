import {
	getDenoBinaryPath,
	getEnvironmentVariablesForDeno,
} from "../utils/Environment.ts";

const COMMAND_DENO_RUN = "run";

// TODO fix error : Access is denied. (os error 5)
export async function execute(
	scriptPath: string,
	scriptArgs?: string[],
	denoOpts?: string[]
): Promise<void> {
	let cmdArgs: string[] = [];
	cmdArgs.push(getDenoBinaryPath()); // Path to deno binary
	cmdArgs.push(COMMAND_DENO_RUN); // Run command
	if (denoOpts !== undefined) cmdArgs = cmdArgs.concat(denoOpts); // Deno command options
	cmdArgs.push(scriptPath); // Path to script to execute
	if (scriptArgs !== undefined) cmdArgs = cmdArgs.concat(scriptArgs); // Script arguments

	// Environment variables mapping
	const envMapping = getEnvironmentVariablesForDeno();

	// TODO remove this DEBUG LINE
	console.log("Executing command : " + cmdArgs.join(" "));

	// Pass env for deno environment variables
	const scriptProcess = Deno.run({
		cmd: cmdArgs,
		// Add environment variable mapping object
		env: envMapping,
		cwd: Deno.cwd(),
		stderr: "piped",
		stdout: "piped",
	});
	const { code } = await scriptProcess.status();
	const scriptRawOutput = await scriptProcess.output();
	const scriptRawError = await scriptProcess.stderrOutput();

	if (code === 0) {
		await Deno.stdout.write(scriptRawOutput);
	} else {
		const errorString = new TextDecoder().decode(scriptRawError);
		console.log(errorString);
	}
}
