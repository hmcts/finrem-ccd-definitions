/* eslint.config.mjs
   Refactored ESLint configuration with grouped filename conventions.
*/

import mocha from "eslint-plugin-mocha";
import tsParser from "@typescript-eslint/parser";
import playwright from "eslint-plugin-playwright";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import unicorn from "eslint-plugin-unicorn";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  // General ignores
  {
    ignores: [
      "**/config/*",
      "**/node_modules/*",
      "coverage/*",
      "definitions/*",
      "ccd-definition-processor/*",
      "test/reporter/*",
      "test/functional/*",
      "functional-output",
      "playwright-report/*",
      "yarn.lock",
      ".yarn/**",
      "yarn-audit-known-issues",
      "**/*.properties",
    ],
  },

  // Playwright / TypeScript test config
  {
    ...(playwright.configs?.["flat/recommended"] ?? {}),

    plugins: {
      mocha,
      unicorn,
    },

    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jquery,
        ...globals.mocha,
        AudioWorkletGlobalScope: "readonly",
      },
      ecmaVersion: 2019,
      sourceType: "module",
      parserOptions: {
        requireConfigFile: false,
      },
    },

    rules: {
      "linebreak-style": ["error", "unix"],
      quotes: ["error", "single"],
      semi: ["error", "always"],
      "comma-dangle": ["error", "never"],
      eqeqeq: "error",
      indent: ["error", 2],
      "max-len": [
        "error",
        { code: 200, ignoreStrings: true, ignoreTemplateLiterals: true, ignoreComments: true },
      ],
      "arrow-body-style": ["error", "always"],
      "no-process-env": "off",
      "no-magic-numbers": "off",
      "max-nested-callbacks": ["error", 5],
      "max-depth": ["warn", 4],
      "new-cap": "off",
      "no-sync": "off",
      "max-lines": "off",
      "operator-linebreak": "off",
      "no-console": "off",
      "mocha/no-exclusive-tests": "error",
    },

    files: ["playwright-e2e/**/*.ts", "playwright-e2e/**/*.spec.ts", "playwright-e2e/**/*.test.ts"],
  },

  // Filename conventions
  // Snake case
  {
    files: [
      "playwright-e2e/test/**",
      "playwright-e2e/resources/tab_content/**", // Enforce snake_case for tab_content
    ],
    rules: {
      "unicorn/filename-case": ["error", { case: "snakeCase" }],
    },
  },

  // Kebab case
  {
    files: [
      "playwright-e2e/config/**",
      "playwright-e2e/fixtures/**",
      "playwright-e2e/types/**",
      "playwright-e2e/fixtures/**",
    ],
    rules: {
      "unicorn/filename-case": ["error", { case: "kebabCase" }],
    },
  },

  // Pascal case
  {
    files: [
      "playwright-e2e/data-utils/**",
      "playwright-e2e/pages/events/**",
      "playwright-e2e/pages/helpers/**",
    ],
    rules: {
      "unicorn/filename-case": ["error", { case: "pascalCase" }],
    },
  },

  // Camel case
  {
    files: ["playwright-e2e/helpers/**"],
    rules: {
      "unicorn/filename-case": ["error", { case: "camelCase" }],
    },
  },

  // Optional:general TS/JS rules for the whole repo
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2019,
      sourceType: "module",
    },
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-console": "off",
    },
  },
];
