import Color from "colorjs.io"

import { generateRadixColors } from "./radix-colors"

// Default neutral gray seeds for the generated scales. Warm-neutral but LOW
// chroma (OKLCH hue ~70, C ~0.008) so light surfaces read as a clean warm
// near-white, not cream/beige — WDS keeps the warmth in the ink, not the paper.
// Previously cool blue-gray (#50545C / #7E8289, hue ~263). The CSS regeneration
// script imports these so the static generated.css stays in sync with the
// runtime values ThemeStylePreview injects from the same generator.
export const DEFAULT_GRAY_SEED_LIGHT = "#565554"
export const DEFAULT_GRAY_SEED_DARK = "#81807f"

// The Radix generator anchors step 9 on the accent seed, so a very dark brand
// color (e.g. workspace navy #11324F) collapses steps 9-12 into a muddy, non-
// monotonic ramp. WDS avoids this by letting the HUE drive a vivid ramp and
// recovering the brand's darkness as the dark step (accent-12 / --accent-solid).
// We mirror that: pull a too-dark / too-light / low-chroma seed to a vivid mid
// for RAMP GENERATION ONLY. Healthy brands (the common tenant case) pass through
// untouched, so existing per-market themes are unchanged.
export function normalizeAccentSeed(accent: string): string {
  const [L, C, H] = new Color(accent).to("oklch").coords as [
    number,
    number,
    number,
  ]
  if (Number.isNaN(H)) return accent
  if (L >= 0.45 && L <= 0.7 && C >= 0.08) return accent
  return new Color("oklch", [0.52, Math.max(C, 0.14), H])
    .to("srgb")
    .toString({ format: "hex" })
}

export interface GetColorScaleCssParams {
  color: {
    dark: { accent: string; background: string }
    light: { accent: string; background: string }
  }
  accentOnly?: boolean
  borderRadius?: string
}

export function generateRadixTheme({
  color,
  accentOnly,
  borderRadius,
}: GetColorScaleCssParams) {
  const radiusVariables = `--radius: ${borderRadius}`
  let lightModeVariables = ""
  let darkModeVariables = ""
  let themeVariables = ""

  // ---- BUILD LIGHT MODE VARIABLES ----

  const lightResult = generateRadixColors({
    appearance: "light",
    accent: normalizeAccentSeed(color.light.accent),
    background: color.light.background,
    gray: DEFAULT_GRAY_SEED_LIGHT,
  })

  const lightScaleOklch = [
    { name: "accent", scale: lightResult.accentScaleWideGamut },
    { name: "accent-a", scale: lightResult.accentScaleAlphaWideGamut },
    { name: "gray", scale: lightResult.grayScaleWideGamut },
    { name: "gray-a", scale: lightResult.grayScaleAlphaWideGamut },
    ...(accentOnly ? [] : lightResult.allScalesOklch),
  ]

  lightScaleOklch.forEach(({ name, scale }) => {
    scale.forEach((color, index) => {
      lightModeVariables += `--${name}-${index + 1}: ${color}; \n`
      themeVariables += `--color-${name}-${index + 1}: var(--${name}-${index + 1}); \n`
    })
    lightModeVariables += "\n"
    themeVariables += "\n"
  })

  lightModeVariables += `
--accent-contrast: ${lightResult.accentContrast};
--accent-surface: ${lightResult.accentSurfaceWideGamut};
--accent-indicator: ${lightResult.accentScaleWideGamut[8]};
--accent-track: ${lightResult.accentScaleWideGamut[8]};
    `

  themeVariables += `
--color-accent-contrast: var(--accent-contrast);
--color-accent-surface: var(--accent-surface);
--color-accent-indicator: var(--accent-indicator);
--color-accent-track: var(--accent-track);
    `

  // ---- BUILD DARK MODE VARIABLES ----

  const darkResult = generateRadixColors({
    appearance: "dark",
    accent: normalizeAccentSeed(color.dark.accent),
    background: color.dark.background,
    gray: DEFAULT_GRAY_SEED_DARK,
  })

  const darkScaleOklch = [
    { name: "accent", scale: darkResult.accentScaleWideGamut },
    { name: "accent-a", scale: darkResult.accentScaleAlphaWideGamut },
    { name: "gray", scale: darkResult.grayScaleWideGamut },
    { name: "gray-a", scale: darkResult.grayScaleAlphaWideGamut },
    ...(accentOnly ? [] : darkResult.allScalesOklch),
  ]

  darkScaleOklch.forEach(({ name, scale }) => {
    scale.forEach((color, index) => {
      darkModeVariables += `--${name}-${index + 1}: ${color}; \n`
    })
    darkModeVariables += "\n"
  })

  darkModeVariables += `
--accent-contrast: ${darkResult.accentContrast};
--accent-surface: ${darkResult.accentSurfaceWideGamut};
--accent-indicator: ${darkResult.accentScaleWideGamut[8]};
--accent-track: ${darkResult.accentScaleWideGamut[8]};
    `

  return `
:root {
${radiusVariables};
${lightModeVariables}
${themeVariables}
}

.dark {
${darkModeVariables}
}
  `.trim()
}
