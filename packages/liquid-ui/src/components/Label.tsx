"use client"

import type { ComponentProps } from "react"
import { cva } from "class-variance-authority"

import { cn } from "@workspace/liquid-ui/lib/utils"

// Ported from @workspace/liquid-ui/Label. `labelVariants` is reused by other base-ui
// primitives (e.g. Checkbox). The `tooltip` variant of ui's Label pulls in
// Tooltip/Popover — deferred until those overlays migrate (most labels don't use
// it); `withAsterisk` is kept.
export const labelVariants = cva([
  // WDS field label: 12px / 600 / 0.04em tracking, muted ink.
  "text-gray-11 flex items-center gap-1 text-[12px] font-semibold tracking-[0.04em]",
  "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70",
])

interface LabelProps extends ComponentProps<"label"> {
  withAsterisk?: boolean
}

function Label({ children, className, withAsterisk, ...props }: LabelProps) {
  return (
    <label className={cn(labelVariants(), className)} {...props}>
      {children}
      {withAsterisk ? <span className="text-error-9"> *</span> : null}
    </label>
  )
}

export { Label }
