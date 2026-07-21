import * as React from "react"
import { cn } from "@workspace/liquid-ui/lib/utils"
import { cva } from "class-variance-authority"

// Kit-default --glass-* tokens (--glass-overlay-bg, --glass-rim) backing the
// glass color below.
import "@workspace/liquid-ui/lib/glass"

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

type SolidColor = (typeof colors)[number]
// liquid-ui addition: a translucent frosted chip instead of a solid ramp
// step, for use over imagery/gradients where a tinted pill would look flat.
// Additive only -- every base-ui Color value keeps working unchanged.
type Color = SolidColor | "glass"

// Semantic names resolve to the WDS status ramps: success → emerald,
// warning → burnt orange, error → red, info → blue. The Radix scale names map
// to themselves. So a status pill can say color="success" and get the DS green.
const COLOR_RAMP: Record<SolidColor, string> = {
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

// Ported from @workspace/liquid-ui/Badge, plus color="glass": a liquid-ui-only
// translucent chip (frosted fill + hairline rim + light blur) sitting
// alongside the solid ramp colors. No `asChild` (Base UI has no Slot); wrap
// an <a> yourself if Badge needs to be a link.
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
  const isGlass = color === "glass"
  // Direct (non-aliased) check so `color` narrows to SolidColor without
  // relying on isGlass being recognized as an equivalent discriminant.
  const ramp = color === "glass" ? undefined : COLOR_RAMP[color]

  return (
    <span
      data-slot="badge"
      className={cn(
        badgeVariants({ size }),
        // Glass chip: legible translucent plate + hairline rim + a light
        // blur -- deliberately subtle (a chip earns a soft fill, not a full
        // glass-overlay panel treatment).
        isGlass &&
          "text-gray-12 border border-[var(--glass-rim)] bg-[var(--glass-overlay-bg)] backdrop-blur-sm",
        className
      )}
      // WDS pill: borderless, soft tinted ground (step 3) + readable ink text
      // (step 11). No outline — the calm capsule reads as a status, not a chip.
      style={
        isGlass
          ? undefined
          : { backgroundColor: `var(--${ramp}-3)`, color: `var(--${ramp}-11)` }
      }
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
