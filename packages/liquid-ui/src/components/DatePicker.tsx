"use client"

import { useState } from "react"
import { Button } from "@workspace/liquid-ui/components/Button"
import {
  Calendar,
  type DateRange,
} from "@workspace/liquid-ui/components/Calendar"
import {
  Popover,
  PopoverDialog,
  PopoverTrigger,
} from "@workspace/liquid-ui/components/Popover"
import { cn } from "@workspace/liquid-ui/lib/utils"
import dayjs from "dayjs"
import { CalendarDays } from "lucide-react"

// Composed date fields for the base-ui kit — no new Base UI primitive. Both pair
// the Popover surface with the react-day-picker-backed Calendar and present a
// trigger styled like the Input control (bg-panel tray + hairline + accent focus
// halo). DatePicker commits on day-click; DateRangePicker drafts a range and
// commits on Apply.

// The Input-control look, ported to a plain <button> trigger.
const triggerClass = cn(
  "bg-panel border-gray-a7 text-gray-12 inline-flex h-9 w-full items-center gap-2 rounded-md border px-3 text-left text-sm transition-[box-shadow,border-color] duration-150 outline-none",
  "focus-visible:border-accent-8 focus-visible:ring-ring/30 focus-visible:ring-[3px]",
  "disabled:cursor-not-allowed disabled:opacity-60",
  "[&_svg]:text-gray-9 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
)

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  defaultValue?: Date
  placeholder?: string
  disabled?: boolean
  className?: string
}

function DatePicker({
  value,
  onChange,
  defaultValue,
  placeholder = "Pick a date",
  disabled,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  // Uncontrolled fallback: own the value internally when `value` isn't provided.
  const isControlled = value !== undefined
  const [internal, setInternal] = useState<Date | undefined>(defaultValue)
  const selected = isControlled ? value : internal

  const handleSelect = (date: Date | undefined) => {
    if (!isControlled) setInternal(date)
    onChange?.(date)
    setOpen(false)
  }

  return (
    <PopoverTrigger isOpen={open} onOpenChange={setOpen}>
      <button
        type="button"
        disabled={disabled}
        className={cn(triggerClass, className)}
      >
        <CalendarDays aria-hidden />
        <span className={cn("flex-1 truncate", !selected && "text-gray-8")}>
          {selected ? dayjs(selected).format("MMM D, YYYY") : placeholder}
        </span>
      </button>
      <Popover placement="bottom start">
        <PopoverDialog className="p-0">
          <Calendar mode="single" selected={selected} onSelect={handleSelect} />
        </PopoverDialog>
      </Popover>
    </PopoverTrigger>
  )
}

interface DateRangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  defaultValue?: DateRange
  placeholder?: string
  disabled?: boolean
  className?: string
}

function formatRange(range: DateRange | undefined, placeholder: string) {
  if (range?.from && range.to) {
    return `${dayjs(range.from).format("MMM D")} – ${dayjs(range.to).format("MMM D, YYYY")}`
  }
  if (range?.from) return dayjs(range.from).format("MMM D, YYYY")
  return placeholder
}

function DateRangePicker({
  value,
  onChange,
  defaultValue,
  placeholder = "Pick a range",
  disabled,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false)
  const isControlled = value !== undefined
  const [internal, setInternal] = useState<DateRange | undefined>(defaultValue)
  const committed = isControlled ? value : internal
  // The Calendar edits a draft; Apply commits it (mirrors the Filter date range).
  const [draft, setDraft] = useState<DateRange | undefined>(committed)

  const commit = (range: DateRange | undefined) => {
    if (!isControlled) setInternal(range)
    onChange?.(range)
  }

  const handleOpenChange = (next: boolean) => {
    // Re-seed the draft from the committed value whenever the popover opens.
    if (next) setDraft(committed)
    setOpen(next)
  }

  const handleApply = () => {
    commit(draft)
    setOpen(false)
  }

  const handleClear = () => {
    setDraft(undefined)
    commit(undefined)
  }

  return (
    <PopoverTrigger isOpen={open} onOpenChange={handleOpenChange}>
      <button
        type="button"
        disabled={disabled}
        className={cn(triggerClass, className)}
      >
        <CalendarDays aria-hidden />
        <span
          className={cn("flex-1 truncate", !committed?.from && "text-gray-8")}
        >
          {formatRange(committed, placeholder)}
        </span>
      </button>
      <Popover placement="bottom start">
        <PopoverDialog className="p-0">
          <Calendar mode="range" selected={draft} onSelect={setDraft} />
          <div className="border-gray-6 flex justify-end gap-2 border-t px-3 py-2">
            <Button
              size="sm"
              variant="ghost"
              intent="secondary"
              onClick={handleClear}
              isDisabled={!draft?.from}
            >
              Clear
            </Button>
            <Button
              size="sm"
              variant="solid"
              intent="primary"
              onClick={handleApply}
            >
              Apply
            </Button>
          </div>
        </PopoverDialog>
      </Popover>
    </PopoverTrigger>
  )
}

export { DatePicker, DateRangePicker }
export type { DatePickerProps, DateRangePickerProps, DateRange }
