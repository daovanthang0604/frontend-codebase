"use client"

import type { ComponentProps, ReactNode } from "react"
import { cn } from "@workspace/liquid-ui/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

import "@workspace/liquid-ui/lib/glass"

// Drop-in for @workspace/liquid-ui/Alert: same callout shape (leading icon +
// title/description body), rebuilt with a liquid-glass surface. `glass-overlay`
// swaps in the frosted-glass material (fill + blur + rim + sheen + shadow) in
// place of the solid `bg-<x>-3 border-<x>-6` pair the base-ui version used per
// variant - but it sets `background` and `border` as UNLAYERED rules, which
// beat a Tailwind `bg-<color>` / `border-<color>` utility on the same element
// no matter the source order, so those two properties can no longer carry the
// severity signal here. Severity survives through two channels the glass swap
// never touches instead: the icon color (unchanged from base-ui) and a colored
// left accent bar rendered as its own element - a sibling next to the glass
// fill, not a competing property on it, so it can't lose that cascade fight.
const alertVariants = cva(
  "glass-overlay relative flex w-full gap-3 rounded-lg py-3 pr-4 pl-5 text-sm [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:translate-y-0.5",
  {
    variants: {
      variant: {
        default: "text-gray-12 [&>svg]:text-gray-11",
        info: "text-blue-11 [&>svg]:text-blue-11",
        success: "text-success-11 [&>svg]:text-success-11",
        warning: "text-warning-11 [&>svg]:text-warning-11",
        error: "text-error-11 [&>svg]:text-error-11",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

// The accent bar's fill per variant. A solid step-9 (vivid) swatch is fine here
// - unlike the callout surface, this sliver carries no translucency contract,
// it only has to read clearly against the frosted fill behind it.
const alertAccentVariants = cva("absolute inset-y-0 left-0 w-1 rounded-l-lg", {
  variants: {
    variant: {
      default: "bg-gray-7",
      info: "bg-blue-9",
      success: "bg-success-9",
      warning: "bg-warning-9",
      error: "bg-error-9",
    },
  },
  defaultVariants: { variant: "default" },
})

interface AlertProps
  extends ComponentProps<"div">,
    VariantProps<typeof alertVariants> {
  /** Optional leading icon (e.g. a lucide glyph). */
  icon?: ReactNode
}

function Alert({ className, variant, icon, children, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <span aria-hidden className={alertAccentVariants({ variant })} />
      {icon}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

function AlertTitle({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mb-0.5 font-semibold", className)} {...props} />
}

function AlertDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn("leading-relaxed text-current/80", className)}
      {...props}
    />
  )
}

export { Alert, AlertDescription, AlertTitle, alertVariants }
export type { AlertProps }
