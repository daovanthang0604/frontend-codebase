import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    projects: [
      "packages/ui/vitest.config.ts",
      "packages/shared/vitest.config.ts",
      "apps/dashboard/vitest.config.ts",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
})
