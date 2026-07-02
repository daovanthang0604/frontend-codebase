import type { ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"

// Canonical chrome for every full-width CRM page. Owns the outer gutter
// (`p-5`), the centering (`mx-auto`), the `max-w-7xl` content cap, the title +
// optional description block, and the right-side actions slot. Every listing /
// detail / dashboard page in the CRM consumes this — see
// apps/dashboard/CLAUDE.md "Page layout" rule.
//
// Why this exists: before the shell, every page hand-rolled
// `<div className="mx-auto space-y-6 p-5">` + `<h1 className="text-gray-12
// text-2xl font-bold">…</h1>` + paragraph. One outlier
// (IntegrationsLayout) added `max-w-5xl`, which centered Datasources at a
// narrower width than every other page — visible as an inconsistent left
// gutter. Centralising the chrome here makes that drift impossible.
//
// Width policy: the recessed `bg-gray-2` canvas fills 100% of its parent, but
// the floating content card is centered (`mx-auto`) and capped at `max-w-7xl`
// (1280px) so page content stops stretching edge-to-edge on wide monitors. The
// cap lives HERE, in one place, so every page caps identically — no per-page
// `max-w-*` drift like the old IntegrationsLayout `max-w-5xl` that motivated
// centralising this chrome. Pages that need an even narrower column wrap their
// own inner `mx-auto max-w-*` around the CONTENT, inside the 7xl card.
//
// Surface: the shell paints a recessed `bg-gray-2` canvas and floats the
// content as an inset `bg-gray-1` rounded card (border + shadow), so standard
// pages lift off the chrome instead of reading as one flat gray field — it
// reuses the existing sidebar (gray-2) / content (gray-1) tonal relationship.
// Full-bleed pages (Discover, CampaignPreview, status, persona-greeting Home)
// are exempt from PageShell, so they keep their edge-to-edge surface.
export interface PageShellProps {
  /** The h1 text. Pages should pass a translated string. */
  title: ReactNode
  /**
   * Optional uppercase eyebrow / kicker rendered above the title — the WDS
   * PageHeader recipe (e.g. "Management", "Workspace"). Omit for no kicker.
   */
  eyebrow?: ReactNode
  /** Optional subtitle / explanation paragraph below the title. */
  description?: ReactNode
  /**
   * Optional icon rendered inline next to the title. Sized to match the h1
   * (size-6); pass a lucide icon directly — the shell handles sizing /
   * `aria-hidden`. Use sparingly; most pages don't need one.
   */
  icon?: ReactNode
  /**
   * Right-side action region (typically one or two Buttons). Wraps in a
   * `flex flex-wrap gap-2`; when absent, the header is single-column.
   */
  actions?: ReactNode
  /**
   * Layout variant.
   *   - "default" (most pages): auto-height, vertical stack with `space-y-6`.
   *     Body scrolls naturally. Used by Users, Organizations, Transactions,
   *     Billing, Integrations/Datasources, etc.
   *   - "fill": viewport-fill, `flex flex-1 flex-col gap-6`. Used by pages
   *     where the body needs to fill the remaining viewport height
   *     (Campaigns, GamDashboard, Integrations/index).
   */
  variant?: "default" | "fill"
  /**
   * Optional className applied to the outer container — for one-off tweaks
   * (e.g. an inner-page max-width). Prefer the variant prop when possible.
   */
  className?: string
  children: ReactNode
}

export function PageShell({
  title,
  eyebrow,
  description,
  icon,
  actions,
  variant = "default",
  className,
  children,
}: PageShellProps) {
  const hasActions = actions != null
  const hasIcon = icon != null

  return (
    <div
      className={cn(
        "bg-gray-2 p-2 md:p-3",
        variant === "fill" ? "flex h-full flex-col" : "min-h-full"
      )}
    >
      <div
        className={cn(
          "border-gray-a4 bg-gray-1 mx-auto flex w-full max-w-7xl flex-col overflow-hidden rounded-xl border shadow-sm",
          variant === "fill" ? "min-h-0 flex-1" : null,
          className
        )}
      >
        {/* WDS page-header band (flat variant): the title region is set apart
            from the body by a hairline base only — no accent wash. This is the
            DS PageHeader `tint={false}` recipe, in line with our calmer
            de-card direction. */}
        <div
          className={cn(
            "border-gray-a5 flex flex-wrap items-start gap-4 border-b px-5 pt-6 pb-5",
            hasActions ? "justify-between" : null
          )}
        >
          <div className="space-y-1.5">
            {eyebrow != null ? (
              <p className="text-gray-10 text-[11px] font-semibold tracking-[0.08em] uppercase">
                {eyebrow}
              </p>
            ) : null}
            <div className="space-y-1">
              <h1
                className={cn(
                  // WDS editorial page title: Lora serif display (font-serif +
                  // the display-md token carries 24px / 1.15 / 700).
                  "text-gray-12 text-display-md font-serif",
                  hasIcon ? "flex items-center gap-3" : null
                )}
              >
                {hasIcon ? (
                  <span
                    aria-hidden
                    className="text-accent-11 bg-accent-a3 ring-accent-a5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset [&>svg]:size-5"
                  >
                    {icon}
                  </span>
                ) : null}
                {title}
              </h1>
              {description != null &&
                // Real <p> for plain-string descriptions so screen readers
                // announce paragraph navigation; fall back to <div> for
                // ReactNode descriptions (e.g. <SkeletonWrapper>) since <p>
                // can't contain block elements. Capped at max-w-2xl for
                // reading-line length; the title stays uncapped.
                (typeof description === "string" ? (
                  <p className="text-gray-11 max-w-2xl text-sm leading-relaxed">
                    {description}
                  </p>
                ) : (
                  <div className="text-gray-11 max-w-2xl text-sm leading-relaxed">
                    {description}
                  </div>
                ))}
            </div>
          </div>
          {hasActions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>

        {/* Page body — the scrolling content column below the band. */}
        <div
          className={cn(
            variant === "fill"
              ? "flex min-h-0 flex-1 flex-col gap-6 p-5"
              : "space-y-6 p-5"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
