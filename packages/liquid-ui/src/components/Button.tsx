"use client"

import "@workspace/liquid-ui/lib/glass"

import { Button, type ButtonProps } from "@workspace/base-ui/components/Button"
import { cn } from "@workspace/liquid-ui/lib/utils"

export * from "@workspace/base-ui/components/Button"

// GlassButton -- a frosted-glass action. "ghost" is the only base-ui Button
// variant with no solid fill at rest (outline keeps a light idle bg, link/
// unstyled drop the button shape entirely), so it's the one the glass
// material can sit on without fighting an opaque background underneath. The
// shared .glass-overlay recipe (blur+saturate, rim, sheen, shadow) then reads
// as the button's own surface. Thin wrapper: every Button prop still works,
// `variant` is just pinned so the glass look can't be silently swapped for a
// solid fill.
function GlassButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      variant="ghost"
      className={cn("glass-overlay", className)}
    />
  )
}

export { GlassButton }
