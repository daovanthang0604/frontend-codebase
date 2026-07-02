"use client"

import { useRef, useState } from "react"
import { Popover, PopoverDialog } from "@workspace/ui/components/Popover"
import { Separator } from "@workspace/ui/components/Separator"
import { cn } from "@workspace/ui/lib/utils"
import dayjs from "dayjs"
import { ChevronDown } from "lucide-react"

import { useFilterContext } from "../Filter.store"
import type { DateFilterMode, DateModeFilterValue } from "../Filter.types"

const MODE_LABEL: Record<DateFilterMode, string> = {
  to: "To",
  from: "From",
  range: "Range",
}

function normalizeDateValue(value: unknown): DateModeFilterValue | null {
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
    const from = fromRaw ? new Date(fromRaw as any) : undefined
    const to = toRaw ? new Date(toRaw as any) : undefined

    return {
      mode: "range",
      from,
      to,
    }
  }

  if (value instanceof Date || typeof value === "string") {
    const d = new Date(value as any)
    return {
      mode: "to",
      to: d,
    }
  }

  return null
}

export function DateModeRowValue({
  value,
  field,
}: {
  value: unknown
  field: string
}) {
  const { setFieldValue } = useFilterContext()
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLSpanElement>(null)

  const v = normalizeDateValue(value)
  const mode: DateFilterMode = v?.mode ?? "to"

  const applyMode = (next: DateFilterMode) => {
    const base: DateModeFilterValue =
      v ??
      ({
        mode: next,
      } as DateModeFilterValue)

    let nextValue: DateModeFilterValue
    const today = dayjs().endOf("day").toDate()

    if (next === "from") {
      const existingDate = base.from ?? base.to
      nextValue = {
        mode: "from",
        from: existingDate,
        to: undefined,
      }
    } else if (next === "to") {
      const existingDate = base.to ?? base.from
      nextValue = {
        mode: "to",
        from: undefined,
        to: existingDate,
      }
    } else {
      const existingDate = base.from ?? base.to
      if (existingDate) {
        nextValue = {
          mode: "range",
          from: dayjs(existingDate).startOf("day").toDate(),
          to: today,
          preset: base.preset,
        }
      } else {
        nextValue = {
          mode: "range",
          from: base.from,
          to: base.to ?? today,
          preset: base.preset,
        }
      }
    }

    setFieldValue(field, nextValue)
    setIsOpen(false)
  }

  const label = MODE_LABEL[mode]
  const text = formatDateFilterValue(value)
  const hasPreset = !!v?.preset

  return (
    <>
      <>
        <span
          ref={triggerRef}
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(true)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              e.stopPropagation()
              setIsOpen(true)
            }
          }}
          className={cn(
            "inline-flex items-center gap-0.5 rounded-sm py-0.5 pr-1.5 pl-2",
            "text-gray-12 cursor-pointer bg-transparent",
            "hover:bg-gray-5 focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none"
          )}
        >
          <span className="capitalize">{label}</span>
          <ChevronDown className="size-3" aria-hidden />
        </span>
        <Separator
          orientation="vertical"
          className="bg-gray-6 mx-2.5 h-4 w-px"
        />
      </>

      <span className="text-gray-12">{text}</span>

      <Popover
        triggerRef={triggerRef}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        placement="bottom start"
        className="overflow-hidden rounded-lg"
      >
        <PopoverDialog className="bg-gray-2 min-w-[140px] p-1">
          <ModeItem
            active={mode === "from"}
            onClick={(e) => {
              e.stopPropagation()
              applyMode("from")
            }}
          >
            <span>From</span>
          </ModeItem>
          <ModeItem
            active={mode === "to"}
            onClick={(e) => {
              e.stopPropagation()
              applyMode("to")
            }}
          >
            <span>To</span>
          </ModeItem>
          <ModeItem
            active={mode === "range"}
            onClick={(e) => {
              e.stopPropagation()
              applyMode("range")
            }}
          >
            <span>Range</span>
          </ModeItem>
        </PopoverDialog>
      </Popover>
    </>
  )
}

function ModeItem({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: React.ReactNode
  onClick: React.MouseEventHandler<HTMLButtonElement>
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-gray-12 flex w-full items-center rounded-md px-2 py-1 text-xs",
        "hover:bg-gray-3 transition-colors",
        active && "bg-gray-4"
      )}
    >
      {children}
    </button>
  )
}

function formatDateFilterValue(raw: unknown): string {
  const v = normalizeDateValue(raw)
  if (!v) return "Any time"

  const fmt = (d?: Date) => (d ? dayjs(d).format("MMM D, YYYY") : "—")

  const fmtRange = (from?: Date, to?: Date) => {
    if (!from || !to) return `${fmt(from)} - ${fmt(to)}`

    const fromYear = dayjs(from).year()
    const toYear = dayjs(to).year()

    if (fromYear === toYear) {
      return `${dayjs(from).format("MMM D")} - ${dayjs(to).format("MMM D, YYYY")}`
    }
    return `${fmt(from)} - ${fmt(to)}`
  }

  if (v.preset && v.from && v.to) {
    return fmtRange(v.from, v.to)
  }

  switch (v.mode) {
    case "from":
      return fmt(v.from)
    case "to":
      return fmt(v.to)
    case "range":
    default:
      return fmtRange(v.from, v.to)
  }
}
