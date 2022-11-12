import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import nodeResolve from "@rollup/plugin-node-resolve";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
	const EnvDir = resolve(__dirname, "../env");

	const env = loadEnv(mode, EnvDir);

	return {
		plugins: [tsconfigPaths(), react()],
		root: resolve(__dirname, "../src"),
		envDir: EnvDir,

		resolve: {
			alias: {
				// "@ebox/daemon": resolve(__dirname, "../../daemon/dist/esm/index.js"),
			},
		},
		build: {
			outDir: resolve(__dirname, "../dist"),
			emptyOutDir: true,
		},
		server: {
			origin: "http://localhost:5173",
			cors: {
				origin: "*",
				preflightContinue: true,
			},
			proxy: {
				"^/file/.*": {
					target: env.VITE_API,
					changeOrigin: true,
					// rewrite: (path) => path.replace(/^\/file/, ""),
				},
				"^/graphql-router/?.*": {
					target: env.VITE_API,
					changeOrigin: true,
					// rewrite: (path) => path.replace(/^\/file/, ""),
				},
			},
		},
	};
});
