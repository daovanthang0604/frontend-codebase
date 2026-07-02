/**
 * Shared custom ESLint rules for the repository.
 * Imported by base.js — keep rule overrides here.
 *
 * @type {import("eslint").Linter.Config}
 */
export const rules = [
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
]
