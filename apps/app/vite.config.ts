import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, loadEnv, mergeConfig, type UserConfig } from "vite";
import { createViteConfig } from "@perpix/tooling/vite";
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

  return mergeConfig(createViteConfig(), {
    envDir: frontendQa ? false : undefined,
    cacheDir: frontendQa
      ? path.resolve(process.cwd(), ".qa-cache/vite")
      : undefined,
    define: {
      __APP_RELEASE__: JSON.stringify(appRelease),
    },
    plugins: frontendQa ? [frontendQaGuard()] : [],
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
                // Cache the React runtime separately.
                name: "react-vendor",
                test: /node_modules[\\/]react(?:-dom|-router)?[\\/]/,
                priority: 30,
              },
              {
                name: "ui-vendor",
                test: /node_modules[\\/](?:@base-ui|@radix-ui|motion|framer-motion|motion-dom|lucide-react|vaul)[\\/]/,
                priority: 25,
              },
              {
                name: "framework-vendor",
                test: /node_modules[\\/](?:@tanstack|jotai|jotai-immer|immer|i18next|react-i18next|dayjs|jalali-plugin-dayjs)[\\/]/,
                priority: 20,
              },
              {
                name: "locale-fa",
                test: /[\\/]locales[\\/]fa\.json$/,
                priority: 20,
              },
              {
                name: "app-shell",
                test: /[\\/]src[\\/]features[\\/]app-layout[\\/]/,
                priority: 15,
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
  } satisfies UserConfig);
});
