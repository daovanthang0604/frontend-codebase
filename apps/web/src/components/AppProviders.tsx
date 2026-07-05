import * as React from "react"
import { DEFAULT_THEME, type Theme } from "@workspace/theme"
import { ThemeProvider, ThemeStylePreview } from "@workspace/theme/provider"
import { UIProvider } from "@workspace/ui/components/Provider"
import { Toaster } from "@workspace/ui/components/Sonner"

import { useBrandTheme } from "@/hooks/use-brand-theme"
import { usePersistedTheme } from "@/hooks/use-persisted-theme"

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const [persistedTheme] = usePersistedTheme()
  const brandTheme = useBrandTheme()
  // Brand owns the accent; persisted hook owns mode-shape preferences
  // (background level, border radius). Accent in `defaultTheme` is only
  // used by Radix when `brandTheme` is null (theme fetch failed / unknown
  // subdomain).
  const baseTheme: Theme = {
    accentColor: DEFAULT_THEME.accentColor,
    background: persistedTheme?.background ?? DEFAULT_THEME.background,
    borderRadius: persistedTheme?.borderRadius ?? DEFAULT_THEME.borderRadius,
  }
  return (
    <ThemeProvider defaultTheme={baseTheme} brandTheme={brandTheme}>
      <ThemeStylePreview />
      <UIProvider>
        {children}
        <Toaster />
      </UIProvider>
    </ThemeProvider>
  )
}
export function AppProviders({ children }: { children: React.ReactNode }) {
  return <ThemeWrapper>{children}</ThemeWrapper>
}
