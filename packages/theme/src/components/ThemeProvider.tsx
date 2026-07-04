"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import {
  ThemeProvider as ThemeModeProvider,
  useTheme as useThemeMode,
} from "next-themes"

import {
  DEFAULT_THEME,
  type Theme,
  type ThemeContextValue,
  type ThemeMode,
  type WhiteLabelBrandTheme,
} from "../consts"

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  brandTheme = null,
}: {
  children: ReactNode
  defaultTheme?: Theme
  /**
   * Per-market brand. When provided, `brandTheme.accentColor` overrides
   * `defaultTheme.accentColor` as the Radix accent input — see
   * `ThemeStylePreview`. Other fields are surfaced by the app shell.
   */
  brandTheme?: WhiteLabelBrandTheme | null
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [isDirty, setIsDirty] = useState(false)
  const updateTheme = (partial: Partial<Theme>, isDirty = true) => {
    setTheme((prev) => ({ ...prev, ...partial }))
    setIsDirty(isDirty)
  }
  return (
    <ThemeContext.Provider value={{ theme, updateTheme, isDirty, brandTheme }}>
      <ThemeModeProvider
        attribute="class"
        defaultTheme="light"
        disableTransitionOnChange
        enableColorScheme
      >
        {children}
      </ThemeModeProvider>
    </ThemeContext.Provider>
  )
}
export function useTheme() {
  const ctx = useContext(ThemeContext)
  const themeMode = useThemeMode()
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider")
  return {
    ...ctx,
    mode: themeMode.theme as ThemeMode,
    // Resolved (currently-visible) mode — always "light"/"dark", never "system".
    // Toggles must key off this, not `mode`, or the first click no-ops when
    // `mode` is "system" and the target happens to match what's on screen.
    resolvedMode: themeMode.resolvedTheme as ThemeMode,
    setMode: themeMode.setTheme,
  }
}
