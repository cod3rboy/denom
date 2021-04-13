import coffee from "coffee";

const CONFIG_KEY_OUTPUT_DIRECTORY = "outputDirectory";

export function getOutputDirectory() {
	return coffee.get(CONFIG_KEY_OUTPUT_DIRECTORY).string();
}
