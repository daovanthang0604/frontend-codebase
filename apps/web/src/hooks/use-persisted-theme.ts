import {
  BACKGROUND_LEVEL_OPTIONS,
  BORDER_RADIUS_OPTIONS,
  type Theme,
} from "@workspace/theme"
import { useLocalStorage } from "react-use"

/**
 * Persisted local-only theme preferences. Brand colour is NOT persisted —
 * it comes from the per-market WhiteLabelTheme API and is the single source
 * of truth for the accent hue. This hook only owns the user-controlled
 * preferences (mode toggle goes through next-themes; this stores radius +
 * background level).
 *
 * Stale localStorage values containing `accentColor` are ignored without a
 * migration — the extra key is silently dropped on next write.
 */
export type PersistedTheme = Pick<Theme, "background" | "borderRadius">

const DEFAULT_PERSISTED: PersistedTheme = {
  background: BACKGROUND_LEVEL_OPTIONS[1]!,
  borderRadius: BORDER_RADIUS_OPTIONS[2]!,
}

export function usePersistedTheme() {
  return useLocalStorage<PersistedTheme>("theme-config", DEFAULT_PERSISTED)
}
