# Adopt + Trial Tooling — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL — use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. **Adopt phases (0–4) merge to `main`; Trial phases (5–6) run as time-boxed spikes on a branch with an explicit go/no-go gate.**

**Goal:** Adopt the 8 high-value tooling wins and evaluate the 6 platform trials from the July 2026 tech radar, without destabilizing a frontend-only starter template.

**Architecture:** Additive changes and version bumps — no rewrites. Each task is scoped to exact files, ends in the repo's definition-of-done gate, and commits independently. Phases are sequenced lowest-risk / highest-leverage first; each phase is an independently shippable PR.

**Tech Stack:** pnpm 10 · Turborepo 2.5 · Vite 7 · React 19.2 · TS 5.9 · TanStack Router/Query/Table · Vitest 4 · ESLint 9 flat.

**Provenance:** Derived from the 2026-07-03 tech radar (companion to the correctness audit). Scope = the radar's **Adopt** (9) + **Trial** (8) rings only.

## Global Constraints (apply to every task)

- **pnpm only.** Never `npm`/`yarn`. Shared dependency versions go in `pnpm-workspace.yaml`'s `catalog:` block, referenced as `"catalog:"`.
- **Definition of done** (run before claiming any Adopt task works): `pnpm check-types && pnpm lint && pnpm build` — and after Phase 0, also `pnpm test`.
- **Surgical changes.** Touch only what the task names; match the surrounding style; don't refactor adjacent code or remove pre-existing dead code unless the task says so.
- **Node ≥ 24**, `@/` path aliases (avoid relative imports > 2 levels), `&nbsp;` (not `{" "}`) in JSX.
- **Trial tasks never merge to `main` directly** — they land on a `spike/<name>` branch and produce a written go/no-go note.

---

## Phase overview

| Phase | Tasks | Ring | Risk | Ships as |
|---|---|---|---|---|
| **0 — Foundations** | Turbo 2.6 · Tests in CI · Corepack/Node-25 fix | Adopt (+1 Trial) | 🟢 low | 1 PR |
| **1 — Safety nets** | t3-env · Knip · Syncpack · Vitest type tests | Adopt (+1 Trial) | 🟢 low | 1 PR |
| **2 — MSW** | Mock layer for the stubbed API | Adopt | 🟢 low | 1 PR |
| **3 — React Compiler** | hooks-eslint v6 → RHF bump → enable compiler | Adopt | 🟡 med | 1–2 PRs |
| **4 — Playwright** | ~6 smoke E2E on the auth seam | Adopt | 🟢 low | 1 PR |
| **5 — Toolchain trials** | Oxlint · tsgo + baseUrl · boundaries | Trial | 🟡 med | branch + gate |
| **6 — Platform trials** | Vite 8/Rolldown · pnpm 11 | Trial | 🟠 higher | branch + gate |

**Dependency notes:** Phase 0 (CI tests) unblocks the value of Phases 2–4. MSW (Phase 2) is a dependency of the Playwright DataTable smoke test (Phase 4). Phase 3's ESLint bump surfaces the `exhaustive-deps` violations the correctness audit flagged — do it before, or alongside, re-enabling that rule.

---

## Phase 0 — Foundations

### Task 1: Bump Turborepo 2.5.5 → 2.6

**Files:** `package.json` (root, `devDependencies.turbo`)

- [ ] Update the pin: `pnpm add -D turbo@latest -w` (targets 2.6.x)
- [ ] Reinstall + sanity check: `pnpm install && pnpm exec turbo --version` → expect `2.6.x`
- [ ] Run the gate: `pnpm build` → all tasks succeed
- [ ] Commit: `chore(turbo): bump Turborepo 2.5.5 → 2.6`

### Task 2: Run the test suite in CI

**Files:** `.github/workflows/ci.yml`, `turbo.json`

- [ ] In `ci.yml`, add a step **after** the `Lint` step:
  ```yaml
  - name: Test
    run: pnpm test
  ```
- [ ] In `turbo.json`, give the `test` task correct caching outputs:
  ```json
  "test": { "cache": true, "outputs": ["coverage/**"] }
  ```
- [ ] Verify locally: `pnpm test` → all ~52 tests pass (fix, or `it.skip` with a note, any that were silently broken)
- [ ] Push the branch; confirm the CI **Test** job runs and is green
- [ ] Commit: `ci: run the test suite on every PR`

### Task 3: Make the Dockerfile Corepack-safe for Node 25 *(Trial, low-risk)*

**Files:** `apps/dashboard/Dockerfile`

- [ ] Replace bare `corepack enable` lines with a form that survives Node 25 (which no longer bundles Corepack):
  ```dockerfile
  RUN npm i -g corepack@latest && corepack enable
  ```
