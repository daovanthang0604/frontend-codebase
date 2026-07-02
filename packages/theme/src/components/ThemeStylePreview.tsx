import { generateRadixTheme } from "../lib/radix-theme"
import { useTheme } from "./ThemeProvider"

export function ThemeStylePreview() {
  const { theme, brandTheme } = useTheme()
  // Brand accent (when present) is the only colour that varies per market.
  // Radix re-derives the full 12-step scale for both light and dark modes
  // from this single hex, so no other CSS variables need to change.
  const accentColor = brandTheme?.accentColor ?? theme.accentColor
  const background = theme.background
  const borderRadius = theme.borderRadius.value

  const cssTheme = generateRadixTheme({
    color: {
      dark: {
        accent: accentColor,
        background: background.valueDark,
      },
      light: {
        accent: accentColor,
        background: background.value,
      },
    },
    accentOnly: true,
    borderRadius: borderRadius,
  })

  return (
    <style
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: cssTheme,
      }}
    />
  )
}
