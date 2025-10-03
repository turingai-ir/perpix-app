import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import prettier from 'eslint-plugin-prettier';
import mantine from 'eslint-config-mantine';

export default tseslint.config({ ignores: ['dist', 'build', '.vite'] }, ...mantine, {
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    globals: globals.browser,
    parser: tseslint.parser,
    parserOptions: {
      tsconfigRootDir: import.meta.dirname, // Explicitly set the root directory
    },
  },
  plugins: {
    react,
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    import: importPlugin,
    'unused-imports': unusedImports,
    prettier,
    // jsx-a11y removed here to avoid duplicate plugin declaration
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    ...tseslint.configs.recommended[0].rules,
    ...react.configs.recommended.rules,
    ...reactHooks.configs.recommended.rules,
    ...jsxA11y.configs.recommended.rules, // Keep jsx-a11y rules here

    // ✅ Prettier rules (must be last)
    'prettier/prettier': 'warn',

    // 🔄 React Refresh
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

    // ♿ a11y enhancements
    'jsx-a11y/anchor-is-valid': [
      'warn',
      {
        components: ['Link'],
        specialLink: ['to'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
      },
    ],
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        controlComponents: ['Input'],
      },
    ],

    // 🧹 Clean code
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
    ],

    // 📦 Import order
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      },
    ],

    // 🔧 Optional React cleanup
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
});
