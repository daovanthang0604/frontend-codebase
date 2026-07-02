import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

// WDS Eyebrow - the uppercase kicker label above a heading
// (packages/ui/design-system/components/core/Eyebrow). Adapted to our stack: the
// `icon` is a ReactNode (e.g. a Lucide glyph), not a Material Symbols name, and the
// label styling rides the shared `text-eyebrow` type token (11px / 700 / 0.1em).
const eyebrowTone = {
  accent: "text-accent-11",
  muted: "text-gray-10",
  faint: "text-gray-9",
} as const

interface EyebrowProps extends React.ComponentProps<"div"> {
  /** @default "muted" */
  tone?: keyof typeof eyebrowTone
  /** Optional leading icon (e.g. a Lucide glyph), sized to the label. */
  icon?: React.ReactNode
}

function Eyebrow({
  className,
  tone = "muted",
  icon,
  children,
  ...props
}: EyebrowProps) {
  return (
    <div
      data-slot="eyebrow"
      className={cn(
        "text-eyebrow inline-flex items-center gap-1.5 font-sans uppercase",
        eyebrowTone[tone],
        className
      )}
      {...props}
    >
      {icon ? (
        <span className="inline-flex [&>svg]:size-3.5">{icon}</span>
      ) : null}
      {children}
    </div>
  )
}

export { Eyebrow }
export type { EyebrowProps }
