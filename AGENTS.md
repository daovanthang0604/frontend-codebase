# AGENTS.md

Conventions and rules for this repository. This is the **single source of
truth** for both human and AI contributors. `CLAUDE.md` imports this file;
app-specific details live in `apps/dashboard/CLAUDE.md`.

---

## What this is

A frontend-only **starter template** — a pnpm + Turborepo monorepo with one app
(`apps/dashboard`, Vite + React 19 + TanStack Router) built on a shared UI kit,
theme, and utilities. It was extracted from a larger product: the backend, its
generated API client, and the auth vendor were removed, so **auth and the API
client are stubbed seams** you replace with your own. There is no backend.

## Layout

| Path                         | Package                        | Role                                                        |
| ---------------------------- | ------------------------------ | ----------------------------------------------------------- |
| `apps/dashboard`             | `dashboard`                    | The app — Vite + React + TanStack Router (dev on port 3000) |
| `packages/ui`                | `@workspace/ui`                 | Component library (consumed from source)                    |
| `packages/theme`             | `@workspace/theme`              | Design tokens + Tailwind/PostCSS preset (consumed from source) |
| `packages/shared`            | `@workspace/shared`             | Framework-agnostic utilities                                |
| `packages/eslint-config`     | `@workspace/eslint-config`     | Shared ESLint config                                        |
| `packages/typescript-config` | `@workspace/typescript-config` | Shared tsconfig bases                                       |

## Commands (run from the repo root)

```bash
pnpm install
pnpm dev          # turbo dev — grouped TUI, one tab per task
pnpm build        # build packages + app
pnpm check-types  # tsc --noEmit across the workspace
pnpm lint         # eslint --max-warnings 0 across the workspace
pnpm test         # vitest (harness is set up; no tests ship by default)
pnpm format       # prettier --write .
```

Requires **Node ≥ 24** and **pnpm 10** (`packageManager` is pinned).

## Package management

- **Use pnpm only.** Never run `npm install` or `yarn` anywhere in this repo.
- **Dependency versions are pinned centrally** in `pnpm-workspace.yaml`'s
  `catalog:` block and referenced as `"catalog:"` in package manifests. Add a
  shared version to the catalog rather than hard-coding it per package.
- Internal packages are referenced with `workspace:*`.

## Definition of done

Before claiming a change works, **run and pass**:

```bash
pnpm check-types && pnpm lint && pnpm build
```

State outcomes from real command output — never assert success without running
these. For UI changes, also confirm the dev server renders (`pnpm dev`).

---

## Frontend conventions

1. **Prefer precise types.** Use `unknown` + type guards for untrusted values,
   but `any` is allowed when it is the simplest honest fit for third-party or
   intentionally dynamic code.
2. **Use `@/` path aliases** (`@/services`, `@/components`, …) — avoid relative
   imports more than two levels deep.
3. **Reuse `@workspace/ui` first.** Primitives live in `packages/ui/src`
   (imported as `@workspace/ui/components/*`). Many are named exports inside a
   shared file (e.g. `Input.tsx` also exports `TextArea`/`SearchInput`), so grep
   the exports, not just filenames. The `/design-system` route is a live catalog.
4. **Wrap page content in `<PageShell>`** — it owns the gutter, centering, max
   width, and the title/description header. Don't hand-roll `h1` + `mx-auto p-5`.
5. **Data tables use `<DataTable>`** (`@workspace/ui/components/DataTable`), never
   a raw grid. Its list-friendly shape `{ rows, total, limit, offset }` pairs
   with server mode (`dataSource="server"`, `rowCount`, `onStateChange`).
6. **Keep the established look** when styling — warm surfaces, hairline
   dividers, bordered "boxed" data units, calm and uncrowded (no zebra striping,
   no heavy gridlines). The `/design-system` route shows the components in-context.
7. **JSX non-breaking spaces:** use `&nbsp;`, not `{" "}`.
8. **i18n:** `react-i18next`; `useTranslation` with the **page name as the
   namespace**; `camelCase` keys; catalogs in `public/locales`; load namespaces
   in the route `beforeLoad`.

## Routing (TanStack Router)

- File-based routes live under `apps/dashboard/src/routes`.
- **`routeTree.gen.ts` is generated** by the Vite plugin — never edit it by hand.
- Layout routes: `_authenticated` (guarded by the auth boundary) and
  `_unauthenticated`. A 404 and redirect guards already exist.
- Validate search params with Zod via `@tanstack/zod-adapter`.

## Services layer (API & data fetching)

`services/` is **API and data-fetching only** — no business logic, no feature
constants. Each backend domain is a folder of **three files + a barrel**:

```
services/<name>/
├─ <name>.types.ts    # request / response shapes
├─ <name>.api.ts      # thin, typed axios wrappers (no React)
├─ <name>.queries.ts  # TanStack Query hooks (what components import)
└─ index.ts           # re-exports the three
```

- **`.types.ts`** — interfaces for params and responses. Response bodies mirror
  the backend envelope `{ message, data, ... }`; list filters are typed with
  `AgGridFilter` from `@/types/shared.types`.
- **`.api.ts`** — plain `async` functions over the shared axios instance
  (`@/services/api`). Type the response and return the **unwrapped** payload
  (`response.data.data`). No React in this file.
- **`.queries.ts`** — `useQuery` / `useMutation` hooks plus a `queryKeys`
  factory. Every key derives from `all` (so one `invalidateQueries` clears the
  domain); list keys embed their params. Use `keepPreviousData` on lists,
  `enabled`-gate detail fetches, and `invalidateQueries` (plus `setQueryData`
  to prime detail) on mutations.
- **Components import from `.queries` or the `@/services` barrel only** — never
  call the api functions directly.
- **Register new domains** in `apps/dashboard/src/services/index.ts`.
- **`project/` is the reference example** — copy the folder, rename it, swap the
  shapes. See `apps/dashboard/src/services/README.md`.

Shared pieces already in `services/`:

- **`api.ts`** — the configured axios instance: attaches the bearer token, holds
  the base URL (`VITE_BASE_API`), and has a 401-refresh seam.
- **`api-error.ts`** — `getApiErrorMessage(err)` / `getApiErrorStatus(err)`.

## Auth & API — the stubbed seams

- **Auth is a stub** (`services/auth`): `signIn()` / `signOut()` mint/clear a
  fake token; `useAuthSession()` reports auth from token presence. The route
  guards (`SignedIn` / `SignedOut` / `_authenticated`) work against it. Replace
  `signIn`/`signOut` with your provider so they store a real token via
  `authStorage.setIdToken(...)`.
- **API base URL** is `VITE_BASE_API` (`apps/dashboard/.env.example`). The
  `refreshIdToken` in `api.ts` is a stub returning `null` — re-implement it for
  real silent refresh.

## Theming

- Tokens come from `@workspace/theme` (Radix-style scales: `gray-1..12`,
  `accent-1..12`, alpha variants, etc.). Tailwind v4 runs via PostCSS
  (`@workspace/theme/postcss.config`). Prefer semantic tokens over raw colors.
- Dark mode is handled by `next-themes`; the provider is wired in `AppProviders`.

---

## Working style

- **Surgical changes.** Touch only what the task needs; match the surrounding
  style. Don't refactor unrelated code, reformat untouched lines, or remove
  pre-existing dead code unless asked.
- **Simplicity first.** The minimum code that solves the problem — no speculative
  abstractions, options, or error handling for impossible cases.
- **Explain the non-obvious.** When a choice isn't self-evident, leave a short
  comment saying _why_ (not just _what_).
- **Ask when genuinely ambiguous** rather than guessing between materially
  different interpretations.
