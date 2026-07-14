# liquid-ui — Full Glass-Kit Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan phase-by-phase. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `@workspace/liquid-ui` a complete, glass-aesthetic parallel to `@workspace/base-ui` — every one of base-ui's 68 component modules available from liquid-ui — powered by the generated `liquid` theme and a shared glass-material layer, so an app can adopt liquid-ui as a drop-in kit and get the "liquid glass sky" look with zero per-call styling.

**Architecture:** liquid-ui is a **glass layer over base-ui**, not a fork. It uses three mechanisms, in decreasing order of coverage: (1) the `[data-theme="liquid"]` theme re-skins colors for *every* component automatically; (2) liquid-ui **re-exports** every base-ui module so the full surface is importable from one kit; (3) for **surfaces and overlays** (where glass material actually matters), liquid-ui ships an **enhanced** version whose surface uses a shared glass recipe, composing base-ui's behavior primitives. base-ui remains the primitive foundation; liquid-ui depends on it (one-way, no cycles).

**Tech stack:** pnpm + Turborepo · React 19 · TypeScript 7 · Tailwind v4 (CSS-first `@theme` + `@source`) · Base UI (`@base-ui/react` 1.2.0) · CSS custom properties + OKLCH + `light-dark()` · next-themes (`.dark` class + `enableColorScheme`).

## Global Constraints

- **pnpm only.** Versions come from `pnpm-workspace.yaml` `catalog:`; internal deps are `workspace:*`. Never `npm`/`yarn`.
- **Dependency direction is one-way:** `theme ← base-ui ← liquid-ui`. base-ui must **never** import liquid-ui.
- **Surgical + DRY:** do not modify base-ui components or the default (`radix`/warm) theme values. liquid-ui adds; it does not fork base-ui source. Re-export where no glass material is warranted.
- **Authoring conventions (match base-ui):** plain function components (no `forwardRef`), `"use client"` on interactive/Base-UI-backed components, `cn` from `@workspace/liquid-ui/lib/utils`, `className` merged **last**, `cva` + exported `*Variants` for multi-variant primitives, `data-slot` attributes, named exports in a trailing block.
- **Icons:** `lucide-react` (the repo standard) — not Phosphor/etc.
- **Copy:** no em-dash (`—`) or en-dash (`–`) as a separator in any user-visible string; use hyphens. Real data in demos (no "Acme"/"Jane Doe").
- **A11y is part of the token contract:** every glass surface honors `prefers-reduced-transparency` (near-opaque fallback, blur dropped) and `prefers-reduced-motion` (freeze pointer sheen); focus rings must read on glass.
- **Definition of done (every phase):** `pnpm check-types && pnpm lint && pnpm build` pass, and the `/design-system-liquid` showcase renders in **both** light and dark app modes with zero console errors.
- **Theme regeneration:** the `liquid` theme is generated. After editing `packages/theme/src/lib/themes.ts`, run `pnpm dlx tsx packages/theme/scripts/generate-theme-css.ts` (tsx is not a local bin here). Never hand-edit `packages/theme/src/styles/themes.css`.

---

## 1. Research Foundation (why this architecture)

Synthesized from four research passes (liquid-glass CSS technique; modern color-token architecture; dark-mode + multi-theme composition; monorepo token/kit file-org). Key findings that shape the plan:

