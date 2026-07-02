import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

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

function Badge({
  className,
  asChild = false,
  color = "accent",
  size = "md",
  dot = false,
  children,
  ...props
}: React.ComponentProps<"span"> & {
  asChild?: boolean
  color?: Color
  /** Leading status dot in the text colour (e.g. "• Active"). Ignored with asChild. */
  dot?: boolean
} & BadgeVariantProps) {
  const Comp = asChild ? Slot : "span"
  const ramp = COLOR_RAMP[color]

  return (
    <Comp
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
      {dot && !asChild ? (
        <span className="size-1.5 shrink-0 rounded-full bg-current" />
      ) : null}
      {children}
    </Comp>
  )
}

export { Badge, badgeVariants }
export type { BadgeVariantProps }
