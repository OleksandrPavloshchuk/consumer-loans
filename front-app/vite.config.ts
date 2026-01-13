import fs from "fs";
import https from "https";
import {defineConfig} from "vite";

const agent = new https.Agent({
    ca: fs.readFileSync("/home/oleksandr/.local/share/mkcert/rootCA.pem", "utf-8"),
});

export default defineConfig({
    server: {
        https: {
            key: fs.readFileSync("./certs/localhost-key.pem"),
            cert: fs.readFileSync("./certs/localhost.pem"),
        },
        proxy: {
            "/engine-rest": {
                target: "https://localhost:9091",
                changeOrigin: true,
                secure: true,
                agent
            },
        },
    },
});
