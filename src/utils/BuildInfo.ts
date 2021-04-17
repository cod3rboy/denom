import { getDenomVersion, getBinaryName } from "../config.ts";
import { getBuildTarget } from "./Environment.ts";

export function getVersionInfo(): string {
	return `${getBinaryName()}-${getBuildTarget()}\nversion@${getDenomVersion()}`;
}
