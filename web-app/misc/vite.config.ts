import { defineConfig } from "vite";
import { resolve } from "path";

import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	root: resolve(__dirname, "../src"),
	envDir: resolve(__dirname, "../env"),
	resolve: {
		alias: {
			"@ebox/daemon": resolve(__dirname, "../src/daemon"),
		},
	},
	build: {
		outDir: resolve(__dirname, "../dist"),
		emptyOutDir: true,
	},
	server: {
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
		},
	},
});
