"use client"

import { useState, type ReactNode } from "react"
import { Button } from "@workspace/liquid-ui/components/Button"
import { Calendar, type DateRange } from "@workspace/liquid-ui/components/Calendar"
import { Separator } from "@workspace/liquid-ui/components/Separator"
import { cn } from "@workspace/liquid-ui/lib/utils"
import dayjs from "dayjs"
import { ChevronLeft, ChevronRight } from "lucide-react"

import {
  useFilterContext,
  useFilterItem,
  useFilterItemClose,
} from "../Filter.store"
import type { DateFilterPreset, DateModeFilterValue } from "../Filter.types"

// Base UI menu parts need a parent Menu context, which isn't present in row mode
// (the field renders inside a Popover). So — unlike ui's submenu flyouts — this
// is a self-contained panel with an internal view switch that works in both the
// builder submenu and the row popover.
type View = "menu" | "from" | "to" | "range"

function normalizeValue(value: unknown): DateModeFilterValue | null {
  if (value == null) return null

  if (typeof value === "object" && !Array.isArray(value) && "mode" in value) {
    const v = value as DateModeFilterValue
    return {
      ...v,
      from: v.from ? new Date(v.from) : undefined,
      to: v.to ? new Date(v.to) : undefined,
    }
  }

  if (Array.isArray(value) && value.length === 2) {
    const [fromRaw, toRaw] = value
    return {
      mode: "range",
      from: fromRaw ? new Date(fromRaw as string | number | Date) : undefined,
      to: toRaw ? new Date(toRaw as string | number | Date) : undefined,
    }
  }

  return null
}

export function FilterDateMode() {
  const { value, setFieldValue } = useFilterContext()
  const item = useFilterItem()
  const field = item?.field

  if (!field) {
    throw new Error("FilterDateMode must be used within a FilterItemProvider")
  }

  const onClose = useFilterItemClose()
  const current = normalizeValue(value[field])
  const [view, setView] = useState<View>("menu")

  const commit = (next: DateModeFilterValue | undefined) => {
    setFieldValue(field, next)
    onClose?.()
  }

  const applyPreset = (preset: DateFilterPreset) => {
    const today = dayjs()
    let start: dayjs.Dayjs
    let end: dayjs.Dayjs
    switch (preset) {
      case "lastWeek":
        start = today.startOf("week").subtract(1, "week")
        end = start.endOf("week")
        break
      case "thisWeek":
        start = today.startOf("week")
        end = today.endOf("week")
        break
      case "thisMonth":
        start = today.startOf("month")
        end = today.endOf("month")
        break
    }
    commit({
      mode: "range",
      from: start.startOf("day").toDate(),
      to: end.endOf("day").toDate(),
      preset,
    })
  }

  if (view === "from") {
    return (
      <SingleView
        title="From date"
        initial={current?.mode === "from" ? current.from : undefined}
        onBack={() => setView("menu")}
        onSelect={(date) =>
          commit({ mode: "from", from: dayjs(date).startOf("day").toDate() })
        }
      />
    )
  }

  if (view === "to") {
    return (
      <SingleView
        title="To date"
        initial={current?.mode === "to" ? current.to : undefined}
        onBack={() => setView("menu")}
        onSelect={(date) =>
          commit({ mode: "to", to: dayjs(date).endOf("day").toDate() })
        }
      />
    )
  }

  if (view === "range") {
    const initial =
      current?.mode === "range" && current.from && current.to
        ? { from: current.from, to: current.to }
        : undefined
    return (
      <RangeView
        initial={initial}
        onBack={() => setView("menu")}
        onApply={(from, to) => commit({ mode: "range", from, to })}
      />
    )
  }

  return (
    <div className="min-w-[220px] p-1.5">
      <PanelItem onClick={() => setView("from")} chevron>
        From date
      </PanelItem>
      <PanelItem onClick={() => setView("to")} chevron>
        To date
      </PanelItem>
      <PanelItem onClick={() => setView("range")} chevron>
        Custom date
      </PanelItem>

      <Separator className="bg-gray-a5 my-1" />

      <PanelItem onClick={() => applyPreset("lastWeek")}>Last week</PanelItem>
      <PanelItem onClick={() => applyPreset("thisWeek")}>This week</PanelItem>
      <PanelItem onClick={() => applyPreset("thisMonth")}>This month</PanelItem>
    </div>
  )
}

function PanelItem({
  children,
  onClick,
  chevron,
}: {
  children: ReactNode
  onClick: () => void
  chevron?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-gray-12 flex w-full cursor-pointer items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm font-medium outline-none",
        "hover:bg-gray-3 focus-visible:bg-gray-3 transition-colors"
      )}
    >
      {children}
      {chevron && <ChevronRight className="text-gray-11 ml-auto size-4" />}
    </button>
  )
}

function PanelHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="border-gray-6 flex items-center gap-1 border-b p-1.5">
      <Button
        mode="icon"
        size="xs"
        variant="ghost"
        intent="secondary"
        onClick={onBack}
        aria-label="Back"
      >
        <ChevronLeft className="size-4" />
      </Button>
      <span className="text-gray-12 text-sm font-medium">{title}</span>
    </div>
  )
}

function SingleView({
  title,
  initial,
  onBack,
  onSelect,
}: {
  title: string
  initial?: Date
  onBack: () => void
  onSelect: (date: Date) => void
}) {
  return (
    <div className="min-w-[280px]">
      <PanelHeader title={title} onBack={onBack} />
      <Calendar
        mode="single"
        selected={initial}
        onSelect={(date) => date && onSelect(date)}
        className="w-full p-2"
      />
    </div>
  )
}

function RangeView({
  initial,
  onBack,
  onApply,
}: {
  initial?: { from: Date; to: Date }
  onBack: () => void
  onApply: (from: Date, to: Date) => void
}) {
  const [draft, setDraft] = useState<DateRange | undefined>(initial)

  return (
    <div className="min-w-[280px]">
      <PanelHeader title="Custom range" onBack={onBack} />
      <Calendar
        mode="range"
        selected={draft}
        onSelect={setDraft}
        className="w-full p-2"
      />
      <div className="border-gray-6 flex justify-center border-t p-2">
        <Button
          size="sm"
          variant="ghost"
          intent="primary"
          isDisabled={!draft?.from || !draft?.to}
          onClick={() => {
            if (!draft?.from || !draft?.to) return
            onApply(
              dayjs(draft.from).startOf("day").toDate(),
              dayjs(draft.to).endOf("day").toDate()
            )
          }}
        >
          Apply
        </Button>
      </div>
    </div>
  )
}
