import { defineConfig } from "rollup";
// import typescript from "rollup-plugin-typescript2";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";

const commonjsPlugin = commonjs({});

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
		commonjsPlugin,
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
			tsconfig: "./misc/tsconfig.cjs.json",
		}),
		commonjsPlugin,
	],
});

export default [esm, cjs];
