# liquid-ui migration — progress ledger

Plan: `.plan/liquid-ui/2026-07-13-liquid-ui-migration-plan.md`
Branch: `feat/skyway-flight-glass`
Interpretation (plan Open Q#1): "migrate" = make every base-ui module importable from
liquid-ui via re-export/enhance; base-ui stays the foundation (a physical move would
create a dependency cycle). Proceeding on this reading.

Execution model: controller authors foundation + re-exports + showcase + docs; dispatches
fresh non-committing implementer subagents (sonnet) for the M3 glass-craft batches, each
given the shared recipe spec; controller integrates (showcase wiring + package.json
exports), runs the build gate, browser-verifies, and commits per sub-batch.

## Status

- Phase 0 (foundation + harness): DONE. commit 9b781f3.
- Phase 1 (re-export full surface): in progress. Shims = C(19)+D(8)+E(7)+F(1)+B-M2(4)=39
  (35 single-file, 4 dir: DataTable/Filter/Sidebar/DashboardLayout). Group-A (22, M3) and
  variant Group-B (7) NOT shimmed here — born enhanced in Phases 2-3.
  Plan-fix: 1.2 showcase listed Select (Group A, not available till Phase 2) — swap for an
  available Group-C control (InputOTP/Collapsible) in the Phase 1 controls section.
- Phase 2 (glass overlays): pending
- Phase 3 (glass surfaces & accents): DONE. Card (GlassPanel-backed, variant->tint/elevation,
  +solid fallback), Accordion (frosted items), Alert (glass + severity via accent bar - solves the
  colored-border-on-glass cascade issue). Accents: GlassButton (ghost+glass-overlay), Badge glass
  color, Toggle/ToggleGroup/SegmentedControl glass tracks (SegmentedControl got a custom sliding
  glass thumb base-ui lacked), Avatar frosted ring, Kbd frosted caps. Added class-variance-authority
  to liquid deps. Showcase Surfaces + Accents sections verified in browser (dark), no console errors.
  PHASE-5 note: SegmentedControl rail (inline-style) lacks prefers-reduced-transparency fallback.
- Phase 4 (composites & AI kit): DONE. Verified the Phase-1 re-exports theme under liquid via a
  "Composites and AI kit" showcase section (Timeline cyan status dots + a chat Conversation with
  cyan AI avatar, both on GlassPanels). Decision (per plan): heavy composites (DataTable/Filter/
  Sidebar/DashboardLayout/Kanban/Tree/Chart) + AI kit stay M2 re-exports; glassing their floating
  popovers / the Message bubble is deferred as non-trivial. Route-only change.
- Phase 5 (flight showcase + verification): DONE. Built "In the wild" hero: a flight-search panel
  (tinted hero GlassPanel + glass Combobox x2 / DatePicker x2 / SegmentedControl / Select /
  GlassButton / glass Badge) + a boarding-pass card (LIS->JFK, Plane icon, dashed perforation,
  flight details, On time badge) - all composed from liquid-ui primitives. Combobox value is the
  option object (ComboboxOption), not a string (fixed the state types).
  VERIFICATION: both light+dark render; all 8 sections render; console clean (only the pre-existing
  base-ui PressResponder warning). reduced-motion + reduced-transparency code-verified (Phase 0).
  Known minor caveats (for README): SegmentedControl rail lacks reduced-transparency fallback;
  Command palette surface can bleed over bright content; Toast per-type border inert on glass.
- Phase 6 (docs & handoff): DONE. packages/liquid-ui/README.md (3 mechanisms, theme opt-in,
  glass toolkit, add-a-component/theme, a11y + caveats). AGENTS.md layout table += base-ui +
  liquid-ui. Memory: new liquid-ui-kit.md + MEMORY.md index line.

## FINAL STATE
All 6 phases DONE, 8 commits on feat/skyway-flight-glass (9b781f3..e096b02). check-types + lint +
build + isolated liquid-ui build all green. Independent whole-branch review (opus): MERGE-READY,
zero Critical/Important; 3 Minor caveats documented (Toast border inert on glass, SegmentedControl
rail reduced-transparency, Command palette bleed) - all with working fallbacks.
Finish decision (user): KEEP BRANCH AS-IS (no push/PR/merge). Branch preserved for the user to
handle. Reviewer's one optional suggestion: mirror Alert's accent-bar fix on Toast.

## Commits
- Phase 0: glass foundation, shared recipe, showcase shell (9b781f3)
- Phase 1: re-export full base-ui surface, 39 shims + showcase controls (34cde55)
  Verified in browser: both modes render, cyan re-skin works, controls legible on glass.
  Note: one react-aria "PressResponder without pressable child" WARNING is pre-existing
  base-ui (identical on /design-system-baseui) - inherited via re-export, not a regression.

## Phase 2 plan (glass overlays, M3, 19 components)
Approach: parallel non-committing implementer subagents (sonnet) per component, each reads
the shared spec (scratchpad/glass-m3-spec.md) + its base-ui source, reproduces the structure
swapping the solid surface recipe (bg-panel...border shadow-lg) for `glass-overlay` (+ import
lib/glass), scrim->glass-scrim for modals; matches base-ui exports EXACTLY. Controller wires
showcase, runs gate, browser-verifies, commits per sub-batch.
- 2.1 Popover, Tooltip, PreviewCard
- 2.2 Select, Combobox, Autocomplete (opaque inner plate for list legibility)
- 2.3 Menu, ContextMenu, Menubar, NavigationMenu, Command
- 2.4 Dialog, AlertDialog, ConfirmDialog, Sheet (glass-scrim backdrop)
- 2.5 DatePicker, Calendar, Toast, Toolbar

Phase 2 DONE (commits 589decb, <p2 sha>). Notes:
- Calendar + Toolbar demoted to M2 re-exports (Calendar = bare grid inheriting glass from its
  container/popover; Toolbar = non-floating solid bar, glass would be slop). Tier-reassign per plan.
- ConfirmDialog composes liquid Dialog (import swap); DatePicker composes liquid Popover+Calendar.
- Added react-hook-form/zod/@hookform/resolvers/dayjs to liquid-ui deps (needed by ConfirmDialog/
  DatePicker reproductions; catalog:, matches base-ui).
- Added packages/liquid-ui/** to .oxlintrc override (no-explicit-any off + exhaustive-deps off),
  matching packages/base-ui/** and packages/ui/** - liquid-ui is the same kind of library pkg.
- Verified in browser (dark): Select dropdown list LEGIBLE over glass; Dialog modal + glass-scrim
  reads well (scrim dims effectively); no console errors.
- PHASE-5 POLISH ITEMS: (1) Command palette surface mildly translucent - bleed-through when it
  overlaps bright content; consider a more-opaque plate for the palette (Risk #3). (2) Toast
  border-error-9 is inert on glass (glass-overlay's unlayered border beats layered utility) -
  per-type toast border color lost; carry status via icon/text if wanted.
