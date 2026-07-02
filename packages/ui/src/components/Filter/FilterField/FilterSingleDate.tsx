"use client"

import { useContext, useState } from "react"
import {
  getLocalTimeZone,
  today,
  type CalendarDate,
  type CalendarDateTime,
} from "@internationalized/date"
import { Button } from "@workspace/ui/components/Button"
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
} from "@workspace/ui/components/Calendar"
import { parse } from "@workspace/ui/components/DatePicker.utils"
import { cn } from "@workspace/ui/lib/utils"
import dayjs from "dayjs"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { RootMenuTriggerStateContext } from "react-aria-components"

import {
  useFilterContext,
  useFilterItem,
  useFilterItemClose,
} from "../Filter.store"

interface FilterSingleDateProps {
  field?: string
  granularity?: "day" | "month"
  onSelect?: (date: Date | undefined) => void
}

export function FilterSingleDate({
  field: fieldProp,
  granularity = "day",
  onSelect,
}: FilterSingleDateProps) {
  const { value, setFieldValue } = useFilterContext()
  const filterItem = useFilterItem()

  const field = fieldProp ?? filterItem?.field

  if (!field) {
    throw new Error(
      "FilterSingleDate requires a field prop or must be used within a FilterItemProvider"
    )
  }

  const dateValue = value[field] as Date | null | undefined

  const handleChange = (date: Date) => {
    if (onSelect) {
      onSelect(date)
    } else {
      setFieldValue(field, date)
    }
  }

  const handleClear = () => {
    if (onSelect) {
      onSelect(undefined)
    } else {
      setFieldValue(field, undefined)
    }
  }

  if (granularity === "month") {
    return (
      <MonthPicker
        value={dateValue ?? undefined}
        onChange={handleChange}
        onClear={handleClear}
      />
    )
  }

  return (
    <DayPicker
      value={dateValue ?? undefined}
      onChange={handleChange}
      onClear={handleClear}
    />
  )
}

interface DayPickerProps {
  value?: Date
  onChange: (date: Date) => void
  onClear: () => void
}

function DayPicker({ value, onChange, onClear }: DayPickerProps) {
  const calendarValue = parse(value, "day")
  const todayDate = today(getLocalTimeZone())
  const menuState = useContext(RootMenuTriggerStateContext)
  const onClose = useFilterItemClose()

  const handleDateChange = (date: CalendarDate | CalendarDateTime) => {
    onChange(date.toDate(getLocalTimeZone()))
    // Close popover after selection
    menuState?.close()
    onClose?.()
  }

  const handleToday = () => {
    onChange(dayjs().startOf("day").toDate())
  }

  return (
    <div className="flex h-[352px] min-w-[280px] flex-col p-2">
      <Calendar
        aria-label="Select date"
        className="w-full flex-1"
        value={calendarValue}
        onChange={handleDateChange}
        defaultFocusedValue={calendarValue ?? todayDate}
      >
        <CalendarHeading />
        <CalendarGrid className="w-full">
          <CalendarGridHeader>
            {(day) => (
              <CalendarHeaderCell className="flex-1">{day}</CalendarHeaderCell>
            )}
          </CalendarGridHeader>
          <CalendarGridBody>
            {(date) => <CalendarCell date={date} />}
          </CalendarGridBody>
        </CalendarGrid>
      </Calendar>

      <div className="border-gray-6 flex justify-center gap-2 border-t pt-2">
        <Button
          size="sm"
          variant="ghost"
          intent="primary"
          onClick={handleToday}
        >
          Today
        </Button>
        <Button
          size="sm"
          variant="ghost"
          intent="secondary"
          onClick={onClear}
          isDisabled={!value}
        >
          Clear
        </Button>
      </div>
    </div>
  )
}

interface MonthPickerProps {
  value?: Date
  onChange: (date: Date) => void
  onClear: () => void
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

function MonthPicker({ value, onChange, onClear }: MonthPickerProps) {
  const currentYear = dayjs().year()
  const [viewYear, setViewYear] = useState(
    value ? dayjs(value).year() : currentYear
  )
  const onClose = useFilterItemClose()
  const menuState = useContext(RootMenuTriggerStateContext)

  const selectedMonth = value ? dayjs(value).month() : null
  const selectedYear = value ? dayjs(value).year() : null

  const handleMonthSelect = (monthIndex: number) => {
    const date = dayjs()
      .year(viewYear)
      .month(monthIndex)
      .startOf("month")
      .toDate()
    onChange(date)
    onClose?.()
    menuState?.close()
  }

  const handleThisMonth = () => {
    onChange(dayjs().startOf("month").toDate())
  }

  return (
    <div className="flex min-w-[280px] flex-col p-2">
      <div className="mb-2 flex items-center justify-between">
        <Button
          mode="icon"
          size="sm"
          variant="ghost"
          intent="secondary"
          onClick={() => setViewYear((y) => y - 1)}
          aria-label="Previous year"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-gray-12 text-sm font-medium">{viewYear}</span>
        <Button
          mode="icon"
          size="sm"
          variant="ghost"
          intent="secondary"
          onClick={() => setViewYear((y) => y + 1)}
          aria-label="Next year"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-1">
        {MONTHS.map((month, index) => {
          const isSelected =
            selectedMonth === index && selectedYear === viewYear
          const isCurrentMonth =
            dayjs().month() === index && dayjs().year() === viewYear

          return (
            <button
              key={month}
              type="button"
              onClick={() => handleMonthSelect(index)}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors",
                "hover:bg-gray-4 focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                isSelected
                  ? "bg-accent-9 hover:bg-accent-10 text-white"
                  : isCurrentMonth
                    ? "text-accent-11"
                    : "text-gray-11 hover:text-gray-12"
              )}
            >
              {month}
            </button>
          )
        })}
      </div>

      <div className="border-gray-6 mt-2 flex justify-center gap-2 border-t pt-2">
        <Button
          size="sm"
          variant="ghost"
          intent="primary"
          onClick={handleThisMonth}
        >
          This month
        </Button>
        <Button
          size="sm"
          variant="ghost"
          intent="secondary"
          onClick={onClear}
          isDisabled={!value}
        >
          Clear
        </Button>
      </div>
    </div>
  )
}
