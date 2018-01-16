import path from "path";
import pkg from "./package.json";



export default {
	input: "src/index.ts",
	output: [
		{file: pkg["module"], format: "es", sourcemap: true},
		{file: pkg["main"], format: "cjs", sourcemap: true},
	],
	external: [
		"messagepack",
	],
	plugins: [
		require("rollup-plugin-tsc")({
			compilerOptions: {
				noUnusedLocals: true,
				declaration: true,
				declarationDir: path.dirname(pkg["types"]),
			},
		}),
	],
};
