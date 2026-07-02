import type { ReactNode } from "react"
import { Card } from "@workspace/ui/components/Card"
import { cn } from "@workspace/ui/lib/utils"

export interface KpiStatTileProps {
  /** Short label, rendered uppercase (e.g. "Active", "In review"). */
  label: string
  /** Primary value — already formatted by the caller (e.g. "42", "—", "…"). */
  value: ReactNode
  /** Optional secondary line under the value (amount spent, trend, etc.). */
  secondary?: ReactNode
  /**
   * When provided, the tile renders as a selectable button and `aria-pressed`
   * reflects `selected`. When omitted, the tile is a static, non-interactive
   * card (used for read-only blocks like paid / published-this-month).
   */
  onSelect?: () => void
  selected?: boolean
  className?: string
}

/**
 * Generic KPI partition tile — a single implementation shared by the
 * Organizations › Campaigns tab (selectable filter tiles) and the dashboard
 * campaign widgets, so there is no duplicated tile code.
 *
 * Presentational: callers resolve i18n/formatting and pass strings in. The
 * selectable affordance (button + `aria-pressed` + selected ring) is opt-in
 * via `onSelect`, preserving the Campaigns-tab selection + filter→KPI
 * coherence behaviour.
 *
 * See .plan/dashboard-redesign/01-spec.md §Slice 2.
 */
export function KpiStatTile({
  label,
  value,
  secondary,
  onSelect,
  selected = false,
  className,
}: KpiStatTileProps) {
  // Interactive affordance only applies to the selectable (button) variant.
  const selectableClasses = selected
    ? "border-accent-9 ring-accent-7 ring-1"
    : "hover:border-gray-7"

  const card = (
    <Card
      className={cn(
        "gap-1 py-4 transition-colors",
        onSelect && selectableClasses,
        className
      )}
    >
      <div className="px-5">
        <p className="text-gray-11 text-[11px] font-semibold tracking-wider uppercase">
          {label}
        </p>
      </div>
      <div className="px-5">
        <p className="text-gray-12 text-2xl font-bold tabular-nums">{value}</p>
        {secondary != null ? secondary : null}
      </div>
    </Card>
  )

  if (!onSelect) {
    return card
  }

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className="block w-full text-left"
    >
      {card}
    </button>
  )
}
