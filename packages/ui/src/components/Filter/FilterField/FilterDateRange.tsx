"use client"

import { useContext, useState } from "react"
import {
  fromDate,
  getLocalTimeZone,
  today,
  type CalendarDate,
} from "@internationalized/date"
import { Button } from "@workspace/ui/components/Button"
import {
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
  RangeCalendar,
} from "@workspace/ui/components/Calendar"
import { cn } from "@workspace/ui/lib/utils"
import dayjs from "dayjs"
import {
  RootMenuTriggerStateContext,
  type DateRange,
} from "react-aria-components"

import {
  useFilterContext,
  useFilterItem,
  useFilterItemClose,
} from "../Filter.store"

interface FilterDateRangeProps {
  field?: string
  onSelectRange?: (range: [Date, Date] | undefined) => void
}

export function FilterDateRange({
  field: fieldProp,
  onSelectRange,
}: FilterDateRangeProps) {
  const { value, setFieldValue } = useFilterContext()
  const filterItem = useFilterItem()
  const onClose = useFilterItemClose()
  const menuState = useContext(RootMenuTriggerStateContext)
  const field = fieldProp ?? filterItem?.field
  if (!field) throw new Error("...")

  const raw = value[field] as [Date, Date] | null | undefined
  const [startDate, endDate] = raw ?? []

  const tz = getLocalTimeZone()
  const todayDate = today(tz)

  const initialStart = startDate ? fromDate(startDate, tz) : undefined
  const initialEnd = endDate ? fromDate(endDate, tz) : undefined

  const [draftRange, setDraftRange] = useState<DateRange | null>(
    initialStart && initialEnd ? { start: initialStart, end: initialEnd } : null
  )

  const calendarValue = draftRange ?? null

  const applyRange = (range: [Date, Date] | undefined) => {
    if (onSelectRange) {
      onSelectRange(range)
    } else {
      setFieldValue(field, range)
    }
  }

  const commitDraft = () => {
    if (!draftRange?.start || !draftRange?.end) {
      applyRange(undefined)
      onClose?.()
      return
    }
    const start = draftRange.start.toDate(tz)
    const end = draftRange.end.toDate(tz)
    applyRange([
      dayjs(start).startOf("day").toDate(),
      dayjs(end).endOf("day").toDate(),
    ])
    menuState?.close()
    onClose?.()
  }

  const handleClear = () => {
    setDraftRange(null)
    applyRange(undefined)
  }

  return (
    <div className="flex h-[352px] min-w-[280px] flex-col p-2">
      <RangeCalendar
        aria-label="Select date range"
        className="w-full flex-1"
        value={calendarValue}
        onChange={setDraftRange}
        defaultFocusedValue={calendarValue?.start ?? todayDate}
      >
        <CalendarHeading />
        <CalendarGrid className="border-spacing-x-0 border-spacing-y-0.5">
          <CalendarGridHeader>
            {(day) => (
              <CalendarHeaderCell className="text-center">
                {day}
              </CalendarHeaderCell>
            )}
          </CalendarGridHeader>
          <CalendarGridBody>
            {(date) => (
              <RangeCalendarCell
                date={date as CalendarDate}
                range={draftRange}
              />
            )}
          </CalendarGridBody>
        </CalendarGrid>
      </RangeCalendar>

      <div className="border-gray-6 flex justify-center gap-2 border-t pt-2">
        <Button
          size="sm"
          variant="ghost"
          intent="primary"
          onClick={commitDraft}
          isDisabled={!draftRange}
        >
          Apply
        </Button>
        <Button
          size="sm"
          variant="ghost"
          intent="secondary"
          onClick={handleClear}
          isDisabled={!raw}
          className="ml-2"
        >
          Clear
        </Button>
      </div>
    </div>
  )
}

function RangeCalendarCell({
  date,
  range: _range,
}: {
  date: CalendarDate
  range: DateRange | null
}) {
  return (
    <CalendarCell
      date={date}
      className={cn(
        "data-selected:bg-accent-4 data-selected:text-accent-12 data-selected:rounded-none",
        "data-selection-start:rounded-l-md",
        "data-selection-end:rounded-r-md",
        "data-selection-start:data-selection-end:rounded-md",
        "data-selected:data-selection-start:bg-accent-9 data-selected:data-selection-start:text-accent-contrast",
        "data-selected:data-selection-end:bg-accent-9 data-selected:data-selection-end:text-accent-contrast"
      )}
    />
  )
}
