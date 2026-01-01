import js from "@eslint/js";
import n from "eslint-plugin-n";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
  {
    ignores: ["node_modules", "dist", "eslint.config.js"],
  },
  js.configs.recommended,
  n.configs["flat/recommended"],
  importPlugin.flatConfigs.recommended,
  prettier,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-console": "error",
      "n/no-missing-import": "off",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["**/*.test.js", "tests/**/*.js"],
    languageOptions: {
      globals: globals.jest,
    },
  },
];
