import pluginReact from "eslint-plugin-react"
import pluginReactHooks from "eslint-plugin-react-hooks"
import globals from "globals"

import { config as baseConfig } from "./base.js"

/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @type {import("eslint").Linter.Config} */
export const config = [
  ...baseConfig,
  pluginReact.configs.flat.recommended,
  {
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  // eslint-plugin-react-hooks v7: the flat "recommended-latest" preset enables
  // the Rules of Hooks, exhaustive-deps, AND the React Compiler lints — which
  // keep components compiler-eligible before the compiler is turned on.
  pluginReactHooks.configs.flat["recommended-latest"],
  {
    settings: { react: { version: "detect" } },
    rules: {
      // React scope no longer necessary with new JSX transform.
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": "off",
      // Advisory only ("Compilation Skipped: incompatible library"): fires for
      // every component built on @tanstack/react-table, react-virtual, etc. The
      // compiler safely skips those components — it is not a correctness signal.
      "react-hooks/incompatible-library": "off",
    },
  },
]
