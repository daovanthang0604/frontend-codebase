# Vite+ Migration — Assessment & Staged Plan

> Created 2026-07-04. Status: **recommendation + spike plan**. Full cutover
> intentionally deferred (see Triggers). This is a strategy plan, not a
> bite-sized task list — Phase A has concrete steps; Phase B is gated.

## TL;DR

Vite+ is our stack unified (Vite 8 · Vitest 4 · Rolldown · Oxlint · Oxfmt ·
tsdown · pnpm) behind one `vp` CLI — now **MIT/free** and **Cloudflare-backed**
(acquired VoidZero 2026-06-04). We already meet its prereqs and, having
hand-assembled this stack across Phases 0–6, we **already hold ~all the
benefits**. What it adds *today* is a unified CLI, not new capability — and it's
**beta (shipped 2026-07-02)**.

**Recommendation:** run a reversible **wrapper spike now**; **defer the full
cutover to Vite+ 1.0**, gated on the triggers below.

## Facts (July 2026)

- **Commands:** `vp dev` · `vp build` · `vp test` · `vp check`
  (Oxfmt + Oxlint + typecheck) · `vp run` (monorepo task runner w/ local cache) ·
  `vp pack` (tsdown) · `vp new` (scaffold). Manages runtime + wraps the existing
  package manager (pnpm stays underneath).
- **Status:** beta; VoidZero: *"stable, but not yet complete"*; **not
  production-recommended until 1.0**. `vp run` **remote caching not yet shipped**.
- **License/owner:** MIT, free. Cloudflare acquired VoidZero (2026-06-04); Vite,
  Vitest, Rolldown, Oxc, Vite+ stay OSS/vendor-agnostic; Evan You still leads.
- **Migrate is conservative:** `vp migrate` preserves `eslint.config.js`,
  `turbo.json`, `.oxlintrc.json`, and Prettier config by default. ESLint/Prettier
  replacement is **opt-in via `--full`**. It rewrites `package.json` scripts to
  the `vp` surface and merges tool config into `vite.config.ts`.

## Why NOT a full migrate-now (specific to this repo)

1. **React Compiler lints.** `vp check` = Oxlint + Oxfmt, **not** ESLint. Oxlint
   still doesn't implement the `eslint-plugin-react-hooks` v7 compiler lints
   (set-state-in-effect, immutability, refs, …) we adopted in **Phase 3** — the
   same gap that already stopped Oxlint from replacing ESLint here. We'd keep
   ESLint running separately, so `vp` doesn't remove a tool for us here.
2. **Turbo → `vp run`.** No remote caching yet; our CI relies on Turbo's cache.
   Switching now is a caching downgrade; running both is redundant.
3. **Prettier → Oxfmt.** Oxfmt is pre-1.0; must confirm Tailwind class-sort parity
   with `prettier-plugin-tailwindcss` before trusting it.
4. **Beta + script-override.** `vp` takes over `package.json` scripts (run via
   `vp run <script>`) — invasive to CI (`ci.yml`), Docker, and muscle memory for
   a 2-day-old beta.

## What we keep regardless of any decision

pnpm + `catalog:` (vp wraps pnpm), TanStack Router/Query/Table, React 19 + React
Compiler, Tailwind v4. None of these are replaced by Vite+.

---

## Phase A — Wrapper spike (NOW · optional · ~1h · fully reversible)

**Goal:** evaluate whether the `vp` CLI adds real DX value over our current
scripts, *without* dropping ESLint / Turbo / Prettier. Branch `spike/vite-plus`,
never merged until we decide.

- [ ] **1. Branch + install.** `git switch -c spike/vite-plus` off `main`;
  add Vite+ per viteplus.dev/guide (confirm exact pkg/CLI: `vite-plus` / `vp`).
- [ ] **2. Conservative migrate.** Run `vp migrate` **without `--full`**. Verify
  it did *not* touch `eslint.config.js`, `turbo.json`, `.oxlintrc.json`, or the
  Prettier config. Read the full `git diff` before trusting it.
- [ ] **3. Inspect the rewrite.** Review the `vite.config.ts` config merge and the
  `package.json` script rewrites to the `vp` surface. Confirm nothing app-level
  (routes, services, theme) changed.
- [ ] **4. Run the gate through `vp`.** `vp check`, `vp test`, `vp build` — AND
  our existing `pnpm lint` (ESLint compiler lints) + `pnpm build`/`test` via Turbo.
  Both paths must pass.
- [ ] **5. Prove nothing regressed.** React Compiler active (`memo_cache_sentinel`
  in bundle), dev server 200 on :3000, prod preview serves JS+CSS 200 (reuse the
  smoke tests from the Vite 8 / pnpm 11 verification).
- [ ] **6. Decide.** Keep `vp` as a thin wrapper (dev/build/test) beside ESLint +
  Turbo? Or revert? **Go = `vp` demonstrably simplifies day-to-day with zero
  regressions.** No-go = revert the branch, revisit at 1.0.

**Reversible:** branch only; delete to abandon. Nothing reaches `main` until we
choose.

## Phase B — Full consolidation (DEFERRED to Vite+ 1.0)

Do **not** start until the matching trigger clears. Each is independent:

- [ ] **B1 · Turbo → `vp run`.** GATE: `vp run` ships **remote caching** at parity
  with our Turbo CI cache. Then port `turbo.json` pipelines to `vp run`, update
  `ci.yml` + Docker, drop `turbo`.
- [ ] **B2 · Prettier → Oxfmt.** GATE: **Oxfmt 1.0** + confirmed Tailwind
  class-sort parity. Then `vp fmt`, remove `prettier` + `prettier-plugin-tailwindcss`.
- [ ] **B3 · ESLint → Oxlint (drop ESLint).** GATE (the hard one): Oxlint
  implements the React Compiler / react-hooks lints, **or** its ESLint-plugin
  bridge is stable enough to run `eslint-plugin-react-hooks` inside Oxlint. Until
  then ESLint stays — this is the same blocker documented in Phase 3 / the Oxlint
  adoption.

## Triggers / watch list

- **Vite+ 1.0 GA** (primary gate for Phase B).
- **Oxlint react-hooks/React-Compiler lint parity** (unblocks B3 — the big one).
- **`vp run` remote caching** (unblocks B1).
- **Oxfmt 1.0 + Tailwind sorting** (unblocks B2).
- **Cloudflare one-click deploy** — bonus pull *if* we ever deploy to Cloudflare
  (the acquisition's strategic payoff: local `vp` → CF edge).

## Risks

- Beta churn (config surface may shift before 1.0).
- Script-override lock-in to the `vp` surface across CI/Docker/contributor habits.
- Coupling four tools' release cadence to one CLI (upside: coordinated; downside:
  one blocker stalls all).
- Betting the toolchain on a single vendor's roadmap — mitigated: it's MIT and
  the underlying tools remain usable standalone (which is exactly our setup today).
