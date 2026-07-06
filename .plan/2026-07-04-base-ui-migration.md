# packages/base-ui — Base UI Migration Plan

> Created 2026-07-04. **STATUS: draft on best-judgment defaults** — the user
> stepped away during brainstorming, so the design decisions below are my
> recommendations. Items marked **⚠️ CONFIRM** are the ones I'd verify before
> executing. This is a plan only; nothing is scaffolded yet.

## Goal

Stand up `@workspace/base-ui`: a parallel UI kit that rebuilds
`@workspace/ui`'s components on **Base UI** (`@base-ui/react`) primitives while
preserving the exact look (our `@workspace/theme` tokens + the same Tailwind/cva
class strings). **Both packages coexist**; we migrate **component by component**;
the app swaps to base-ui per component with no visual change.

## Context (measured)

- **`@workspace/ui`**: 92 component files, built on **`react-aria-components`**
  (37 usages) + a little Radix (slot, controllable-state, scroll-area), styled
  with `cva` / `tailwind-variants` + `tailwind-merge` and `@workspace/theme`.
- **Base UI** (`@base-ui/react` `1.2.0`, **already in the catalog**): 35 headless,
  accessible primitives. Styling = `className` (Tailwind) + per-part `data-*`
  attributes + CSS vars + a `render` prop for composition. No bundled styles.

## Design decisions (best-judgment defaults)

1. **⚠️ CONFIRM — Adoption = drop-in parity.** base-ui mirrors ui's **export
   paths and component APIs** exactly, so migrating a screen is just changing the
   import (`@workspace/ui/components/Button` → `@workspace/base-ui/components/Button`).
   Lowest-risk incremental path. _(This was my open Q1; alternatives were a fresh
   API, or a fully-parallel catalog swapped in bulk at the end.)_
2. **Styling = port verbatim.** Copy each component's cva/`tailwind-variants`
   class strings into the base-ui version and reuse `@workspace/theme`. The look
   is identical by construction; only the headless engine changes.
3. **⚠️ CONFIRM — Coexistence = strangler facade.** `@workspace/base-ui`
   **re-exports not-yet-migrated components from `@workspace/ui`**. So a screen
   can point entirely at `@workspace/base-ui` and get native Base UI components
   where migrated and ui fallbacks elsewhere; as each is rebuilt the re-export
   becomes a native impl — transparently, no churn at call sites.
4. **Scope = tiered** (below). Base UI backs the behavioral primitives; the rest
   are styling-only (copy) or custom composites (defer / port-as-is).
5. **Per-component reference = 9ui.dev.** [9ui](https://www.9ui.dev/docs/components)
   is shadcn-style components built on **Base UI + Tailwind**, so each component's
   9ui source is a proven best-practice recipe. **For every component we consult
   its 9ui implementation first** — composition, subcomponent split, `data-*`
   styling, a11y — and adopt those patterns, but keep **our** palette/`@workspace/theme`,
   not 9ui's defaults. (A few 9ui components use other engines, e.g. Command on
   `cmdk-base`; use judgment there.)

## Component tiers (what maps to what)

- **Tier A — has a Base UI primitive (migrate to Base UI):** Accordion, Avatar,
  Checkbox, Collapsible, ConfirmDialog→AlertDialog, Dialog, Field, Form, Input,
  Menu, Meter, NumberInput→NumberField, Popover, Progress, RadioGroup, ScrollArea,
  Select, SegmentedControl→ToggleGroup, Separator, Sheet (Dialog variant), Slider,
  Switch, Tabs, Toggle, Toolbar, Tooltip, Sonner→Toast. (~28)
- **Tier B — styling-only, no headless engine (copy verbatim):** Alert,
  AspectRatio, Badge, Button (styled native `<button>` — Base UI ships no Button),
  Card, CopyButton, EmptyState, Eyebrow, Kbd, Label, Metric, MetricRow, Section,
  Skeleton, Spinner, StatCard, KpiStatTile.
- **⚠️ CONFIRM — Tier C — custom/complex, no Base UI equivalent (defer or
  port-as-is, staying react-aria/custom):** Calendar, DatePicker, DateField,
  InputOTP, ListBox, NativeSelect, Pagination, Resizable, Sparkline, NProgress,
  Virtualizer, Breadcrumb, DataTable, Sidebar, Filter, DashboardLayout, voice.
  These stay re-exported from ui unless hand-rebuilt. _Are these in scope at all,
  or does base-ui only cover the Base-UI-backed primitives?_

## Phase 0 — Scaffold the package (foundation, ~½ day)

- [ ] Create `packages/base-ui` mirroring `packages/ui` (consumed-from-source):
  `package.json` (name `@workspace/base-ui`, same `exports` map + scripts),
  `tsconfig*.json`, `lib/utils.ts` (`cn`), `Provider`, wire `@workspace/theme`
  postcss + Tailwind.
- [ ] Add deps: `@base-ui/react` (`catalog:`), `class-variance-authority`,
  `tailwind-merge`, `@workspace/theme`. Register the package in the workspace.
- [ ] Set up the **facade barrel**: `@workspace/base-ui/components/*` re-exports
  from `@workspace/ui/components/*` for everything not yet migrated.
