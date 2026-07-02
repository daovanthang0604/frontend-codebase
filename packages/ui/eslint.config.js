import { config } from "@workspace/eslint-config/react-internal"

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/exhaustive-deps": "off",
      "no-constant-binary-expression": "off",
    },
  },
  {
    files: ["src/components/Sidebar/Sidebar.tsx"],
    rules: {
      "react-hooks/rules-of-hooks": "off",
    },
  },
  {
    ignores: ["ui-build.js", "resolve-catalog.js", "restore-catalog.js"],
  },
]
