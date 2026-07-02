"use client"

import { useContext } from "react"
import { getLocalTimeZone } from "@internationalized/date"
import { useControllableState } from "@radix-ui/react-use-controllable-state"
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
import { DateInput } from "@workspace/ui/components/Datefield"
import { parse, toValidYear } from "@workspace/ui/components/DatePicker.utils"
import { FieldGroup } from "@workspace/ui/components/Field"
import { Label } from "@workspace/ui/components/Label"
import { Popover } from "@workspace/ui/components/Popover"
import { cn } from "@workspace/ui/lib/utils"
import dayjs from "dayjs"
import { CalendarIcon } from "lucide-react"
import {
  DatePicker as AriaDatePicker,
  Dialog as AriaDialog,
  composeRenderProps,
  DatePickerStateContext,
  I18nProvider,
  type DialogProps as AriaDialogProps,
  type PopoverProps as AriaPopoverProps,
} from "react-aria-components"

const DatePicker = AriaDatePicker
const DatePickerContent = ({
  className,
  popoverClassName,
  ...props
}: AriaDialogProps & {
  popoverClassName?: AriaPopoverProps["className"]
}) => (
  <Popover
    animateOut={false}
    className={composeRenderProps(popoverClassName, (className) =>
      cn("w-auto p-1", className)
    )}
    placement="bottom right"
  >
    <AriaDialog
      className={cn(
        "flex w-full flex-col space-y-4 outline-none sm:flex-row sm:space-y-0 sm:space-x-4",
        className
      )}
      {...props}
    />
  </Popover>
)
interface WorkspaceDatePickerProps {
  /* The current value for the DatePicker (controlled). */
  value?: Date | null
  /* Callback fired when the date value changes. */
  onChange?: (value?: Date | null) => void
  /* The initial value for the DatePicker (uncontrolled). */
  defaultValue?: Date
  /* The minimum selectable date. */
  minValue?: Date
  /* The maximum selectable date. */
  maxValue?: Date
  /* Whether the DatePicker should be disabled. */
  isDisabled?: boolean
  /* Whether the DatePicker is in an invalid state. */
  isInvalid?: boolean
  /* The label to display for the DatePicker. */
  label?: string
  /* If true, an asterisk will be shown next to the label to mark it as required. */
  withAsterisk?: boolean
  /* The tooltip for the DatePicker. */
  tooltip?: React.ReactNode
  /* The level of date/time granularity ('day' for date only, 'minute' for date and time). Default is 'day'. */
  granularity?: "day" | "minute"
  /* The time format for time picker: 12 or 24 hour cycle. Default is 24. */
  hourCycle?: 12 | 24
  /* The format of the date. Default is 'dd/mm/yyyy'. */
  format?: "dd/mm/yyyy" | "mm/dd/yyyy" | "yyyy-mm-dd"
}
function WorkspaceDatePicker({
  value: controlledValue,
  onChange: controlledOnChange,
  defaultValue,
  minValue,
  maxValue,
  isDisabled,
  isInvalid,
  label,
  withAsterisk,
  tooltip,
  granularity = "day",
  hourCycle = 24,
  format = "dd/mm/yyyy",
}: WorkspaceDatePickerProps) {
  const [value, onChange] = useControllableState<Date | null | undefined>({
    prop: controlledValue,
    defaultProp: defaultValue,
    onChange: controlledOnChange,
  })
  let locale = "en-AU"
  if (format === "dd/mm/yyyy") {
    locale = "en-AU"
  } else if (format === "mm/dd/yyyy") {
    locale = "en-US"
  } else if (format === "yyyy-mm-dd") {
    locale = "en-CA"
  }
  return (
    <I18nProvider locale={locale}>
      <DatePicker
        aria-label="Date Picker"
        className={"flex w-full flex-col gap-1.5"}
        value={parse(value, granularity)}
        onChange={(value) => onChange(value?.toDate(getLocalTimeZone()))}
        minValue={minValue ? parse(minValue) : null}
        maxValue={maxValue ? parse(maxValue) : null}
        isDisabled={isDisabled}
        granularity={granularity}
        hourCycle={hourCycle}
        isInvalid={isInvalid}
        hideTimeZone
        onBlur={() => {
          if (value) {
            onChange(toValidYear(value))
          }
        }}
      >
        {label && (
          <Label withAsterisk={withAsterisk} tooltip={tooltip}>
            {label}
          </Label>
        )}
        <FieldGroup className="has-[button[aria-expanded=true]]:ring-ring pr-2.5 has-[button[aria-expanded=true]]:ring-2">
          <DateInput className="flex-1" variant="ghost" />
          <Button
            mode="icon"
            size="sm"
            variant="ghost"
            intent="secondary"
            tooltip="Select Date"
            tooltipDelay={2000}
            className="-mr-1 size-6 data-[focus-visible]:ring-offset-0"
            isDisabled={isDisabled}
          >
            <CalendarIcon aria-hidden className="text-gray-11 size-4" />
          </Button>
        </FieldGroup>
        <span className="text-gray-11 text-xs leading-none">{format}</span>
        <DatePickerContent>
          <div>
            <Calendar>
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
            <div className="flex justify-center py-1">
              <TodayButton />
            </div>
          </div>
        </DatePickerContent>
      </DatePicker>
    </I18nProvider>
  )
}
function TodayButton() {
  const state = useContext(DatePickerStateContext)
  return (
    <Button
      size="sm"
      variant="ghost"
      intent="primary"
      onClick={() => {
        state?.setValue(parse(dayjs().startOf("day").toDate()))
        state?.close()
      }}
    >
      Today
    </Button>
  )
}
export { WorkspaceDatePicker as DatePicker }
export type { WorkspaceDatePickerProps as DatePickerProps }
