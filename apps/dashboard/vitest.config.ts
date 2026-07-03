import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vitest/config"

// The default test environment stays `node` so the existing logic/service
// tests (src/**/*.test.ts) run unchanged and fast. Component tests opt into a
// DOM by adding a `// @vitest-environment jsdom` docblock at the top of the
// file (see src/test/README.md). The jest-dom matchers loaded in setupFiles
// only attach to `expect` — they're inert in the node-env tests.
//
// JSX is transformed by vitest's built-in esbuild using the tsconfig
// `jsx: "react-jsx"` (automatic runtime) setting — no `@vitejs/plugin-react`
// plugin is needed for component tests, and adding it pulls in a second copy
// of vite's types that breaks `tsc --noEmit`.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    name: "dashboard",
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup-dom.ts"],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    // This app ships no runtime tests yet (its business logic was stripped), so
    // `vitest run` finds nothing. Pass instead of exiting 1 so the CI test step
    // is green now and starts enforcing tests the moment any are added.
    passWithNoTests: true,
    // The default 5s timeout is occasionally exceeded by the FIRST jsdom render
    // in a worker (esbuild transform + jsdom init) when the full suite runs
    // under parallel load (e.g. the pre-push hook), causing flaky timeouts on
    // otherwise-synchronous component tests. 15s absorbs that cold-start spike.
    testTimeout: 15000,
    // Type tests (*.test-d.ts) are checked by `vitest --typecheck` (it shells
    // out to tsc) and run alongside the runtime suite on `vitest run`.
    typecheck: {
      enabled: true,
      include: ["src/**/*.test-d.ts"],
    },
  },
})