- [ ] Create a **dedicated `/design-system-baseui` route** (separate from
  `/design-system`) as the base-ui catalog — mirror the `/design-system` section
  structure and render each base-ui component **side by side with its ui
  counterpart** for visual parity. This route grows one section per migrated
  component (see the recipe).
- [ ] **Verify:** `pnpm check-types && pnpm lint && pnpm build` green; showcase
  renders (all facade re-exports work).

## Phase 1 — Pilot: lock the recipe (~1 day)

Migrate a thin vertical slice covering the main shapes: **Separator** (trivial),
**Label** (styling), **Switch** + **Checkbox** (boolean + `data-[checked]`),
**Button** (Tier B, styled native). Goal: prove scaffolding + styling-port +
API parity + visual parity, then freeze the per-component recipe.

## The per-component recipe (repeat for every component)

1. **Read** ui's component: its exported names, prop surface, and cva/`tv` class
   strings (this is the visual contract to preserve).
2. **Review the 9ui reference (required):** read the matching component at
   **`https://www.9ui.dev/docs/components/<name>`** — its Base UI composition,
   subcomponent split, `data-*`-attribute styling, and a11y wiring are the
   best-practice recipe. Adopt its structure/patterns; do **not** adopt its
   default palette.
3. **Build** `base-ui/components/<Name>.tsx` from Base UI parts (`X.Root`,
   `X.Indicator`, …) following 9ui's composition but with **our** ported class
   strings + `@workspace/theme`, mapping react-aria render-props/state → Base UI
   `data-*` attributes and `render` prop.
4. **Mirror** the export path + every named export (drop-in parity — same import
   surface the app already uses).
5. **Flip** the facade: replace the `@workspace/ui` re-export with the native impl.
6. **Showcase (required — every component):** add or extend the component's
   section in **`/design-system-baseui`**, rendered **side by side with its ui
   counterpart** (all variants/states). No component is "done" without its
   showcase entry.
7. **Verify:** visual + keyboard/interaction parity on that showcase;
   `check-types && lint && build`.
8. **Commit** one component (or a small cohesive group) per commit.

## Phases 2–N — Migrate Tier A by cohesive group

One phase per group so each is independently reviewable/verifiable:
- **Overlays:** Dialog, Popover, Tooltip, Menu, Select, ConfirmDialog, Sheet.
- **Inputs:** Input, NumberField, Slider, RadioGroup, Toggle, SegmentedControl, Field/Form.
- **Disclosure:** Accordion, Collapsible, Tabs.
- **Feedback/data:** Progress, Meter, Avatar, ScrollArea, Separator, Toolbar, Toast.

## Phase B — Tier B styling-only (bulk)

Copy verbatim (they carry no headless behavior). Fast; group into 1–2 commits.

## Phase C — Tier C decision (⚠️ CONFIRM scope)

Either leave re-exported from ui indefinitely (they aren't Base UI), or schedule
hand-rebuilds for the ones worth it. Decide per-component when we get here.

## Cross-cutting notes

- **Tailwind `@source` (done in Phase 1):** `packages/base-ui/src` is added to the
  `@source` globs in `packages/theme/src/styles/globals.css`. Without it, classes
  that appear **only** in base-ui (`data-checked:*`, `data-[orientation=…]`,
  `translate-x-[21px]`) generate **no CSS** and components render unstyled — this
  bit the pilot. One-time; already covers all future base-ui components.
- **Drop-in prop mapping (recipe detail):** ui uses the react-aria API
  (`isSelected`/`isIndeterminate`/`onChange`/`isDisabled`); Base UI uses
  `checked`/`indeterminate`/`onCheckedChange`/`disabled`. Map them in the base-ui
  wrapper so call sites don't change. Selector change: `data-selected` → `data-checked`.
- **React Compiler ⚠️:** Base UI, like react-aria, uses render-props + context.
  The compiler-vs-headless-lib bug we just fixed in `DataTable` (stale renders
  from mutable state behind stable refs) **can recur** — if a migrated component's
  state doesn't update, reach for `"use no memo"` first (see the DataTable fix).
- **Bundle:** during coexistence the app may pull in both react-aria (via ui
  fallbacks) and Base UI. Acceptable mid-migration; shrinks as Tier A/B complete.
- **A11y:** Base UI is WCAG-compliant out of the box; keep the existing
  `aria-label`s and verify keyboard nav per component.

## End state (⚠️ CONFIRM)

Does `@workspace/base-ui` eventually **replace** `@workspace/ui` (delete ui once
Tier A+B are migrated and Tier C is decided), or do both **coexist permanently**?
This decides whether Phase C is mandatory and whether we remove react-aria at the end.

## Open questions to confirm before executing

1. Adoption model — assumed **drop-in parity** (vs fresh API / parallel catalog).
2. Coexistence — assumed **strangler facade** (base-ui re-exports ui).
3. Tier C scope — are the custom composites (DataTable, Sidebar, Calendar…) in
   scope, or is base-ui only the Base-UI-backed primitives + styling-only copies?
4. End state — replace ui eventually, or coexist permanently?
5. Pilot set — happy with Separator/Label/Switch/Checkbox/Button as Phase 1?
