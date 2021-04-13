import { Hash } from "checksum";

export function fileCheckSumMd5(filePath: string): string {
	const fileBytes = Deno.readFileSync(filePath);
	const hash = new Hash("md5");
	return hash.digest(fileBytes).hex();
}
