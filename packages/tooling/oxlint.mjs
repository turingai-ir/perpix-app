import { fileURLToPath } from "node:url";
import { defineConfig } from "oxlint";

const config = defineConfig({
  plugins: [
    "eslint",
    "typescript",
    "react",
    "jsx-a11y",
    "import",
    "unicorn",
    "oxc",
  ],
  categories: { correctness: "warn" },
  env: { browser: true, node: true, es2022: true },
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
  ],
  jsPlugins: [
    {
      name: "design",
      specifier: fileURLToPath(new URL("./design-tokens.mjs", import.meta.url)),
    },
  ],
  rules: {
    "react/rules-of-hooks": "error",
    "react/exhaustive-deps": "warn",
    "react/preserve-manual-memoization": "warn",
    "react/set-state-in-effect": "warn",
    "react/only-export-components": ["warn", { allowConstantExport: true }],
    "react/jsx-key": "error",
    "react/jsx-no-duplicate-props": "error",
    "react/no-unknown-property": "error",
    "react/react-in-jsx-scope": "off",
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/anchor-is-valid": [
      "warn",
      {
        components: ["Link"],
        specialLink: ["to"],
        aspects: ["noHref", "invalidHref", "preferButton"],
      },
    ],
    "jsx-a11y/click-events-have-key-events": "warn",
    "jsx-a11y/no-static-element-interactions": "warn",
    "jsx-a11y/label-has-associated-control": [
      "error",
      { controlComponents: ["Input"] },
    ],
    "typescript/no-explicit-any": "warn",
    "eslint/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
  },
  overrides: [
    {
      files: ["apps/app/src/**/*.tsx"],
      rules: { "design/no-raw-values": "error" },
    },
    {
      files: [
        "**/src/shared/ui/**/*.tsx",
        "**/_tests/**/*.tsx",
        "**/header-slogan.tsx",
      ],
      rules: { "design/no-raw-values": "off" },
    },
    {
      files: ["**/src/features/boot-splash/components/**/*.tsx"],
      rules: { "react/no-unknown-property": "off" },
    },
  ],
});

export default config;

export const appConfig = defineConfig({
  ...config,
  overrides: config.overrides.map((override) => ({
    ...override,
    files: override.files.map((pattern) => pattern.replace(/^apps\/app\//, "")),
  })),
});
