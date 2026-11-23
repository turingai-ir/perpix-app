import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, mergeConfig } from "vite";
import { createViteConfig } from "@perpix/tooling/vite";

const srcPath = fileURLToPath(new URL("./src", import.meta.url));
const packageJson = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf-8"),
) as {
  name: string;
  version: string;
};
const appRelease = `${packageJson.name}@${packageJson.version}`;

export default defineConfig(
  mergeConfig(createViteConfig(), {
    define: {
      __APP_RELEASE__: JSON.stringify(appRelease),
    },
    server: {
      port: 5175,
      watch: {
        usePolling: process.platform === "linux",
        interval: 300,
        ignored: [
          "**/.pnpm-store/**",
          "**/node_modules/**",
          "**/.agents/**",
          "**/.codex/**",
          "**/dist/**",
        ],
      },
    },
    build: {
      sourcemap: true,
    },
    resolve: {
      alias: {
        "@": path.resolve(srcPath),
      },
    },
  }),
);
