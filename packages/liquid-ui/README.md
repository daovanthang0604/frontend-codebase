# @workspace/liquid-ui

A glass-aesthetic parallel to **`@workspace/base-ui`**. Every one of base-ui's
component modules is importable from liquid-ui, rendered under the generated
**`liquid`** theme over a shared **glass-material** layer, so an app can adopt
liquid-ui as a drop-in kit and get the "liquid glass sky" look with zero
per-call styling.

liquid-ui is a **glass layer over base-ui, not a fork.** base-ui stays the
primitive foundation; liquid-ui depends on it one-way
(`theme <- base-ui <- liquid-ui`, never the reverse).

## The three mechanisms

liquid-ui reaches "every component available, and glass where it helps" with
three mechanisms, in decreasing order of coverage:

| | Mechanism | Applies to | How it looks liquid |
|---|---|---|---|
| **M1** | **Theme re-skin** | ALL modules | `[data-theme="liquid"]` re-points the raw `--accent-*` / `--gray-*` / `--panel` / `--glass-*` tokens, so **every** component inside the scope renders cyan-on-slate with no class changes. |
| **M2** | **Re-export shim** | controls, composites, AI kit, infra | a one-line `export * from "@workspace/base-ui/components/X"`. Inherits M1; no glass material (correct for text inputs, tables, etc.). |
| **M3** | **Glass-material enhance** | surfaces + overlays | the surface part is re-implemented on the shared glass recipe (`GlassPanel` / `glass-overlay` / `glass-scrim`), composing base-ui's Base UI behavior primitives. Real `backdrop-filter` glass, rim, and sheen. |

Glass belongs on **surfaces and overlays** (panels, cards, dialogs, sheets,
popovers, menus, toasts), not on tiny controls (inputs, checkboxes, sliders)
where it hurts legibility. So most modules are M1/M2; only the ~24 surfaces and
overlays are M3.

## Using it

Import components from `@workspace/liquid-ui/components/*`, exactly like base-ui:

```tsx
import { Card, CardHeader, CardTitle } from "@workspace/liquid-ui/components/Card"
import { Dialog } from "@workspace/liquid-ui/components/Dialog" // etc.
```

Then opt into the liquid look by setting **`data-theme="liquid"`** on any element
— the whole app root for a fully-liquid app, or any subtree for a liquid island
in an otherwise-warm app:

```tsx
<div data-theme="liquid">
  {/* every liquid-ui (and base-ui) component in here renders liquid */}
</div>
```

Light/dark **mode** is orthogonal and stays on next-themes' `.dark` class — the
theme's compound selector (`.dark [data-theme="liquid"], [data-theme="liquid"].dark`)
handles both axes. The theme CSS ships from `@workspace/theme`; import it once at
your entry (already wired in `apps/web/src/main.tsx`):

```ts
import "@workspace/theme/globals.css"
import "@workspace/theme/themes.css"
```

The `/design-system-liquid` route in `apps/web` is a live catalog of every glass
surface plus a composed flight-booking example.

## The glass toolkit

For building your own glass surfaces (M3):

- **`GlassPanel`** (`@workspace/liquid-ui/components/GlassPanel`) — the reusable
  glass surface. Props: `tint` (`frost` | `tinted` | `clear`), `elevation`
  (`flush` | `float` | `hero`), `interactive` (pointer-tracked sheen),
  `refraction` (Chromium-only backdrop displacement, reserve for one hero surface).
- **`glass-overlay`** — a CSS class for floating surfaces (the glass swap for
  base-ui's solid `bg-panel border shadow-lg` recipe): translucent fill +
  `backdrop-filter` + masked rim + sheen. It layers a semi-opaque plate
  (`--glass-overlay-bg`) under the frost so dense popup text stays legible.
- **`glass-scrim`** — the modal backdrop wash behind glass dialogs / sheets.
- **`--glass-*` tokens** — kit defaults on `:root` (as `light-dark()` pairs, so a
  bare kit adapts to mode with no theme loaded); the liquid theme overrides them
  under its scope. Bring the class + tokens in with
  `import "@workspace/liquid-ui/lib/glass"`.

Consume tokens as `var(--glass-x)`; never set a `--glass-*` token on the element
that reads it, or an ancestor theme scope can't override it by inheritance.

## Adding to the kit

- **A component.** If it is a control / composite that only needs the theme
  re-skin, add a re-export shim
  (`export * from "@workspace/base-ui/components/X"`). Directory composites also
  need an explicit `exports` entry in `package.json` (the `./components/*` glob
  only matches files). If it is a surface / overlay that wants glass, reproduce
  base-ui's structure and swap the solid surface recipe for `glass-overlay`
  (backdrop -> `glass-scrim`), keeping its exports identical so it stays a drop-in.
- **A theme.** Add a seed to `packages/theme/src/lib/themes.ts` and regenerate:
  `pnpm dlx tsx packages/theme/scripts/generate-theme-css.ts` (or
  `pnpm --filter @workspace/theme gen:themes`). Never hand-edit the generated
  `themes.css`.

## Accessibility

Every glass surface honors `prefers-reduced-transparency` (near-opaque fill, blur
dropped) and `prefers-reduced-motion` (the pointer sheen and showcase aurora
freeze via the global reset in `@workspace/theme` globals.css). Focus rings are
tuned to read on glass.

Known minor caveats: `SegmentedControl`'s inline-styled rail does not yet carry a
`prefers-reduced-transparency` fallback (its selected thumb does); the `Command`
palette surface can look slightly translucent when it overlaps bright page
content; `Toast`'s per-type border color is overridden by the glass rim (carry
severity via the icon/content).

## Honesty note

This is an **honest web approximation** of frosted / "liquid" glass (backdrop
blur + saturate, layered translucent fill, masked rim, specular sheen). It is
**not** Apple's Liquid Glass, which is Apple-platform-only with no public web CSS.