1. **Themes are scoped value overrides, not forks (Radix/shadcn/Material/Atlassian consensus).** A second design language = the *same* token names re-pointed under a selector. Because Tailwind v4 inlines `--color-accent-9: var(--accent-9)` into every `bg-accent-9` utility, redefining the raw `--accent-*`/`--gray-*` primitives under `[data-theme="liquid"]` re-skins **every** component inside the scope with **zero class changes**. → *We already ship this (`themes.css`).* It means most of the 68 components need no visual code at all beyond being used under the theme.
2. **Mode and palette are orthogonal axes.** Mode = `.dark` class (next-themes). Palette = `data-theme` attribute (any subtree). The pitfall: a bare `[data-theme="liquid"]` is specificity `(0,1,0)`, identical to the base `.dark {…}` block, so it only *ties* → must use a **compound** dark selector `.dark [data-theme="liquid"], [data-theme="liquid"].dark` = `(0,2,0)`. → *Implemented in `generate-theme-css.ts`.*
3. **Glass belongs on surfaces + overlays, not tiny controls.** Liquid-glass shines on panels, cards, dialogs, sheets, popovers, menus, toasts; it is noise on text inputs/checkboxes/sliders. → Only ~22 of 68 modules get real glass **material**; the rest are theme-re-skinned re-exports.
4. **Consume tokens as `var(--token, fallback)`; never set the token on the element that reads it** (or an ancestor theme can't override it via inheritance). Use `light-dark()` for color fallbacks (next-themes sets `color-scheme`), plain fallbacks for lengths. → *GlassPanel already follows this.*
5. **File org:** one SoT tokens package (`@workspace/theme`), kits consume it; a kit ships component CSS only for effects utilities can't express (blur/mask/`::before`). Kit-default token values live in the kit (`:root`), scoped retints live in the theme. → We add `liquid-ui/src/styles/glass.css` for kit defaults + the shared overlay recipe.

Primary sources (for the reviewer): Radix Colors "understanding the scale"; shadcn theming + Tailwind v4; Tailwind v4 dark-mode/`@theme`; W3C DTCG 2025.10; next-themes README + issue #236 (single-axis limit); CSS-Tricks "The Big Gotcha with Custom Properties"; MDN `light-dark()`/`backdrop-filter`; Apple HIG Materials (Liquid Glass is Apple-platform-only — the web version is an honest **approximation**).

---

## 2. Architecture & Strategy

### 2.1 The three mechanisms

| Mechanism | Applies to | Per-component work | How it looks liquid |
|---|---|---|---|
| **M1 — Theme re-skin** | ALL 68 | none | cyan accent, cool grays, tuned `--panel`, glass tokens — from `[data-theme="liquid"]` |
| **M2 — Re-export shim** | ~46 (controls, composites, AI kit, infra) | 1-line `export * from base-ui` | inherits M1; no glass material (correct for controls) |
| **M3 — Glass-material enhance** | ~22 (surfaces + overlays) | re-implement the *surface part* on the shared glass recipe, composing base-ui's Base-UI primitives | real `backdrop-filter` glass, rim, sheen |

Every module ends up importable from `@workspace/liquid-ui/components/*`. base-ui is untouched and remains the foundation. This is DRY (no 68-file fork), honest (glass only where it helps), and satisfies "every component available in liquid-ui."

### 2.2 The shared glass-overlay recipe (the core reuse lever)

base-ui's floating surfaces (`Popover`, `Select`, `Combobox`, `Menu`, `Tooltip`, `Dialog`, `Sheet`, …) all use the same `bg-panel … rounded-lg border shadow-lg` recipe + a `data-[starting/ending-style]` entrance. liquid-ui defines **one** `glass-overlay` class (in `liquid-ui/src/styles/glass.css`) that swaps that solid recipe for the glass one (translucent fill + `backdrop-filter` + rim + sheen, reading `--glass-*`), plus a `glass-scrim` for modal backdrops. Every M3 overlay applies `glass-overlay` to its Popup/Content instead of `bg-panel`. So the 22 surfaces are *variations on one recipe*, not 22 bespoke rebuilds.

### 2.3 Dependency & consumption

- App imports the kit from `@workspace/liquid-ui/components/*` and sets `data-theme="liquid"` on the app root (whole-app liquid) or any subtree (a liquid island in a warm app). Mode stays on next-themes' `.dark`.
- `liquid-ui` deps (already correct): `@base-ui/react`, `@workspace/base-ui`, `@workspace/theme`, `lucide-react`, `react`, `react-dom`.
- **Scalability payoff:** a new theme = a seed in `themes.ts` + `gen:themes`. A new component = drop it in liquid-ui (or re-export). A new kit = new package + one `@source` line.

---

## 3. Component Inventory & Treatment Tiers (all 68)

**Group A — Glass surfaces & overlays → M3 (real glass, `glass-overlay`/`glass-scrim`/GlassPanel). ~22:**
`GlassPanel` (done), `Card`, `Accordion`, `Alert`, `Dialog`, `AlertDialog`, `ConfirmDialog`, `Sheet`, `Popover`, `PreviewCard`, `Tooltip`, `Menu`, `ContextMenu`, `Menubar`, `NavigationMenu`, `Command`, `Select`, `Combobox`, `Autocomplete`, `DatePicker`, `Calendar`, `Toast`, `Toolbar`.

**Group B — Glass accents → M2 + optional light glass variant. ~11:**
`Button` (add a `glass` variant), `Badge` (glass chip variant), `Toggle`, `ToggleGroup`, `SegmentedControl`, `Avatar`, `Kbd`, `Pagination`, `Breadcrumbs`, `Meter`, `Progress`.

**Group C — Functional controls → M2 re-export (theme re-skin only; glass would be noise). ~19:**
`Input` (+ `PasswordInput`/`SearchInput`/`TextArea`), `InputOTP`, `Checkbox`, `CheckboxGroup`, `RadioGroup`, `Switch`, `Slider`, `NumberInput`, `Label`, `Form` (+ `Field*`), `FileUpload`, `Tabs`, `Collapsible`, `ScrollArea`, `AspectRatio`, `Separator`, `Skeleton`, `Loader`, `Spinner`.

**Group D — Composites → M2 re-export (themed; glass reaches them via their own overlay usage later). ~8:**
`DataTable`, `Filter`, `Sidebar`, `DashboardLayout`, `Kanban`, `Tree`, `Timeline`, `Chart`.

**Group E — AI/Chat kit → M2 re-export (themed; `Message`/`Conversation` surfaces optionally glassed in a later pass). ~7:**
`Conversation`, `Message`, `PromptInput`, `Reasoning`, `Response`, `Suggestions`, `Tool`.

**Group F — Infra → M2 re-export as-is. 1:**
`Provider`.

> Directory components (`DataTable`, `DashboardLayout`, `Filter`, `Sidebar`) re-export via an `index.ts` and need explicit `package.json` `exports` entries (the `./components/*.tsx` glob doesn't cover directories) — mirror base-ui's `exports` map.

**Tier reassignment rule:** if, during the showcase pass, a Group C/D/E component visibly *wants* glass (e.g. a `Sheet`-like drawer surface), promote it to M3 with the shared recipe — but default to M2 to avoid glass-on-everything slop.

---

## 4. Shared Infrastructure (build first)

### 4.1 `packages/liquid-ui/src/styles/glass.css` (kit defaults + shared recipes)

- `:root { --glass-*: light-dark(…) }` — promote GlassPanel's inline fallbacks to named defaults so components read short `var(--glass-x)` (DRY; kit renders correctly with no theme loaded).
- `.glass-overlay { … }` — the shared floating-surface recipe: translucent fill + `backdrop-filter: blur(var(--glass-blur,16px)) saturate(180%)` + masked rim (`::before`) + sheen (`::after`) + entrance-compatible. Reads `--glass-*`.
- `.glass-scrim { … }` — modal backdrop: `bg-[--glass-scrim] backdrop-blur-sm`.
- A11y blocks (`prefers-reduced-transparency`, `prefers-reduced-motion`) mirroring `GlassPanel.css`.
- Imported once from `liquid-ui/src/components/GlassPanel.tsx` **or** a new `liquid-ui/src/styles/index.ts` side-effect — but simplest: `import "@workspace/liquid-ui/styles/glass.css"` at the top of every M3 component that needs it (Vite dedupes). Decision: import from a single `lib/glass.ts` barrel that each M3 component imports.

### 4.2 `packages/liquid-ui/package.json` exports

Mirror base-ui: keep `./components/*` glob + `./lib/*`, and **add explicit dir entries** for any directory components liquid-ui ships (only needed if we wrap them as dirs; re-export shims are single files so the glob covers them). Add `./styles/*` if we expose `glass.css`.

### 4.3 Theme already done (verify only)

`themes.css` (generated), `@source` for liquid-ui in `theme/globals.css`, `import "@workspace/theme/themes.css"` in `main.tsx`, `./themes.css` export — all in place from the token-layer phase. Phase 0 just re-verifies.

### 4.4 `apps/web/src/routes/design-system-liquid.tsx` (the showcase + verification harness)

A new catalog route mirroring `design-system-baseui.tsx`, wrapped in `<div data-theme="liquid" className="dark">` over a `.liquid-aurora` backdrop (aurora class + keyframes added to `apps/web/src/styles/app.css`, next to the existing decorative keyframes). Sections added incrementally as each group lands, so it doubles as the manual test surface. A final "composed in the wild" section demonstrates a **flight-booking panel + boarding-pass card built from the liquid-ui primitives** (the original use case, now composed from the kit rather than shipped as components).

---

## 5. Migration Patterns (representative full code)

### 5.1 Pattern M2 — re-export shim (Groups C/D/E/F, most of B)

`packages/liquid-ui/src/components/Input.tsx`:
```tsx
// liquid-ui re-exports base-ui's Input unchanged; the liquid theme re-skins its
// colors under [data-theme="liquid"]. Glass material is intentionally NOT added
// to text controls (it hurts legibility).
export * from "@workspace/base-ui/components/Input"
```
Directory composite, `packages/liquid-ui/src/components/DataTable/index.ts`:
```tsx
export * from "@workspace/base-ui/components/DataTable"
```
(+ `package.json` exports entry `"./components/DataTable": "./src/components/DataTable/index.ts"`.)

### 5.2 Pattern M3 — glass overlay (Popover shown; Select/Combobox/Menu/Tooltip identical shape)

`packages/liquid-ui/src/components/Popover.tsx`:
```tsx
"use client"
import { Children, type ComponentProps, type ReactElement, type ReactNode } from "react"
import { Popover as BasePopover } from "@base-ui/react/popover"
import { cn } from "@workspace/liquid-ui/lib/utils"
import "@workspace/liquid-ui/styles/glass.css"

// Same API as base-ui's Popover, but the Popup surface is glass (glass-overlay)
// instead of the solid bg-panel. Behavior primitives (Root/Trigger/Portal/
// Positioner/Popup) come from Base UI, reused verbatim.
function PopoverTrigger({ children, isOpen, defaultOpen, onOpenChange }: {
  children: ReactNode; isOpen?: boolean; defaultOpen?: boolean; onOpenChange?: (o: boolean) => void
}) {
  const [trigger, ...content] = Children.toArray(children)
  return (
    <BasePopover.Root open={isOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <BasePopover.Trigger render={trigger as ReactElement} />
      {content}
    </BasePopover.Root>
  )
}
function Popover({ children, placement = "bottom", offset = 4, className }: {
  children: ReactNode; placement?: string; offset?: number; className?: string
}) {
  const [side, align = "center"] = placement.split(" ") as ["top"|"bottom"|"left"|"right", ("start"|"center"|"end")?]
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner side={side} align={align} sideOffset={offset} className="z-50">
        <BasePopover.Popup className={cn("glass-overlay text-gray-12 rounded-lg outline-none",
          "origin-[var(--transform-origin)] transition-[opacity,scale,translate] duration-200 ease-out",
          "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
          "data-[ending-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:duration-150",
          className)}>
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  )
}
function PopoverDialog({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("p-3.5 outline-0", className)} {...props} />
}
export { Popover, PopoverDialog, PopoverTrigger }
```
`glass-overlay` (in `glass.css`) provides fill + `backdrop-filter` + rim + sheen; portalled popups escape `[data-theme="liquid"]`, so `glass.css` includes a `.dark .glass-overlay` fallback OR the overlay reads `light-dark()` defaults (same trick as GlassPanel). **Decision:** `glass-overlay` uses `light-dark()` fallbacks so portalled popups look right in both app modes without the theme scope; when rendered inside the scope, the theme's `--glass-*` win by inheritance.

### 5.3 Pattern M3 — glass Card (Group A container)

`packages/liquid-ui/src/components/Card.tsx`: same exports as base-ui's Card (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `cardVariants`) but `Card` renders on `GlassPanel` (variants map to `tint`/`elevation`), sub-parts copied verbatim. `variant="solid"` falls back to the base-ui look for non-glass use.

### 5.4 Pattern M3-lite — Button `glass` variant (Group B)

`packages/liquid-ui/src/components/Button.tsx`: re-export base-ui's Button **and** add a thin `GlassButton` (or a `glass` intent) that wraps it with `className="glass-overlay …"` for translucent actions. Keep it minimal; most buttons stay solid.

---

## 6. Phased Task Breakdown

Each phase ends with the DoD (`check-types && lint && build` + showcase renders both modes, zero console errors) and a commit. Phases are ordered so the kit is always buildable.

### Phase 0 — Foundation & harness
- [ ] **0.1** Add `.liquid-aurora` class + `@keyframes liquid-drift` to `apps/web/src/styles/app.css` (deep-twilight radial blobs, `transform`+`hue-rotate` drift, frozen by the existing reduced-motion reset).
- [ ] **0.2** Create `packages/liquid-ui/src/styles/glass.css`: `:root` `--glass-*` defaults (`light-dark()`), `.glass-overlay`, `.glass-scrim`, a11y blocks. Create `packages/liquid-ui/src/lib/glass.ts` (`import "../styles/glass.css"`). Add `"./styles/*": "./src/styles/*.css"` to liquid-ui `exports`.
- [ ] **0.3** Refactor `GlassPanel.tsx` to `import "@workspace/liquid-ui/lib/glass"` and drop its co-located CSS duplication of the shared defaults (keep panel-specific rules in `GlassPanel.css`, move token defaults to `glass.css`). Keep behavior identical.
- [ ] **0.4** Create `apps/web/src/routes/design-system-liquid.tsx` with the `[data-theme="liquid"].dark` + `.liquid-aurora` shell, a `GlassPanel` demo section, and a nav note. Verify the route renders; regenerate `routeTree.gen.ts` via the Vite plugin (dev server).
- [ ] **0.5** DoD + commit `feat(liquid-ui): glass foundation, shared recipe, showcase shell`.

### Phase 1 — Re-export the full surface (M2, all non-A groups)
- [ ] **1.1** Generate re-export shims for every Group C/D/E/F module + Group B modules not getting a variant yet: one `export * from "@workspace/base-ui/components/X"` file each (script or by hand). Directory composites get `index.ts` + `package.json` `exports` entries.
- [ ] **1.2** Add a showcase section that imports ~8 representative controls (Input, Checkbox, Switch, Slider, Tabs, Select, RadioGroup, NumberInput) from **liquid-ui** and renders them under the theme — confirms M1 re-skin (cyan accent, cool grays) works via re-export.
- [ ] **1.3** DoD + commit `feat(liquid-ui): re-export full base-ui surface (theme-reskinned)`.

### Phase 2 — Glass overlays (M3 core: the shared recipe consumers)
Batch by shared recipe. For each: re-implement the surface part applying `glass-overlay`, add a showcase section, verify open/close + legibility over aurora + focus rings + reduced-motion.
- [ ] **2.1** `Popover`, `Tooltip`, `PreviewCard` (simple floating surfaces).
- [ ] **2.2** `Select`, `Combobox`, `Autocomplete` (dropdown popups; keep list rows legible — use a more opaque inner plate).
- [ ] **2.3** `Menu`, `ContextMenu`, `Menubar`, `NavigationMenu`, `Command` (menu popups; submenus).
- [ ] **2.4** `Dialog`, `AlertDialog`, `ConfirmDialog`, `Sheet` (modals/drawers; `glass-scrim` backdrop; imperative `confirm()` for ConfirmDialog).
- [ ] **2.5** `DatePicker` + `Calendar` (glass popover around the day grid), `Toast`, `Toolbar`.
- [ ] **2.6** DoD + commit per sub-batch (`feat(liquid-ui): glass <group> overlays`).

### Phase 3 — Glass surfaces & accents (M3 containers + M2-lite)
- [ ] **3.1** `Card` (GlassPanel-backed, `variant` glass/solid), `Accordion` (glass panels), `Alert` (glass alert).
- [ ] **3.2** `Button` glass variant, `Badge` glass chip, `Toggle`/`ToggleGroup`/`SegmentedControl` glass track, `Avatar`/`Kbd` light glass. `Meter`/`Progress`/`Pagination`/`Breadcrumbs` stay M2 (verify they read on glass).
- [ ] **3.3** Showcase sections for each; DoD + commit.

### Phase 4 — Composites & AI kit polish (M2 verified; targeted glass)
- [ ] **4.1** Verify `DataTable`, `Filter`, `Sidebar`, `DashboardLayout`, `Kanban`, `Tree`, `Timeline`, `Chart` re-exports render themed under liquid; glass their floating bits (Filter's popovers, DataTable's column-settings popover) by having them consume liquid-ui's Phase-2 overlays if trivial, else leave M2.
- [ ] **4.2** AI kit (`Conversation`, `Message`, etc.) re-export verified; optionally glass the `Message`/`Conversation` surface.
- [ ] **4.3** DoD + commit.

### Phase 5 — The "in the wild" showcase (original use case)
- [ ] **5.1** Build a flight-search panel + boarding-pass offer card **in the showcase route**, composed entirely from liquid-ui primitives (GlassPanel + glass Combobox/DatePicker/SegmentedControl/Button/Badge). This is demo code in `apps/web`, not a shipped component.
- [ ] **5.2** Full browser verification pass: both app modes, every showcase section, reduced-motion + reduced-transparency emulation, console clean. Fix findings.
- [ ] **5.3** Final DoD + commit `feat(liquid-ui): flight-booking showcase + full verification`.

### Phase 6 — Docs & handoff
- [ ] **6.1** `packages/liquid-ui/README.md`: what it is, the 3 mechanisms, how to opt into the theme (`data-theme="liquid"`), how to add a component/theme.
- [ ] **6.2** Update `AGENTS.md` layout table + memory (`base-ui-migration-state`) to record liquid-ui + the multi-theme system.
- [ ] **6.3** Commit; open PR from the feature branch.

---

## 7. Verification & Definition of Done

- **Static:** `pnpm check-types && pnpm lint && pnpm build` green after every phase.
- **Isolated kit build:** `pnpm --filter @workspace/liquid-ui build` green.
- **Visual (the real test — no unit tests in this repo):** `/design-system-liquid` renders in light AND dark app modes; every migrated section verified in-browser; portalled overlays (menus, selects, dialogs) are glassy AND legible over the aurora; focus rings visible on glass; `prefers-reduced-motion` freezes the pointer sheen + aurora; `prefers-reduced-transparency` makes surfaces near-opaque; zero console errors.
- **No regression:** `/design-system-baseui` and the app's existing routes are unchanged (base-ui and the warm theme untouched).

---

## 8. Risks & Open Questions

1. **"Migrate" = re-export, not physical move.** This plan interprets "every component migrated to liquid-ui" as *available from liquid-ui via re-export/enhance*, keeping base-ui as the foundation (a physical move would gut base-ui and create a dependency cycle). **Confirm this interpretation.**
2. **Portalled overlay theming.** Overlays mount on `document.body`, outside `[data-theme="liquid"]`. Verified earlier that Base UI popovers still inherit the scope in practice, but the plan hedges with `light-dark()` defaults on `glass-overlay` so they look right regardless. Watch this in Phase 2.
3. **Legibility over glass.** Dense text (Select lists, DataTable, Message) on translucent surfaces risks WCAG failures. Mitigation: more-opaque inner plates for text-heavy popups; keep DataTable/Message solid (M2).
4. **Scope size.** ~22 M3 components is real craft work. If the timeline is tight, ship Phases 0-2 (foundation + overlays, the highest-impact glass) and defer 3-4 accents/composites; the re-exports (Phase 1) already make the *whole* kit available and themed.
5. **`themes.css` regeneration friction.** `tsx` isn't a local bin (`pnpm dlx tsx` works). Consider adding `tsx` as a `@workspace/theme` devDep so `pnpm --filter @workspace/theme gen:themes` runs directly — small lockfile change, optional.
6. **Accent brightness.** The generated ramp normalizes bright seeds down; we decouple the vivid fill via `--accent-solid`. If more vividness is wanted elsewhere (rings, calendar range), tune in `themes.ts` and regenerate.

## 9. Rollback / Safety

- All work on branch `feat/skyway-flight-glass` (or a fresh `feat/liquid-ui`); no commits to `main`.
- Nothing in this plan modifies base-ui source or the warm theme values, so the existing app is unaffected at every phase — a partial migration is safe to ship or revert.
- `git revert` per-phase commits is clean (each phase is self-contained).
