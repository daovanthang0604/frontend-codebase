export type ThemeMode = "light" | "dark"

export interface Theme {
  accentColor: string
  background: { label: string; value: string; valueDark: string }
  borderRadius: { label: string; value: string }
}

/**
 * Per-market brand identity. Sourced from the backend WhiteLabelTheme table.
 *
 * Only `accentColor` flows into the rendered Radix scale today — see
 * `ThemeStylePreview`. `companyName` / `logoUrl` / `faviconUrl` are surfaced
 * by the app shell (login page, sidebar, favicon, document.title).
 */
export interface WhiteLabelBrandTheme {
  accentColor: string
  companyName: string | null
  logoUrl: string | null
  faviconUrl: string | null
}

export interface ThemeContextValue {
  theme: Theme
  isDirty: boolean
  updateTheme: (partial: Partial<Theme>, isDirty?: boolean) => void
  brandTheme: WhiteLabelBrandTheme | null
}

export const BACKGROUND_LEVEL_OPTIONS = [
  { label: "Soft", value: "#f9f9f9", valueDark: "#202020" },
  { label: "Medium", value: "#F6F6F5", valueDark: "#191919" }, // WDS cream canvas
  { label: "Deep", value: "#ffffff", valueDark: "#111111" },
]

// Base --radius the tenant can pick; the scale in globals.css derives the soft
// WDS ramp from it (Medium 8px = WDS default → buttons 11px, cards 16px).
export const BORDER_RADIUS_OPTIONS = [
  { label: "None", value: "0px" },
  { label: "Small", value: "6px" },
  { label: "Medium", value: "8px" },
  { label: "Large", value: "12px" },
]

export const DEFAULT_THEME: Theme = {
  // workspace Design System (WDS) brand accent — deep navy. Seeds the hue of the
  // generated 12-step accent ramp; the button fill uses the dark step via
  // --accent-solid (see generated.css), mirroring WDS's hue-vs-fill split.
  accentColor: "#11324F",
  background: BACKGROUND_LEVEL_OPTIONS[1]!,
  borderRadius: BORDER_RADIUS_OPTIONS[2]!, // Medium 8px — WDS bookish radii
}
