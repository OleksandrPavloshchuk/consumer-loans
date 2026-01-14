import fs from "fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env.development") });

const SERVER_PORT = process.env.VITE_SERVER_PORT
    ? Number(process.env.VITE_SERVER_PORT)
    : 5174;
const BACKEND_URL = process.env.VITE_BACKEND_URL || "https://localhost:9091";

const HTTPS_CONFIG = {
    key: fs.existsSync(process.env.VITE_SSL_KEY_PATH || "")
        ? fs.readFileSync(process.env.VITE_SSL_KEY_PATH!)
        : undefined,
    cert: fs.existsSync(process.env.VITE_SSL_CERT_PATH || "")
        ? fs.readFileSync(process.env.VITE_SSL_CERT_PATH!)
        : undefined,
};

export default defineConfig({
    plugins: [react()],
    server: {
        port: SERVER_PORT,
        https: HTTPS_CONFIG,
        proxy: {
            "/engine-rest": {
                target: BACKEND_URL,
                changeOrigin: true,
                secure: true
            },
        },
    },
});
