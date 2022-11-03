import { defineConfig } from "vite";
import { resolve } from "path";
import tsconfigPaths from "vite-tsconfig-paths";

import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [tsconfigPaths(), react()],
	root: resolve(__dirname, "../src"),
	envDir: resolve(__dirname, "../env"),
	resolve: {
		alias: {
			"@ebox/daemon": resolve(__dirname, "../../daemon/src"),
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
				target: "http://ebox.com:8000",
				changeOrigin: true,
				// rewrite: (path) => path.replace(/^\/file/, ""),
			},
			"^/graphql-router/.*": {
				target: "http://ebox.com:8000",
				changeOrigin: true,
				// rewrite: (path) => path.replace(/^\/file/, ""),
			},
		},
	},
});
