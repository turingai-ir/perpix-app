import { fileURLToPath } from "node:url";
import { defineConfig } from "oxfmt";

export default defineConfig({
  singleQuote: false,
  printWidth: 80,
  trailingComma: "all",
  tabWidth: 2,
  sortPackageJson: false,
  sortTailwindcss: {
    stylesheet: fileURLToPath(
      new URL("../ui/src/styles/globals.css", import.meta.url),
    ),
    functions: ["cn", "clsx", "cva"],
  },
  ignorePatterns: [
    "**/node_modules/**",
    "**/dist/**",
    "**/dev-dist/**",
    "**/build/**",
    "**/.vite/**",
    "**/.turbo/**",
    "**/coverage/**",
    "**/.agents/**",
    "**/.kilo/**",
    "**/.impeccable/**",
    "**/.codex/**",
    "**/.claude/**",
    "**/.artifacts/**",
    "**/graphify-out/**",
    "**/playwright-report/**",
    "**/test-results/**",
    "**/blob-report/**",
    "**/scripts/generate-api/_output/**",
    "**/src/shared/api/api.ts",
    "**/src/services/api/api.ts",
    "**/docs/**",
    "**/AGENTS.md",
    "**/src/shared/i18n/locales/**",
    "**/pnpm-lock.yaml",
    "**/skills-lock.json",
  ],
});
