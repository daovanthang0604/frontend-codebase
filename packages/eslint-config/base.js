import js from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"
import oxlint from "eslint-plugin-oxlint"
import turboPlugin from "eslint-plugin-turbo"
import tseslint from "typescript-eslint"

import { rules } from "./rules.js"

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  ...rules,
  {
    ignores: ["dist/**"],
  },
  // Oxlint runs the fast JS/TS correctness rules (see .oxlintrc.json); this
  // turns those same rules OFF in ESLint so the two don't double-report. Kept
  // ahead of react-internal's React configs so ESLint still owns react-hooks +
  // the React Compiler lints, which Oxlint doesn't have.
  ...oxlint.configs["flat/recommended"],
]
