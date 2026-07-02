import { config } from "@workspace/eslint-config/library"

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    ignores: ["apps/**", "packages/**", "tests/**"],
  },
]
