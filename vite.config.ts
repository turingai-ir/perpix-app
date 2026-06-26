import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";

import { VitePWA } from "vite-plugin-pwa";

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
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: [
        "apple-touch-icon.png",
        "favicon.ico",
        "favicon-16x16.png",
        "favicon-32x32.png",
        "fonts/vazirmatn/Vazirmatn-Black.woff2",
        "fonts/vazirmatn/Vazirmatn-Bold.woff2",
        "fonts/vazirmatn/Vazirmatn-ExtraBold.woff2",
        "fonts/vazirmatn/Vazirmatn-ExtraLight.woff2",
        "fonts/vazirmatn/Vazirmatn-Light.woff2",
        "fonts/vazirmatn/Vazirmatn-Medium.woff2",
        "fonts/vazirmatn/Vazirmatn-Regular.woff2",
        "fonts/vazirmatn/Vazirmatn-SemiBold.woff2",
        "fonts/vazirmatn/Vazirmatn-Thin.woff2",
      ],
      manifest: {
        id: "/",
        name: "PerPix AI",
        short_name: "PerPixAi",
        description: "PerPixAi app",
        start_url: "/",
        scope: "/",
        lang: "fa",
        dir: "rtl",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        screenshots: [
          {
            src: "screenshots/pwa-wide.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide",
            label: "PerPixAi desktop workspace",
          },
          {
            src: "screenshots/pwa-mobile.png",
            sizes: "540x720",
            type: "image/png",
            label: "PerPixAi mobile workspace",
          },
        ],
        icons: [
          {
            src: "android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      devOptions: {
        enabled: mode !== "production",
      },
    }),
    legacy({}),
  ],
  server: {
    watch: {
      ignored: ["**/.pnpm-store/**", "**/node_modules/**"],
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
}));
