"use client"

import { useTheme } from "@workspace/theme"
import { Button } from "@workspace/ui/components/Button"
import { MoonStar, SunIcon } from "lucide-react"

export function ThemeModeSwitcher() {
  const { resolvedMode, setMode } = useTheme()

  return (
    <Button
      mode="icon"
      size="sm"
      variant="ghost"
      intent="secondary"
      tooltip="Toggle theme"
      tooltipDelay={1000}
      onClick={() => setMode(resolvedMode === "dark" ? "light" : "dark")}
      aria-label="theme switcher"
    >
      {resolvedMode === "dark" ? <SunIcon /> : <MoonStar />}
    </Button>
  )
}
