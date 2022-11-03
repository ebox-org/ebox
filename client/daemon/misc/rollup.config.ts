import { defineConfig } from "rollup";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";

const esm = defineConfig({
	input: "src/index.ts",

	output: {
		dir: "dist/esm",
		format: "esm",
	},
	plugins: [
		typescript({
			tsconfig: "./misc/tsconfig.esm.json",
		}),
		commonjs(),
	],
});

const cjs = defineConfig({
	input: "src/index.ts",
	output: {
		dir: "dist/cjs",
		format: "cjs",
	},
	plugins: [
		typescript({
			tsconfig: "./misc/tsconfig.esm.json",
		}),
		commonjs(),
	],
});

export default [esm, cjs];
