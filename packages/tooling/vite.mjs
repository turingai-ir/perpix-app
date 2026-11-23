import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

/**
 * Shared native Vite pipeline. Storybook supplies its own React plugin.
 * @param {{ react?: boolean }} options
 */
export function createViteConfig(options = {}) {
  return defineConfig({
    plugins: [...(options.react === false ? [] : [react()]), tailwindcss()],
    build: {
      target: "baseline-widely-available",
      minify: "oxc",
      sourcemap: true,
    },
  });
}