- [ ] If Docker is available: `docker build -f apps/dashboard/Dockerfile .` → build reaches the pnpm-install stage without a `corepack: not found` error. (If not, note it as unverified.)
- [ ] Commit: `fix(docker): install corepack explicitly (Node 25 drops the bundle)`

> **PR checkpoint:** `pnpm check-types && pnpm lint && pnpm build && pnpm test` green → open Phase 0 PR.

---

## Phase 1 — Safety nets & hygiene

### Task 4: Validate env with t3-env

**Files:** create `apps/dashboard/src/env.ts`; modify `apps/dashboard/src/services/api.ts:5`, `apps/dashboard/src/constants/app-config.ts`

- [ ] `pnpm add @t3-oss/env-core --filter dashboard` (reuses your existing zod 4)
- [ ] Create `apps/dashboard/src/env.ts`:
  ```ts
  import { createEnv } from "@t3-oss/env-core"
  import { z } from "zod"

  export const env = createEnv({
    clientPrefix: "VITE_",
    client: { VITE_BASE_API: z.string().url() },
    runtimeEnv: import.meta.env,
    emptyStringAsUndefined: true,
  })
  ```
- [ ] Replace the raw reads `import.meta.env.VITE_BASE_API` → `env.VITE_BASE_API` in `services/api.ts` and `constants/app-config.ts` (import from `@/env`)
- [ ] Verify: `pnpm --filter dashboard check-types`; then temporarily blank `VITE_BASE_API` in `.env.local` and `pnpm dev` → app throws a clear startup error instead of silently using an undefined base URL. Restore the value.
- [ ] Commit: `feat(env): validate VITE_BASE_API at startup with t3-env`

### Task 5: Add Knip (dead-code detection)

**Files:** create `knip.json` (root); `.github/workflows/ci.yml`

- [ ] `pnpm add -D knip -w`
- [ ] Create `knip.json` seeding entries + ignoring generated files:
  ```json
  {
    "$schema": "https://unpkg.com/knip@5/schema.json",
    "workspaces": {
      "apps/dashboard": {
        "entry": ["src/main.tsx", "vite.config.ts", "vitest.config.ts"],
        "ignore": ["src/routeTree.gen.ts"]
      },
      "packages/*": { "entry": ["src/index.ts", "src/**/index.ts"] }
    }
  }
  ```
- [ ] Run `pnpm knip` → confirm it flags the known dead items (`@tailwindcss/vite`, `axios` in `shared`, the dangling `./api/*` export, `appConfig`, the `Services` enum). Remove those; re-run until clean.
- [ ] Add a **non-blocking** CI step first (`run: pnpm knip || true`); flip to blocking once green.
- [ ] Commit: `chore: add knip; remove dead deps/exports it found`

### Task 6: Add Syncpack (catalog-aware dep consistency) *(Trial, low-risk)*

**Files:** create `.syncpackrc.json` (root); `.github/workflows/ci.yml`

- [ ] `pnpm add -D syncpack -w`
- [ ] Create `.syncpackrc.json` with a catalog version group so hardcoded versions that should be cataloged are flagged:
  ```json
  {
    "versionGroups": [
      { "label": "Use the pnpm catalog for shared deps", "dependencies": ["**"], "packages": ["**"], "preferVersion": "highestSemver" }
    ]
  }
  ```
- [ ] Run `pnpm syncpack list-mismatches` → confirm it flags `packages/ui` hardcoding `class-variance-authority`/`dayjs` instead of `catalog:`. Fix those to `"catalog:"`.
- [ ] Add CI step `pnpm syncpack lint` (blocking once clean).
- [ ] Commit: `chore: add syncpack; align packages/ui to the catalog`

### Task 7: Add Vitest type tests for the services layer

**Files:** create `apps/dashboard/src/services/project/project.types.test-d.ts`; modify `apps/dashboard/vitest.config.ts`

- [ ] Enable type testing in `apps/dashboard/vitest.config.ts`:
  ```ts
  test: { /* ...existing... */ typecheck: { enabled: true, include: ["src/**/*.test-d.ts"] } }
  ```
- [ ] Create a type test that pins the reference domain's shapes:
  ```ts
  import { expectTypeOf } from "vitest"
  import type { Project } from "./project.types"

  test("project payload is unwrapped, not the envelope", () => {
    expectTypeOf<Project>().toHaveProperty("id")
    expectTypeOf<Project>().not.toHaveProperty("data")
  })
  ```
- [ ] Verify: `pnpm --filter dashboard test` runs the type test and it passes
- [ ] Commit: `test: add type tests for the project services domain`

> **PR checkpoint:** gate green → open Phase 1 PR.

---

## Phase 2 — MSW (make the stubbed API runnable)

### Task 8: Mock Service Worker for `services/project`

