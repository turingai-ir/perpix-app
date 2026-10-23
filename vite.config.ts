import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import legacy from "@vitejs/plugin-legacy";

const srcPath = fileURLToPath(new URL("./src", import.meta.url));
const packageJson = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf-8"),
) as {
  name: string;
  version: string;
};
const appRelease = `${packageJson.name}@${packageJson.version}`;

export default defineConfig(({ mode }) => ({
  define: {
    __APP_RELEASE__: JSON.stringify(appRelease),
  },
  plugins: [react(), tailwindcss(), legacy({})],
  server: {
    host: "localhost",
    port: 5173,
    strictPort: true,
    proxy: {
      "/api/v1/auth": {
        target: loadEnv(mode, process.cwd(), "VITE_").VITE_PERPIX_API_URL,
        changeOrigin: true,
        cookieDomainRewrite: "",
      },
    },
    watch: {
      // Linux inotify limits are shared with editors and other dev servers.
      usePolling: process.platform === "linux",
      interval: 300,
      ignored: [
        "**/.pnpm-store/**",
        "**/node_modules/**",
        "**/.agents/**",
        "**/.codex/**",
        "**/dist/**",
        "**/playwright-report/**",
        "**/test-results/**",
      ],
    },
  },
  preview: {
    host: "localhost",
    port: 5173,
    strictPort: true,
  },
  build: {
    sourcemap: true,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              // Cache the React runtime separately and keep legacy entries within budget.
              name: "react-vendor",
              test: /node_modules[\\/]react(?:-dom|-router)?[\\/]/,
              priority: 20,
            },
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(srcPath),
    },
  },
}));
