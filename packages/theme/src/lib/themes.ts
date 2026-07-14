// Named, non-default themes (design languages) that COEXIST with the default
// warm Radix theme. Each is emitted by scripts/generate-theme-css.ts as a
// scoped `[data-theme="<name>"]` block (light) + a COMPOUND `.dark` selector
// (dark) that out-specifies the base `.dark` accent ramp. Adding a theme = add
// an entry here and re-run `pnpm --filter @workspace/theme gen:themes`.
//
// A theme re-points ONLY raw primitive vars (--accent-*, --gray-*, their alpha
// ramps, the accent "extras") + its own MATERIAL tokens (e.g. --glass-*, --panel).
// The GLOBAL semantic layer (semantic.css) and the Tailwind @theme-inline utility
// mapping (generated.css) are untouched, so every accent-*/gray-*/bg-panel utility
// inside the scope re-resolves automatically — zero component changes. This is the
// industry pattern (Radix/shadcn/Material/Atlassian): coexisting palettes as
// scoped value overrides, not a forked token layer.

export interface NamedTheme {
  /** Selector value: `[data-theme="<name>"]`. */
  name: string
  /** Accent seed — the hue anchor for the generated 12-step ramp (light + dark). */
  accent: string
  /** Gray seed per mode (cool slate for liquid vs the default warm gray). */
  graySeedLight: string
  graySeedDark: string
  /** Background seed per mode (tints ramp steps 1-2 toward the page surface). */
  backgroundLight: string
  backgroundDark: string
  /**
   * Material tokens emitted verbatim into the scope, per mode (`--var` → value).
   * These are the non-Radix, aesthetic-specific tokens: GlassPanel's --glass-*
   * surface set + a re-pointed --panel so overlays follow the theme.
   */
  material: {
    light: Record<string, string>
    dark: Record<string, string>
  }
}

// "liquid" — a liquid-glass sky palette: an iridescent cyan accent over cool
// slate grays, with translucent glass surface tokens (consumed by
// @workspace/liquid-ui GlassPanel). Its signature scene is a deep twilight, so
// the DARK material is the primary tuning; the light material keeps a sane
// bright frost so the theme is usable in light surfaces too.
const liquid: NamedTheme = {
  name: "liquid",
  accent: "#1fc3d6",
  graySeedLight: "#5b6675",
  graySeedDark: "#8b95a6",
  backgroundLight: "#eef3f9",
  backgroundDark: "#12151d",
  material: {
    light: {
      "--panel": "oklch(0.99 0.004 230)",
      // Vivid brand fill decoupled from the (harmonious, normalized) ramp — the
      // WDS hue-vs-fill split. Deep-enough cyan that white label text stays legible.
      "--accent-solid": "oklch(0.6 0.13 210)",
      "--accent-contrast": "#ffffff",
      "--glass-radius": "1.5rem",
      "--glass-fill-top": "rgb(255 255 255 / 0.55)",
      "--glass-fill-bot": "rgb(255 255 255 / 0.28)",
      "--glass-tint-top": "oklch(0.72 0.13 210 / 0.22)",
      "--glass-tint-bot": "oklch(0.72 0.13 210 / 0.08)",
      "--glass-rim": "rgb(255 255 255 / 0.7)",
      "--glass-rim-hi": "rgb(255 255 255 / 0.95)",
      "--glass-rim-lo": "rgb(255 255 255 / 0.5)",
      "--glass-edge-hi": "rgb(255 255 255 / 0.8)",
      "--glass-edge-lo": "rgb(255 255 255 / 0.25)",
      "--glass-sheen": "rgb(255 255 255 / 0.6)",
      "--glass-glow-on": "oklch(0.75 0.13 210 / 0.25)",
      "--glass-shadow": "oklch(0.5 0.06 240 / 0.2)",
      "--glass-contact": "oklch(0.5 0.06 240 / 0.16)",
    },
    dark: {
      "--panel": "var(--gray-2)",
      // Electric sky-cyan brand fill on the twilight glass; dark ink label reads
      // on it (WCAG AA). Ramp step 9 (the focus-ring source) stays the harmonious
      // teal — a thin ring can be calmer than the fill.
      "--accent-solid": "oklch(0.74 0.14 205)",
      "--accent-contrast": "oklch(0.17 0.03 240)",
      "--glass-radius": "1.5rem",
      "--glass-fill-top": "rgb(255 255 255 / 0.12)",
      "--glass-fill-bot": "rgb(255 255 255 / 0.03)",
      "--glass-tint-top": "oklch(0.74 0.15 204 / 0.16)",
      "--glass-tint-bot": "oklch(0.74 0.15 204 / 0.05)",
      "--glass-rim": "rgb(255 255 255 / 0.16)",
      "--glass-rim-hi": "rgb(255 255 255 / 0.5)",
      "--glass-rim-lo": "rgb(255 255 255 / 0.12)",
      "--glass-edge-hi": "rgb(255 255 255 / 0.28)",
      "--glass-edge-lo": "rgb(255 255 255 / 0.06)",
      "--glass-sheen": "rgb(255 255 255 / 0.2)",
      "--glass-glow-on": "oklch(0.88 0.13 200 / 0.28)",
      "--glass-shadow": "rgb(0 0 0 / 0.55)",
      "--glass-contact": "rgb(0 0 0 / 0.45)",
    },
  },
}

export const THEMES: NamedTheme[] = [liquid]