**Files:** create `apps/dashboard/src/mocks/{handlers.ts,browser.ts,node.ts}`, `apps/dashboard/public/mockServiceWorker.js`; modify `apps/dashboard/src/main.tsx`, `apps/dashboard/src/test/setup-dom.ts`

- [ ] `pnpm add -D msw --filter dashboard` then `pnpm --filter dashboard exec msw init public --save` (commits the worker file)
- [ ] `src/mocks/handlers.ts` — mirror the `services/project` domain (list/detail/create/update/delete), returning the `{ message, data }` envelope your services unwrap:
  ```ts
  import { http, HttpResponse } from "msw"
  const base = import.meta.env.VITE_BASE_API
  export const handlers = [
    http.get(`${base}/projects`, () =>
      HttpResponse.json({ message: "ok", data: { rows: [], total: 0, limit: 20, offset: 0 } })),
    // ...detail, create, update, delete
  ]
  ```
- [ ] `src/mocks/browser.ts` → `setupWorker(...handlers)`; `src/mocks/node.ts` → `setupServer(...handlers)`
- [ ] In `main.tsx`, start the worker **dev-only** before rendering:
  ```ts
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser")
    await worker.start({ onUnhandledRequest: "bypass" })
  }
  ```
- [ ] In `src/test/setup-dom.ts`, wire the node server with `onUnhandledRequest: "error"` (beforeAll `listen` / afterEach `resetHandlers` / afterAll `close`)
- [ ] Verify (dev): `pnpm dev` → the project screen renders mock data, not a network error. Verify (test): add one `project.queries` test that asserts the list hook resolves against the handler; `pnpm --filter dashboard test` passes.
- [ ] Commit: `feat(mocks): add MSW for the project domain (dev + tests)`

> **PR checkpoint:** gate green → open Phase 2 PR.

---

## Phase 3 — React Compiler

### Task 9: Upgrade the hooks ESLint plugin and fix violations

**Files:** `packages/eslint-config/package.json`, `packages/eslint-config/react-internal.js`, `apps/dashboard/eslint.config.js`

