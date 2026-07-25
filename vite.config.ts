import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";

const srcPath = fileURLToPath(new URL("./src", import.meta.url));
const packageJson = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf-8"),
) as {
  name: string;
  version: string;
};
const appRelease = `${packageJson.name}@${packageJson.version}`;

export default defineConfig({
  define: {
    __APP_RELEASE__: JSON.stringify(appRelease),
  },
  plugins: [react(), tailwindcss(), legacy({})],
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
});
