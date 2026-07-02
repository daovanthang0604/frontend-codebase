"use client"

import * as React from "react"
import {
  Popover,
  PopoverDialog,
  PopoverTrigger,
} from "@workspace/ui/components/Popover"
import { cn } from "@workspace/ui/lib/utils"
import { Check, ChevronDown, FilterX } from "lucide-react"
import { Button as AriaButton } from "react-aria-components"

// WDS FilterMenu - a filter-bar dropdown: a quiet pill trigger (label + an
// accent count badge once filtering) that opens a checklist popover. Multi-select
// by default and the popover stays open as you toggle; per-option counts and a
// Clear action. Pairs with SegmentedControl to build a calm filter bar above a
// table. (packages/ui/design-system/components/navigation/FilterMenu)

interface FilterMenuOption {
  value: string
  label: React.ReactNode
  /** Optional match count shown right-aligned in tabular figures. */
  count?: number
}

interface FilterMenuProps {
  /** Pill label, e.g. "Role" / "Status". */
  label: string
  /** Optional leading icon (a Lucide glyph). */
  icon?: React.ReactNode
  /** Options as bare strings or `{ value, label, count }`. */
  options: Array<string | FilterMenuOption>
  /** Controlled selection (array of values). */
  value?: string[]
  onChange?: (values: string[]) => void
  /** Single-select (closes on pick) when false. @default true */
  multiple?: boolean
  /** Which edge the popover aligns to the trigger. @default "start" */
  align?: "start" | "end"
  /** Popover min-width (px). @default 224 */
  width?: number
  className?: string
}

function FilterMenu({
  label,
  icon,
  options,
  value = [],
  onChange,
  multiple = true,
  align = "start",
  width = 224,
  className,
}: FilterMenuProps) {
  const [open, setOpen] = React.useState(false)
  const opts = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  )
  const selected = new Set(value)
  const active = selected.size > 0

  const toggle = (v: string) => {
    if (!onChange) return
    if (multiple) {
      const next = new Set(selected)
      if (next.has(v)) next.delete(v)
      else next.add(v)
      onChange(opts.map((o) => o.value).filter((x) => next.has(x)))
    } else {
      onChange(selected.has(v) ? [] : [v])
      setOpen(false)
    }
  }

  return (
    <PopoverTrigger isOpen={open} onOpenChange={setOpen}>
      <AriaButton
        aria-label={label}
        data-active={active || undefined}
        className={cn(
          "inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-[13px] outline-none",
          "transition-[color,background-color,border-color,transform] motion-safe:active:translate-y-px",
          "data-[focus-visible]:ring-ring data-[focus-visible]:ring-2",
          active
            ? "border-accent-8 bg-accent-3 text-accent-12 font-bold"
            : "border-gray-a6 bg-panel text-gray-12 hover:bg-gray-2 font-semibold",
          !active && open && "border-accent-8",
          className
        )}
      >
        {icon ? (
          <span
            aria-hidden
            className={cn(
              "inline-flex [&>svg]:size-4",
              active ? "text-accent-12" : "text-gray-10"
            )}
          >
            {icon}
          </span>
        ) : null}
        {label}
        {active ? (
          <span className="bg-accent-solid text-accent-contrast inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[11px] font-bold tabular-nums">
            {selected.size}
          </span>
        ) : null}
        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 opacity-60 transition-transform",
            open && "rotate-180"
          )}
        />
      </AriaButton>

      <Popover placement={align === "end" ? "bottom end" : "bottom start"}>
        <PopoverDialog
          aria-label={label}
          className="p-1.5"
          style={{ minWidth: width }}
        >
          {/* Cap height so long lists (e.g. up to 100 orgs) scroll instead of
              overflowing the viewport; min(…,vh) keeps it from cropping on
              short screens. react-aria still flips the popover above the
              trigger when there's more room there. */}
          <div role="menu" className="max-h-[min(70vh,28rem)] overflow-y-auto">
            {opts.map((o) => {
              const on = selected.has(o.value)
              return (
                <button
                  key={o.value}
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={on}
                  onClick={() => toggle(o.value)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-sm px-2.5 py-2 text-left text-[13px] font-semibold",
                    "text-gray-12 hover:bg-gray-3 transition-colors outline-none",
                    "focus-visible:bg-gray-3"
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "inline-flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors",
                      on
                        ? "bg-accent-solid border-accent-solid text-accent-contrast"
                        : "border-gray-7 bg-panel"
                    )}
                  >
                    {on ? <Check className="size-3.5" strokeWidth={3} /> : null}
                  </span>
                  <span className="min-w-0 flex-1">{o.label}</span>
                  {o.count != null ? (
                    <span className="text-gray-10 text-xs font-bold tabular-nums">
                      {o.count}
                    </span>
                  ) : null}
                </button>
              )
            })}

            {active ? (
              <>
                <div className="bg-gray-a5 mx-1 my-1.5 h-px" />
                <button
                  type="button"
                  onClick={() => onChange?.([])}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-sm px-2.5 py-2 text-left text-[13px] font-semibold",
                    "text-gray-11 hover:bg-gray-3 transition-colors outline-none"
                  )}
                >
                  <FilterX className="size-4" />
                  Clear {label.toLowerCase()}
                </button>
              </>
            ) : null}
          </div>
        </PopoverDialog>
      </Popover>
    </PopoverTrigger>
  )
}

export { FilterMenu }
export type { FilterMenuProps, FilterMenuOption }
