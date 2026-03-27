import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import pluginImport from "eslint-plugin-import";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import unicorn from "eslint-plugin-unicorn";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";


export default tseslint.config([
  globalIgnores([
    "dist",
    "build",
    "node_modules",
    "*.env",
    "*.env.*",
    "*.png",
    "*.jpg",
    "*.jpeg",
    "*.gif",
    "*.svg",
    "*.ico",
    "*.mp4",
    "*.mp3",
    "*.lock",
    "*.mjs",
    "*.cjs",
    "*.js",
    "src/components/ui/*.tsx",
  ]),
  prettier,
  {
    name: "base",
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      unicorn,
      "no-relative-import-paths": noRelativeImportPaths,
      "import": pluginImport,
    },
    rules: {
      // === VARIABLE DECLARATION ===
      "no-var": "error",
      "prefer-const": "warn",
      "no-new-object": "error",
      "no-new-func": "error",
      // === VARIABLE ASSIGNMENT ===
      "no-self-assign": "error",
      "@typescript-eslint/no-use-before-define": [
        "error",
        {functions: false, classes: true, variables: true},
      ],
      "init-declarations": ["warn", "always"],
      // === GLOBAL VARIABLES ===
      "no-implicit-globals": "error",
      "no-restricted-globals": ["warn", "eval", "event"],
      // === TEMPLATE LITERALS ===
      "prefer-template": "warn",
      // === FUNCTION STYLE ===
      "prefer-arrow-callback": "warn",
      // === PROMISE RULES ===
      "no-async-promise-executor": "error",
      // === DESTRUCTURING ===
      "prefer-destructuring": [
        "warn",
        {
          VariableDeclarator: {
            array: false,
            object: true,
          },
          AssignmentExpression: {
            array: false,
            object: false,
          },
        },
      ],
      // === CONTROL FLOW ===
      curly: ["error", "all"],
      eqeqeq: ["error", "always"],
      // === TYPESCRIPT TYPE SAFETY ===
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/prefer-as-const": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      // === NAMING CONVENTION ===
      "@typescript-eslint/naming-convention": [
        "warn",
        // variable rules
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "forbid",
        },
        {
          selector: "variable",
          modifiers: ["unused"],
          format: ["camelCase"],
          leadingUnderscore: "require",
        },
        // function rules
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "parameter",
          modifiers: ["unused"],
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        // type rules
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "interface",
          format: ["PascalCase"],
          custom: {
            regex: "^I[A-Z]",
            match: false,
          },
        },
        {
          selector: "typeAlias",
          format: ["PascalCase"],
          custom: {
            regex: "^T[A-Z]",
            match: false,
          },
        },
        {
          selector: "typeParameter",
          format: ["PascalCase"],
          custom: {
            regex: "^T[A-Z]",
            match: false,
          },
        },
      ],
      // === IMPORT PATHS ===
      "no-relative-import-paths/no-relative-import-paths": [
        "warn",
        {allowSameFolder: true, rootDir: "src", prefix: "@"},
      ],
      // === IMPORT ORDER ===
      "import/order": "off",
      "import/first": "error",
      "import/newline-after-import": ["error", { count: 1 }]
    },
  },
  // file naming conventions
  {
    name: "file naming convention - pages, components",
    files: ["src/pages/**/*.tsx", "src/components/**/*.tsx"],
    ignores: ["src/components/ui/**", "**/index.tsx"],
    rules: {
      "unicorn/filename-case": [
        "error",
        {
          case: "pascalCase",
        },
      ],
    },
  },
  {
    name: "file naming convention - shadcn/ui",
    files: ["src/components/ui/**/*.tsx"],
    rules: {
      "unicorn/filename-case": [
        "error",
        {
          case: "camelCase",
        },
      ],
    },
  },
  {
    name: "file naming convention - hooks, stores, utils, lib, config, types, models",
    files: [
      "src/hooks/**/*.ts", "src/stores/**/*.ts", "src/utils/**/*.ts", "src/lib/**/*.ts", "src/config/**/*.ts", "src/types/**/*.ts", "src/models/**/*.ts"
    ],
    ignores: ["**/*.d.ts", "**/*.config.ts", "**/index.ts"],
    rules: {
      "unicorn/filename-case": [
        "error",
        {
          case: "camelCase",
        },
      ],
    },
  },
]);
