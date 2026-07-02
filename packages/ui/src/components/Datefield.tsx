"use client"

import React from "react"
import { parseDate } from "@internationalized/date"
import {
  fieldGroupVariants,
  type FieldGroupVariantProps,
} from "@workspace/ui/components/Field"
import { cn } from "@workspace/ui/lib/utils"
import {
  DateField as AriaDateField,
  DateInput as AriaDateInput,
  DateSegment as AriaDateSegment,
  TimeField as AriaTimeField,
  composeRenderProps,
  type DateInputProps as AriaDateInputProps,
  type DateSegmentProps as AriaDateSegmentProps,
} from "react-aria-components"

const DateField = AriaDateField
const TimeField = AriaTimeField
function DateSegment({ className, ...props }: AriaDateSegmentProps) {
  return (
    <AriaDateSegment
      className={composeRenderProps(className, (className) =>
        cn(
          "type-literal:px-0 inline rounded-sm px-[1px] caret-transparent outline-0",
          /* Placeholder */
          "data-[placeholder]:text-gray-11",
          /* Disabled */
          "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70",
          /* Focused */
          "data-[focused]:bg-accent-9 data-[focused]:text-accent-contrast data-[focused]:data-[placeholder]:text-accent-contrast",
          className
        )
      )}
      {...props}
    />
  )
}
interface DateInputProps extends AriaDateInputProps, FieldGroupVariantProps {}
function DateInput({
  className,
  variant,
  ...props
}: Omit<DateInputProps, "children">) {
  return (
    <AriaDateInput
      className={composeRenderProps(className, (className) =>
        cn(fieldGroupVariants({ variant }), "md:text-sm", className)
      )}
      {...props}
    >
      {(segment) => <DateSegment segment={segment} />}
    </AriaDateInput>
  )
}
/** Accepts values in the format YYYY-MM-DD */
interface EGDateFieldProps {
  value?: string
  onChange?: (value: string) => void
  defaultValue?: string
  className?: string
  variant?: "default" | "unstyled"
  minValue?: string
  maxValue?: string
  isDisabled?: boolean
}
function EGDateField({
  value: controlledValue,
  onChange: controlledOnChange,
  defaultValue,
  minValue,
  maxValue,
  className,
  isDisabled,
  ...props
}: EGDateFieldProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<
    string | undefined
  >(defaultValue)
  const value = controlledValue ?? uncontrolledValue
  const onChange = controlledOnChange ?? setUncontrolledValue
  return (
    <DateField
      aria-label="Date Field"
      className={cn("w-full", className)}
      value={value ? parseDate(value) : null}
      onChange={(value) => onChange(value?.toString() ?? "")}
      minValue={minValue ? parseDate(minValue) : null}
      maxValue={maxValue ? parseDate(maxValue) : null}
      isDisabled={isDisabled}
      {...props}
    >
      <DateInput />
    </DateField>
  )
}
export { DateField, DateInput, DateSegment, EGDateField, TimeField }
export type { DateInputProps, EGDateFieldProps }
