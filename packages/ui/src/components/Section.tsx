import * as React from "react"
import { Eyebrow } from "@workspace/ui/components/Eyebrow"
import { cn } from "@workspace/ui/lib/utils"

// WDS Section - the de-card container: a titled region with generous space and an
// optional hairline rule under the header, but NO box (no background, border, shadow
// or radius). Reach for this instead of a Card whenever content doesn't need to read
// as a separate, liftable object - grouping by whitespace + one hairline is what
// keeps a page calm instead of busy. Title is Lora (display-sm).
// (packages/ui/design-system/components/layout/Section)
interface SectionProps extends Omit<React.ComponentProps<"section">, "title"> {
  /** Lora section title. */
  title?: React.ReactNode
  /** Small uppercase kicker above the title. */
  eyebrow?: React.ReactNode
  /** Quiet text beside the title, e.g. "vs last month". */
  meta?: React.ReactNode
  /** Right-aligned header controls (buttons, links, a SegmentedControl). */
  actions?: React.ReactNode
  /** Hairline rule under the header. @default true */
  divider?: boolean
  /** Heading element level for the title. @default 2 */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  /** Space between header and content (px). @default 18 */
  gap?: number
}

function Section({
  title,
  eyebrow,
  meta,
  actions,
  divider = true,
  headingLevel = 2,
  gap = 18,
  className,
  children,
  style,
  ...props
}: SectionProps) {
  const Heading = `h${headingLevel}` as React.ElementType
  const hasHeader = title || eyebrow || meta || actions

  return (
    <section data-slot="section" className={className} style={style} {...props}>
      {hasHeader ? (
        <header
          className={cn(
            "flex items-end justify-between gap-4",
            divider ? "border-gray-a6 border-b pb-3" : null
          )}
          style={{ marginBottom: divider ? gap : Math.max(gap - 6, 8) }}
        >
          <div className="flex min-w-0 flex-col gap-1.5">
            {eyebrow ? <Eyebrow tone="faint">{eyebrow}</Eyebrow> : null}
            {title ? (
              <div className="flex flex-wrap items-baseline gap-2.5">
                <Heading className="text-gray-12 text-display-sm m-0 font-serif">
                  {title}
                </Heading>
                {meta ? (
                  <span className="text-gray-10 font-sans text-[13px]">
                    {meta}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  )
}

export { Section }
export type { SectionProps }
