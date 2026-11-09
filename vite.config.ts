import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import legacy from "@vitejs/plugin-legacy";
import { frontendQaGuard } from "./scripts/frontend-qa-guard.ts";

const srcPath = fileURLToPath(new URL("./src", import.meta.url));
const packageJson = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf-8"),
) as {
  name: string;
  version: string;
};
const appRelease = `${packageJson.name}@${packageJson.version}`;
const devAppOrigin = "http://localhost:5173";

export default defineConfig(({ mode }) => {
  const frontendQa = process.env.PERPIX_FRONTEND_QA === "1";
  const authApiTarget = frontendQa
    ? "http://127.0.0.1:9"
    : loadEnv(mode, process.cwd(), "VITE_").VITE_PERPIX_API_URL;

  return {
    envDir: frontendQa ? false : undefined,
    cacheDir: frontendQa
      ? path.resolve(process.cwd(), ".qa-cache/vite")
      : undefined,
    define: {
      __APP_RELEASE__: JSON.stringify(appRelease),
    },
    plugins: [
      react(),
      tailwindcss(),
      legacy({}),
      ...(frontendQa ? [frontendQaGuard()] : []),
    ],
    server: {
      host: "localhost",
      port: 5173,
      strictPort: true,
      proxy: frontendQa
        ? undefined
        : {
            "/api/v1/auth": {
              target: authApiTarget,
              changeOrigin: true,
              cookieDomainRewrite: "",
              configure: (proxy) => {
                const apiOrigin = new URL(authApiTarget).origin;
                proxy.on("proxyReq", (proxyRequest, request) => {
                  const requestOrigin = request.headers.origin;
                  if (requestOrigin && requestOrigin !== devAppOrigin) return;

                  if (requestOrigin === devAppOrigin) {
                    proxyRequest.setHeader("Origin", apiOrigin);
                  }

                  const referer = request.headers.referer;
                  if (!referer || !URL.canParse(referer)) return;

                  const refererUrl = new URL(referer);
                  if (refererUrl.origin !== devAppOrigin) return;

                  proxyRequest.setHeader(
                    "Referer",
                    `${apiOrigin}${refererUrl.pathname}${refererUrl.search}`,
                  );
                });
              },
            },
          },
      watch: {
        // Linux inotify limits are shared with editors and other dev servers.
        usePolling: frontendQa || process.platform === "linux",
        interval: 300,
        ignored: [
          "**/.pnpm-store/**",
          "**/node_modules/**",
          "**/.agents/**",
          "**/.codex/**",
          "**/dist/**",
          "**/playwright-report/**",
          "**/test-results/**",
          "**/.artifacts/**",
          "**/.qa-home/**",
          "**/.qa-cache/**",
          "**/node_modules.aborted-*/**",
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
  };
});
