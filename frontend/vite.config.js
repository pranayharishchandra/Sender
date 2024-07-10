import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		proxy: {
			"/api": { // if proxy after url, it will prefix it to localhost:5001
				target: "http://localhost:5001",
			},
		},
	},
});
