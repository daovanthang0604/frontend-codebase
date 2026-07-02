import type { WhiteLabelBrandTheme } from "@workspace/theme"

/**
 * Per-tenant brand theme hook.
 *
 * The original app fetched a white-label brand (accent color, logo, company
 * name) from the backend per market. That integration was removed in this
 * template, so this always returns null and the app falls back to the default
 * theme. Wire your own brand source here if you need per-tenant theming — the
 * `AppProviders` theme wrapper already consumes the returned shape.
 */
export function useBrandTheme(): WhiteLabelBrandTheme | null {
  return null
}
