import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@workspace/base-ui/lib/utils"

const colors = [
  "accent",
  "gray",
  "red",
  "blue",
  "grass",
  "amber",
  "success",
  "warning",
  "error",
  "info",
] as const

type Color = (typeof colors)[number]

// Semantic names resolve to the WDS status ramps: success → emerald,
// warning → burnt orange, error → red, info → blue. The Radix scale names map
// to themselves. So a status pill can say color="success" and get the DS green.
const COLOR_RAMP: Record<Color, string> = {
  accent: "accent",
  gray: "gray",
  red: "red",
  blue: "blue",
  grass: "grass",
  amber: "amber",
  success: "success",
  warning: "warning",
  error: "red",
  info: "blue",
}

const badgeVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center justify-center gap-1 self-center rounded-full font-semibold whitespace-nowrap",
    "[&>svg]:pointer-events-none",
  ],
  {
    variants: {
      size: {
        sm: "h-5 px-2 text-[11px] [&>svg]:size-2.5",
        md: "h-6 px-2.5 text-xs [&>svg]:size-3",
        lg: "h-7 px-3 text-[13px] [&>svg]:size-3.5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

type BadgeVariantProps = {
  size?: "sm" | "md" | "lg" | null | undefined
}

// Ported from @workspace/ui/Badge. ui's `asChild` (Radix Slot) is dropped — Base
// UI has no Slot and Badge-as-link is rare; wrap an <a> yourself if needed.
function Badge({
  className,
  color = "accent",
  size = "md",
  dot = false,
  children,
  ...props
}: React.ComponentProps<"span"> & {
  color?: Color
  /** Leading status dot in the text colour (e.g. "• Active"). */
  dot?: boolean
} & BadgeVariantProps) {
  const ramp = COLOR_RAMP[color]

  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ size }), className)}
      // WDS pill: borderless, soft tinted ground (step 3) + readable ink text
      // (step 11). No outline — the calm capsule reads as a status, not a chip.
      style={{
        backgroundColor: `var(--${ramp}-3)`,
        color: `var(--${ramp}-11)`,
      }}
      {...props}
    >
      {dot ? (
        <span className="size-1.5 shrink-0 rounded-full bg-current" />
      ) : null}
      {children}
    </span>
  )
}

export { Badge, badgeVariants }
export type { BadgeVariantProps }
