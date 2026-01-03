import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/engine-rest": {
                target: "http://localhost:9091",
                changeOrigin: true
            },
        },
    },
    resolve: {
        dedupe: ["react", "react-dom"]
    }
});
