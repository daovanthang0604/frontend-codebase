"use client"

import React, { useContext } from "react"
import {
  CalendarDate,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date"
import { buttonVariants } from "@workspace/ui/components/Button"
import {
  getCalendarMonths,
  getCalendarYears,
} from "@workspace/ui/components/Calendar.utils"
import {
  NativeSelect,
  NativeSelectOption,
} from "@workspace/ui/components/NativeSelect"
import { cn } from "@workspace/ui/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  Button as AriaButton,
  Calendar as AriaCalendar,
  CalendarCell as AriaCalendarCell,
  CalendarGrid as AriaCalendarGrid,
  CalendarGridBody as AriaCalendarGridBody,
  CalendarGridHeader as AriaCalendarGridHeader,
  CalendarHeaderCell as AriaCalendarHeaderCell,
  RangeCalendar as AriaRangeCalendar,
  CalendarStateContext,
  composeRenderProps,
  RangeCalendarStateContext,
  useLocale,
  type CalendarCellProps as AriaCalendarCellProps,
  type CalendarGridBodyProps as AriaCalendarGridBodyProps,
  type CalendarGridHeaderProps as AriaCalendarGridHeaderProps,
  type CalendarGridProps as AriaCalendarGridProps,
  type CalendarHeaderCellProps as AriaCalendarHeaderCellProps,
} from "react-aria-components"

const Calendar = AriaCalendar
const RangeCalendar = AriaRangeCalendar
const months = getCalendarMonths()
const years = getCalendarYears()
const CalendarHeading = (props: React.HTMLAttributes<HTMLElement>) => {
  const { direction } = useLocale()
  const calendarState = useContext(CalendarStateContext)
  const rangeCalendarState = useContext(RangeCalendarStateContext)
  const state = calendarState ?? rangeCalendarState
  // RangeCalendar and Calendar have visibleRange.
  const visibleStart = (state as any)?.visibleRange?.start as
    | CalendarDate
    | undefined
  const baseDate =
    state?.focusedDate ?? visibleStart ?? today(getLocalTimeZone())
  return (
    <header className="flex w-full items-center gap-0.5 pb-1" {...props}>
      <h2 className="flex flex-1 items-center pl-1">
        <NativeSelect
          size="sm"
          variant="ghost"
          value={baseDate.month}
          onChange={(e) => {
            const month = Number(e.target.value)
            const current =
              state?.focusedDate ?? visibleStart ?? today(getLocalTimeZone())
            const nextFocusedDate = new CalendarDate(
              current.year,
              month,
              current.day
            )
            state?.setFocusedDate(nextFocusedDate)
          }}
        >
          {months.map((month) => (
            <NativeSelectOption key={month.value} value={month.value}>
              {month.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>

        <NativeSelect
          size="sm"
          variant="ghost"
          value={baseDate.year}
          onChange={(e) => {
            const year = Number(e.target.value)
            const current =
              state?.focusedDate ?? visibleStart ?? today(getLocalTimeZone())
            const nextFocusedDate = new CalendarDate(
              year,
              current.month,
              current.day
            )
            state?.setFocusedDate(nextFocusedDate)
          }}
        >
          {years.map((year) => (
            <NativeSelectOption key={year} value={year}>
              {year}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </h2>

      <AriaButton
        slot="previous"
        className={cn(
          buttonVariants({ variant: "ghost", intent: "secondary" }),
          "text-accent-11 size-9 rounded-full bg-transparent p-0",
          "data-disabled:opacity-40",
          "data-hovered:bg-gray-2 data-hovered:text-accent-11 data-hovered:opacity-100"
        )}
      >
        {direction === "rtl" ? (
          <ChevronRight aria-hidden className="size-5" />
        ) : (
          <ChevronLeft aria-hidden className="size-5" />
        )}
      </AriaButton>

      <AriaButton
        slot="next"
        className={cn(
          buttonVariants({ variant: "ghost", intent: "secondary" }),
          "text-accent-11 size-9 rounded-full bg-transparent p-0",
          "data-disabled:opacity-40",
          "data-hovered:bg-gray-2 data-hovered:text-accent-11 data-hovered:opacity-100"
        )}
      >
        {direction === "rtl" ? (
          <ChevronLeft aria-hidden className="size-5" />
        ) : (
          <ChevronRight aria-hidden className="size-5" />
        )}
      </AriaButton>
    </header>
  )
}
const CalendarGrid = ({ className, ...props }: AriaCalendarGridProps) => (
  <AriaCalendarGrid
    className={cn(
      "border-separate border-spacing-x-0.5 border-spacing-y-0.5",
      className
    )}
    {...props}
  />
)
const CalendarGridHeader = ({ ...props }: AriaCalendarGridHeaderProps) => (
  <AriaCalendarGridHeader {...props} />
)
const CalendarHeaderCell = ({
  className,
  ...props
}: AriaCalendarHeaderCellProps) => (
  <AriaCalendarHeaderCell
    className={cn("w-9 rounded-md text-[0.8rem] font-normal", className)}
    {...props}
  />
)
const CalendarGridBody = ({
  className,
  ...props
}: AriaCalendarGridBodyProps) => (
  <AriaCalendarGridBody className={cn("[&>tr>td]:p-0", className)} {...props} />
)
const CalendarCell = ({ className, ...props }: AriaCalendarCellProps) => {
  return (
    <AriaCalendarCell
      className={composeRenderProps(className, (className, renderProps) =>
        cn(
          "text-gray-12 select-none",
          "relative flex size-9 items-center justify-center rounded-full p-0 text-sm font-normal transition-none",
          /* Disabled */
          renderProps.isDisabled && "text-gray-11 opacity-40",
          /* Selected */
          renderProps.isSelected &&
            "bg-accent-solid text-accent-contrast data-[focused]:bg-accent-solid",
          /* Current Date */
          renderProps.date.compare(today(getLocalTimeZone())) === 0 &&
            !renderProps.isSelected &&
            "text-accent-11",
          /* Hovered */
          renderProps.isHovered && "bg-gray-4",
          /* Outside Month */
          renderProps.isOutsideMonth && "opacity-40",
          /* Focused */
          renderProps.isFocused && "ring-2 outline-none ring-inset",
          className
        )
      )}
      {...props}
    />
  )
}
/** Accepts values in the format YYYY-MM-DD */
interface EgCalendarProps {
  value?: string
  onChange?: (date: string) => void
  defaultValue?: string
  minValue?: string
  maxValue?: string
  variant?: "default" | "unstyled"
  className?: string
}
function EgCalendar({
  value: controlledValue,
  onChange: controlledOnChange,
  defaultValue,
  minValue,
  maxValue,
  className,
  variant = "default",
}: EgCalendarProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<
    string | undefined
  >(defaultValue)
  const value = controlledValue ?? uncontrolledValue
  const onChange = controlledOnChange ?? setUncontrolledValue
  return (
    <Calendar
      value={value ? parseDate(value) : null}
      onChange={(value) => onChange(value?.toString())}
      className={composeRenderProps(className, (className) =>
        cn(
          "w-fit",
          variant === "default" ? "bg-gray-3/40 rounded-lg border p-1" : "",
          className
        )
      )}
      minValue={minValue ? parseDate(minValue) : null}
      maxValue={maxValue ? parseDate(maxValue) : null}
    >
      <CalendarHeading />
      <CalendarGrid>
        <CalendarGridHeader>
          {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => <CalendarCell date={date} />}
        </CalendarGridBody>
      </CalendarGrid>
    </Calendar>
  )
}
export {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
  EgCalendar,
  RangeCalendar,
}
export type { EgCalendarProps }