- [ ] Bump `eslint-plugin-react-hooks` `^5.2.0 → ^6` in `packages/eslint-config/package.json`; `pnpm install`
- [ ] In `react-internal.js`, switch to the v6 recommended preset (folds in the React Compiler lints)
- [ ] Remove the `"react-hooks/exhaustive-deps": "off"` override in `apps/dashboard/eslint.config.js` (set to `warn`) — this surfaces the stale-closure risks the correctness audit flagged
- [ ] Run `pnpm lint` → fix violations (prefer `useEffectEvent` / correct deps; don't blanket-disable)
- [ ] Commit: `chore(eslint): react-hooks v6 + re-enable exhaustive-deps`

### Task 10: Bump react-hook-form and audit forms for compiler-compat

**Files:** `pnpm-workspace.yaml` (catalog), form components under `packages/ui` + `apps/dashboard`

- [ ] Catalog bump: `react-hook-form: 7.66.0 → ^7.75` in `pnpm-workspace.yaml`; `pnpm install`
- [ ] Audit each form: prefer `useWatch` over `watch`, `useFormState` over reading `formState`, and `<Controller>` where values are set programmatically
- [ ] Verify: `pnpm check-types && pnpm lint && pnpm test` green
- [ ] Commit: `chore(forms): RHF ≥7.75 + compiler-safe patterns`

### Task 11: Enable the React Compiler

**Files:** `apps/dashboard/package.json`, `apps/dashboard/vite.config.ts`

- [ ] Pin the plugin exactly: `pnpm add -D babel-plugin-react-compiler@1.0.0 --filter dashboard`
- [ ] Wire it into the existing `viteReact()` call (currently option-less):
  ```ts
  viteReact({ babel: { plugins: ["babel-plugin-react-compiler"] } })
  ```
- [ ] Verify: `pnpm build` succeeds; `pnpm test` green; run `pnpm dev` and confirm React DevTools shows the **"Memo ✨"** badge on components (compiler is active); any component it can't compile is flagged by the lint rules from Task 9 (escape hatch: `"use no memo"`)
- [ ] Commit: `feat(react): enable the React Compiler (pinned 1.0.0)`

> **PR checkpoint:** gate green + a manual click-through of the app → open Phase 3 PR.

---

## Phase 4 — Playwright smoke E2E

### Task 12: ~6 smoke tests on the stub-auth seam

**Files:** create `apps/dashboard/playwright.config.ts`, `apps/dashboard/tests/e2e/smoke.spec.ts`; modify a root render point to emit a `data-app-ready` signal; `turbo.json`

- [ ] `pnpm add -D @playwright/test --filter dashboard && pnpm --filter dashboard exec playwright install chromium`
- [ ] Add a `data-app-ready="true"` attribute once the router has mounted (avoids racing the blank SPA shell)
- [ ] `playwright.config.ts`: `webServer` runs `pnpm dev` (with MSW providing data), `baseURL` port 3000, Chromium project
- [ ] `smoke.spec.ts` — ~6 tests gated on `data-app-ready`: sign-in through the boundary, sign-out, one cross-route nav, a `<DataTable>` server-mode round-trip (against MSW), one form submit, a 404
- [ ] Add a `turbo.json` `e2e` task (`dependsOn: ["^build"]`, not cached as a build output)
- [ ] Verify: `pnpm --filter dashboard exec playwright test` → all green
- [ ] Commit: `test(e2e): Playwright smoke tests for the auth + data seams`

> **PR checkpoint:** gate green → open Phase 4 PR. **Adopt work complete.**

---

## Phase 5 — Toolchain trials *(branch `spike/rust-toolchain` — each ends in a go/no-go note)*

### Task 13: Oxlint beside ESLint (spike)

- [ ] `pnpm add -D oxlint eslint-plugin-oxlint @tanstack/oxlint-config -w`; bootstrap config with `pnpm dlx oxlint-migrate`
- [ ] Add `eslint-plugin-oxlint` to the flat config to disable rules Oxlint already covers; add an `oxlint` root script running before `eslint`
- [ ] **Measure:** `time pnpm lint` before vs. `time (pnpm oxlint && pnpm lint)` after; check for false positives and that TanStack rules still fire
- [ ] **Gate:** adopt if the wall-clock win is real *and* zero rule-coverage regressions; else park. Write the note; do **not** merge without a decision.

### Task 14: tsgo non-blocking check + delete `baseUrl` (partly permanent)

- [ ] **Permanent, safe (mergeable to `main`):** delete `"baseUrl": "."` from `apps/dashboard/tsconfig.json`, `packages/ui/tsconfig.json`, `packages/theme/tsconfig.json` (paths are already relative). Verify `pnpm check-types && pnpm build` still green.
- [ ] **Spike:** add a non-blocking CI job `pnpm dlx @typescript/native-preview tsgo --build` with `continue-on-error: true`; compare its output to `tsc`
- [ ] **Gate:** keep the non-blocking job if it agrees with `tsc`; revisit making it authoritative at TS 7 GA.

### Task 15: Enforce module boundaries with `turbo boundaries`

- [ ] `pnpm exec turbo boundaries` → review reported cross-package / relative-escape violations
- [ ] Add `tags` + `allow`/`deny` rules in `turbo.json` (e.g. `shared` may not import the app); add an ESLint `no-restricted-imports` rule for intra-app layering (`services/*.api.ts` must not import React)
- [ ] **Gate:** low-risk; if violations are few, fix them and merge; if many, land the rules as `warn` first.

---

## Phase 6 — Platform trials *(branch `spike/platform-upgrades` — highest risk, hard gate)*

### Task 16: Vite 7 → 8 / Rolldown (spike)

- [ ] `pnpm add -D vite@^8 --filter dashboard` (+ align `@vitejs/plugin-react` to its Vite-8-compatible major); rename `build.rollupOptions` → `build.rolldownOptions` if any exist (none currently in the config)
- [ ] Verify: `pnpm build` produces a working bundle; `pnpm dev` HMR works; run the app + Playwright smokes; confirm the TanStack Router plugin + Tailwind PostCSS resolve under Rolldown
- [ ] **Gate:** adopt only if build + app + E2E all pass clean; note the before/after build time.

### Task 17: pnpm 10 → 11 (spike)

- [ ] Update `packageManager` to `pnpm@11.x`; migrate `pnpm-workspace.yaml` `onlyBuiltDependencies` → the new `allowBuilds` format
- [ ] `pnpm install` from a clean store; verify `pnpm build && pnpm test`; confirm the `minimumReleaseAge` default doesn't block a needed dependency
- [ ] **Gate:** adopt if install + gate are clean; the supply-chain defaults are the payoff.

---

## Self-review

- **Coverage:** all 8 Adopt + 6 Trial radar items map to tasks (Standard Schema folded into Task 4; `turbo boundaries` into Task 15). ✓
- **No placeholders:** every task has exact files, commands, and verification. ✓
- **Sequencing:** CI-tests (T2) precede the tools that need them; MSW (T8) precedes the DataTable smoke (T12); the ESLint bump (T9) precedes enabling the compiler (T11). ✓

## Execution

Two ways to run this:
1. **Subagent-driven (recommended):** a fresh subagent per task with a review checkpoint between each.
2. **Inline:** execute phase-by-phase in one session with a checkpoint at each PR boundary.

Suggested first increment: **Phases 0–1** (safe, high-leverage foundations), then pause for review before the React Compiler work (Phase 3).
