import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    name: "ui",
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Some component specs mount heavy react-aria overlays / virtualized lists
    // whose first in-test render does meaningful work. In isolation they finish
    // quickly, but under the full Turbo suite (parallel packages → CPU
    // contention) they can exceed the 5000ms default and flake. Raise the
    // per-test timeout so these mounts have headroom regardless of host load.
    testTimeout: 15000,
    // Setup/teardown hooks need the same headroom. Each of the ~50 spec files
    // spins up a fresh jsdom environment and imports the heavy component deps
    // (react-aria overlays, virtualization); under the contended pre-push run that
    // per-file setup can exceed the default 10s hookTimeout and fail the worker.
    hookTimeout: 20000,
    // Cap worker oversubscription. The pre-push hook runs `turbo … test` across
    // every package in parallel; if each vitest instance also spawns one worker
    // per core, the host ends up with N_packages × N_cores test processes all
    // fighting for CPU. A starved worker then blows its timeouts and exits
    // non-zero — the flaky `@workspace/ui#test` failure. Holding this suite to
    // half the cores keeps it fast in isolation while leaving headroom for the
    // sibling Turbo tasks, so it no longer self-contends into a crash.
    maxWorkers: "50%",
    minWorkers: 1,
  },
})
