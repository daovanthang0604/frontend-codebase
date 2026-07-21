import type { ReactNode } from "react"
import { cn } from "@workspace/liquid-ui/lib/utils"
import { Check, Plane } from "lucide-react"

// Shared chrome for the Skyway demo routes (/flights select + /booking review):
// the checkout step bar, the airline monogram, the airline registry, the
// numbered serif section head, and the dotted flight arc. Demo-only app
// components composed from liquid-ui conventions — not part of the kit itself.
// "Skyway" is the booking PLATFORM; the tickets it sells carry each carrier's
// own identity via <Monogram code color>.

const steps = ["Search", "Select", "Review", "Payment"]

export interface Airline {
  name: string
  /** Flight-number prefix, also the monogram letters. */
  code: string
  /** Brand hue for the monogram tile (any CSS color; oklch here). */
  color: string
}

// Demo carriers on the Hanoi → Phu Quoc route. Colors are brand-adjacent, not
// official palettes.
export const airlines = {
  vn: {
    name: "Vietnam Airlines",
    code: "VN",
    color: "oklch(0.52 0.11 245)",
  },
  vj: { name: "VietJet Air", code: "VJ", color: "oklch(0.55 0.2 27)" },
  qh: { name: "Bamboo Airways", code: "QH", color: "oklch(0.6 0.13 150)" },
  sp: {
    name: "Sun PhuQuoc Airways",
    code: "SP",
    color: "oklch(0.68 0.15 55)",
  },
} satisfies Record<string, Airline>

export function StepBar({ current }: { current: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-2">
      {steps.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "font-num grid size-6 place-items-center rounded-full text-[11px] font-medium tabular-nums transition",
                done && "bg-accent-9 text-accent-contrast",
                active &&
                  "border-accent-8 text-accent-11 bg-accent-a2 border shadow-[0_0_0_3px_var(--accent-a4)]",
                !done && !active && "border-gray-a6 text-gray-11 border"
              )}
            >
              {done ? <Check className="size-3.5" /> : i + 1}
            </span>
            <span
              className={cn(
                "text-ui-sm",
                active ? "text-gray-12 font-medium" : "text-gray-11"
              )}
            >
              {label}
            </span>
            {i < steps.length - 1 ? (
              <span
                aria-hidden
                className="mx-1 h-px w-8"
                style={{
                  background:
                    "linear-gradient(90deg, var(--gray-a6), transparent)",
                }}
              />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}

/**
 * Airline monogram — a brand-tinted glass tile in place of a generic avatar
 * circle. With no `color` it renders in the platform accent ("SK" = Skyway);
 * pass an Airline's code+color to carry that carrier's identity. The brand
 * hue is mixed toward black/white per mode so the letters stay readable on
 * the translucent tile in both light and dark.
 */
export function Monogram({
  code = "SK",
  color,
  className,
}: {
  code?: string
  color?: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "text-ui-sm grid size-10 shrink-0 place-items-center rounded-2xl border font-semibold tracking-wide",
        !color && "border-accent-a5 bg-accent-a3 text-accent-11",
        className
      )}
      style={
        color
          ? {
              borderColor: `color-mix(in oklch, ${color} 40%, transparent)`,
              backgroundColor: `color-mix(in oklch, ${color} 16%, transparent)`,
              color: `light-dark(color-mix(in oklch, ${color} 78%, black), color-mix(in oklch, ${color} 52%, white))`,
            }
          : undefined
      }
    >
      {code}
    </span>
  )
}

/** Editorial section head — numbered in Space Grotesk, titled in serif, ruled off. */
export function SectionHeading({
  index,
  title,
  action,
}: {
  index: string
  title: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-num text-ui-xs text-accent-11 tabular-nums">
        {index}
      </span>
      <h2 className="text-gray-12 text-display-sm font-serif">{title}</h2>
      <span
        aria-hidden
        className="h-px flex-1"
        style={{
          background: "linear-gradient(90deg, var(--gray-a6), transparent)",
        }}
      />
      {action}
    </div>
  )
}

/** The dotted flight arc — drifting dashes, endpoint dots, plane at the apex. */
export function RouteArc({
  duration,
  caption,
}: {
  duration: string
  caption: string
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1 px-2 pb-1 sm:px-4">
      <span className="text-gray-11 font-mono text-[10px] tracking-[0.2em] uppercase">
        {duration}
      </span>
      <div className="relative w-full max-w-[230px]">
        <svg viewBox="0 0 200 44" fill="none" className="w-full" aria-hidden>
          <path
            d="M4 40 Q100 -16 196 40"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="0.5 7"
            className="route-arc-dash text-gray-a8"
          />
          <circle cx="4" cy="40" r="2" className="fill-accent-9" />
          <circle cx="196" cy="40" r="2" className="fill-accent-9" />
        </svg>
        <span className="border-accent-a6 text-accent-11 bg-accent-a2 absolute top-0 left-1/2 grid size-7 -translate-x-1/2 place-items-center rounded-full border backdrop-blur-sm">
          <Plane className="size-3.5 rotate-45" />
        </span>
      </div>
      <span className="text-gray-11 font-mono text-[10px] tracking-[0.2em] uppercase">
        {caption}
      </span>
    </div>
  )
}
