"use client"

import { type ComponentProps } from "react"
import { buttonVariants } from "@workspace/base-ui/components/Button"
import { cn } from "@workspace/base-ui/lib/utils"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react"
import {
  DayPicker,
  type ChevronProps,
  type DayButtonProps,
  type DateRange,
  type DropdownProps,
} from "react-day-picker"

// Base UI has no calendar primitive, so the base-ui kit builds its Calendar on
// react-day-picker (the same primitive shadcn/9ui use) — a native-`Date` API,
// no @internationalized/date. The classNames/components below repaint the
// day-picker in the WDS look established by @workspace/ui's react-aria Calendar:
// size-9 rounded-full cells, accent-solid selection, accent-11 "today", gray-4
// hover, accent-4 range fill. Year range matches ui (MIN_YEAR..now+20).

const MIN_YEAR = 1970
const MAX_YEAR_FROM_NOW = 20

type CalendarProps = ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  components,
  formatters,
  showOutsideDays = true,
  captionLayout = "dropdown",
  startMonth,
  endMonth,
  ...props
}: CalendarProps) {
  const currentYear = new Date().getFullYear()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      // Match the established ui react-aria Calendar's labels: narrow
      // single-letter weekdays (S M T W T F S) and abbreviated month names
      // (Jul) in the dropdown. rdp defaults to two-letter weekdays / full months.
      formatters={{
        formatWeekdayName: (date) =>
          date.toLocaleDateString(undefined, { weekday: "narrow" }),
        formatMonthDropdown: (month) =>
          month.toLocaleDateString(undefined, { month: "short" }),
        ...formatters,
      }}
      // Bound the year dropdown to the same span the ui Calendar offered.
      startMonth={startMonth ?? new Date(MIN_YEAR, 0)}
      endMonth={endMonth ?? new Date(currentYear + MAX_YEAR_FROM_NOW, 11)}
      className={cn("text-gray-12 w-fit p-3", className)}
      classNames={{
        months: "relative flex flex-col",
        month: "flex flex-col gap-3",
        // Dropdowns sit on the left; the nav chevrons float top-right over them.
        month_caption: "flex h-9 items-center px-1",
        caption_label: "text-gray-12 text-sm font-medium",
        dropdowns: "flex items-center gap-1",
        dropdown_root: "relative",
        nav: "absolute top-0 right-0 z-10 flex items-center gap-0.5",
        button_previous: cn(
          buttonVariants({ variant: "ghost", intent: "secondary" }),
          "text-accent-11 hover:bg-gray-3 hover:text-accent-11 size-8 rounded-full bg-transparent p-0 disabled:opacity-40"
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost", intent: "secondary" }),
          "text-accent-11 hover:bg-gray-3 hover:text-accent-11 size-8 rounded-full bg-transparent p-0 disabled:opacity-40"
        ),
        // Pure-table layout (matches the ui react-aria Calendar): the <tr>/<td>
        // stay table elements and columns align via cell widths + border-spacing.
        month_grid: "border-separate border-spacing-x-0 border-spacing-y-0.5",
        weekday: "text-gray-11 size-9 text-[0.8rem] font-normal",
        // The day cell carries the range fill (merged with modifier classNames);
        // the DayButton paints the selected/today/endpoint states on top.
        day: "size-9 p-0 text-center align-middle",
        range_start: "bg-accent-4 rounded-l-full",
        range_middle: "bg-accent-4",
        range_end: "bg-accent-4 rounded-r-full",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: CalendarChevron,
        Dropdown: CalendarDropdown,
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarChevron({ orientation, className }: ChevronProps) {
  const Icon =
    orientation === "left"
      ? ChevronLeft
      : orientation === "right"
        ? ChevronRight
        : orientation === "up"
          ? ChevronUp
          : ChevronDown
  return <Icon aria-hidden className={cn("size-4", className)} />
}

// react-day-picker's caption dropdowns are native <select>s; repaint them as the
// ghost NativeSelect from the ui kit (transparent, gray-3 hover, chevron affordance).
function CalendarDropdown({
  options,
  className,
  components: _components,
  classNames: _classNames,
  ...selectProps
}: DropdownProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          "text-gray-12 h-7 cursor-pointer appearance-none rounded-md bg-transparent py-0 pr-6 pl-2 text-sm font-medium outline-none transition-colors",
          "hover:not-disabled:bg-gray-3 focus-visible:ring-2 focus-visible:ring-inset",
          className
        )}
        {...selectProps}
      >
        {options?.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="text-gray-11 pointer-events-none absolute top-1/2 right-1.5 size-3.5 -translate-y-1/2 opacity-70"
      />
    </div>
  )
}

function CalendarDayButton({
  day: _day,
  modifiers,
  className,
  ...props
}: DayButtonProps) {
  const isEndpoint = modifiers.range_start || modifiers.range_end
  const isSingleSelected =
    modifiers.selected && !modifiers.range_middle && !isEndpoint

  return (
    <button
      {...props}
      className={cn(
        "text-gray-12 relative flex size-9 items-center justify-center rounded-full text-sm font-normal transition-none outline-none select-none",
        "hover:bg-gray-4 focus-visible:ring-2 focus-visible:ring-inset",
        // "Today" reads as an accent tint until it's part of a selection.
        modifiers.today &&
          !modifiers.selected &&
          !modifiers.range_middle &&
          "text-accent-11",
        // Single date + range endpoints share the solid accent circle.
        (isSingleSelected || isEndpoint) &&
          "bg-accent-solid text-accent-contrast hover:bg-accent-solid",
        // The range interior lets the cell's accent-4 fill show through.
        modifiers.range_middle && "text-accent-12 rounded-none hover:bg-transparent",
        modifiers.outside && "text-gray-11 opacity-40",
        modifiers.disabled &&
          "text-gray-11 opacity-40 hover:bg-transparent",
        className
      )}
    />
  )
}

export { Calendar }
export type { CalendarProps, DateRange }
