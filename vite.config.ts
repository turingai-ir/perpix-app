import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

import { VitePWA } from "vite-plugin-pwa";

const srcPath = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "script-defer",
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
        name: "PerPixAi",
        short_name: "PerPixAi",
        description: "PerPixAi app",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
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
  ],
  server: {
    watch: {
      ignored: [".pnpm-store"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(srcPath),
    },
  },
}));
