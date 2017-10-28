import lib from "./rollup.lib.js";



export default {
	input: "src/tests.ts",
	output: {
		file: "build/tests.js",
		format: "cjs",
	},
	external: lib.external.concat(["testsome"]),
	plugins: [
		require("rollup-plugin-tsc")({
			compilerOptions: {
				noUnusedLocals: true,
			},
		}),
	],
};
