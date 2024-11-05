import mocha from "eslint-plugin-mocha";
import tsParser from "@typescript-eslint/parser";
import playwright from "eslint-plugin-playwright";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      "node_modules/*",
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
      "**/*.bat", 
      "**/*.pdf", 
      "**/*.json",
      "**/*.txt",
      "**/*.sh",
      "**/*.java",
      '**/*.min.js',
      '**/*.{mjs,cjs}',
      '**/*.env',
      '**/*.yaml',
      "**/gradle/**",
      "**/gradlew",
      "**/build/**",
    ],
  },
  // ... other configurations (globals, rules)
  {
    ...playwright.configs['flat/recommended'],
    plugins: {
      mocha,
    },
    languageOptions: {
      parser: tsParser,
      globals: {
          ...globals.browser,
          ...globals.node,
          ...globals.jquery,
          ...globals.mocha,
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
      "require-yield": "off",
      indent: ["error", 2],
      "mocha/no-exclusive-tests": "error",
      "max-len": ["error", {
          code: 120,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreComments: true,
          ignoreTrailingComments: true,
          ignoreRegExpLiterals: true,
          ignorePattern: ".*exports.*=.*class.*|.*if \\\\(.*\\\\)|.*\\\\?.*\\\\:.*|.*\\\\|\\\\|.*|.*\\\\&\\\\&.*"
      }],
      "arrow-body-style": ["error", "always"],
      "no-process-env": "off",
      "no-magic-numbers": ["error", {
          ignoreArrayIndexes: true,
          enforceConst: true,
          ignore: [-1, 0, 1],
      }],
      "max-nested-callbacks": ["error", 5],
      "max-depth": ["error", 4],
      "new-cap": "off",
      "no-sync": "off",
      "max-lines": "off",
      "operator-linebreak": "off",
      "no-console": "off",
    },
    files: [
      'playwright-e2e/fixtures/*.ts',
      'playwright-e2e/functional/*.ts',
      'playwright-e2e/pages/*t.ts',
    ],
  },
];
