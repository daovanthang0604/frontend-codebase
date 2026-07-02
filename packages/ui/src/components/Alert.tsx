"use client"

import type { ComponentProps } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

// WDS Alert — an inline callout. A calm tinted panel per intent with an optional
// leading icon, title, and body. Pair with <AlertTitle> / <AlertDescription>.
const alertVariants = cva(
  "relative flex w-full gap-3 rounded-lg border px-4 py-3 text-sm [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:translate-y-0.5",
  {
    variants: {
      variant: {
        default: "bg-gray-2 border-gray-6 text-gray-12 [&>svg]:text-gray-11",
        info: "bg-blue-3 border-blue-6 text-blue-11 [&>svg]:text-blue-11",
        success:
          "bg-success-3 border-success-6 text-success-11 [&>svg]:text-success-11",
        warning:
          "bg-warning-3 border-warning-6 text-warning-11 [&>svg]:text-warning-11",
        error: "bg-error-3 border-error-7 text-error-11 [&>svg]:text-error-11",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

interface AlertProps
  extends ComponentProps<"div">,
    VariantProps<typeof alertVariants> {
  /** Optional leading icon (e.g. a lucide glyph). */
  icon?: React.ReactNode
}

function Alert({ className, variant, icon, children, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {icon}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

function AlertTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("mb-0.5 font-semibold", className)} {...props} />
  )
}

function AlertDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p className={cn("text-current/80 leading-relaxed", className)} {...props} />
  )
}

export { Alert, AlertTitle, AlertDescription, alertVariants }
export type { AlertProps }
