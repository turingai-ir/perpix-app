import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import mantine from "eslint-config-mantine";

export default tseslint.config(
  {
    ignores: [
      "dist",
      "dev-dist",
      "build",
      ".vite",
      "eslint.config.js",
      "tailwind.config.js",
      "scripts/generate-api/_output/**",
    ],
  },
  ...mantine,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin,
      "unused-imports": unusedImports,
      prettier,
    },
    settings: {
      react: {
        version: "19.2",
      },
    },
    rules: {
      ...tseslint.configs.recommended[0].rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,

      "prettier/prettier": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "jsx-a11y/anchor-is-valid": [
        "warn",
        {
          components: ["Link"],
          specialLink: ["to"],
          aspects: ["noHref", "invalidHref", "preferButton"],
        },
      ],
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/no-static-element-interactions": "warn",
      "jsx-a11y/label-has-associated-control": [
        "error",
        {
          controlComponents: ["Input"],
        },
      ],
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
      ],
      "import/order": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
  prettierConfig,
);
