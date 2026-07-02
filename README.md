# Frontend Codebase — Starter Template

A reusable **frontend-only** starter.
It keeps the scaffolding, design system, theming, routing, i18n, and data-fetching
plumbing — with all business features and backend/vendor coupling removed. Sign in
with the demo stub and you get a working authenticated dashboard shell to build on.

## Stack

- **React 19 + TypeScript**, built with **Vite 7**
- **TanStack Router** (typed, file-based) · **TanStack Query** · **TanStack Table**
- **Tailwind CSS v4** (via PostCSS) with tokens from `@workspace/theme`
- **react-aria-components**–based UI kit (`@workspace/ui`)
- **i18n** via `react-i18next`
- **pnpm** workspaces + **Turborepo**

## Layout

```
frontend-codebase/
├─ apps/
│  └─ dashboard/          # the app (Vite + React). Business logic stripped.
├─ packages/
│  ├─ ui/                 # @workspace/ui   — component library (consumed from source)
│  ├─ theme/              # @workspace/theme — design tokens + Tailwind/PostCSS preset (consumed from source)
│  ├─ shared/             # @workspace/shared — framework-agnostic utilities
│  ├─ eslint-config/      # @workspace/eslint-config
│  └─ typescript-config/  # @workspace/typescript-config
├─ pnpm-workspace.yaml    # workspaces + dependency catalog (pinned versions)
└─ turbo.json
```

## Getting started

```bash
pnpm install
pnpm dev          # dashboard on http://localhost:3000
```

Other scripts (run from the repo root):

```bash
pnpm build        # build packages + app
pnpm check-types  # tsc --noEmit across the workspace
pnpm lint         # eslint across the workspace
pnpm test         # vitest (test harness is set up; no tests ship by default)
```

## What's a stub (and how to make it real)

This template is intentionally backend-free. Two seams are stubbed:

- **Auth** — `apps/dashboard/src/services/auth`. `signIn()` mints a fake token
  (persisted to `localStorage`); `signOut()` clears it; `useAuthSession()` reports
  auth purely from token presence. The route guards (`SignedIn` / `SignedOut` /
  the `_authenticated` layout) work against it. Replace `signIn`/`signOut` with
  your provider so they store a real token via `authStorage.setIdToken(...)`.
- **API client** — `apps/dashboard/src/services/api.ts`. A configured `axios`
  instance with a request interceptor (attaches the bearer token) and a 401
  response interceptor. The token-refresh function is a stub that returns `null`
  — re-implement `refreshIdToken()` against your provider to restore silent
  refresh + request replay. Point the base URL at your backend via `VITE_BASE_API`
  (see `apps/dashboard/.env.example`).

Add your screens as routes under `apps/dashboard/src/routes` and compose them from
`@workspace/ui`. The `/design-system` route is a live catalog of the available
components.

## Notes

- **Dependency versions** are pinned centrally in `pnpm-workspace.yaml`'s
  `catalog:` block and referenced as `"catalog:"` in package manifests.
- Provenance: extracted from a larger product monorepo (frontend only).
```
