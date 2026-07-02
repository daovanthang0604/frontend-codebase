import { config } from "@workspace/eslint-config/react-internal"

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    files: ["src/lib/radix-colors.ts"],
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
]
