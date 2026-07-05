"use client"

import { useId, type ComponentProps, type FC, type ReactNode } from "react"
import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group"

import { Checkbox } from "@workspace/base-ui/components/Checkbox"
import { Label } from "@workspace/base-ui/components/Label"
import { cn } from "@workspace/base-ui/lib/utils"

// A list of checkboxes sharing one array value, on Base UI's checkbox-group. The
// group's value is the array of ticked checkbox `name`s (per Base UI's API —
// each Checkbox contributes its `name`, falling back to `value`, to the array).
//
// The existing Checkbox wrapper forwards unknown props to Base UI's Checkbox.Root
// through its `...props` spread, but its public type doesn't list `name`/`id`.
// Widen it here so we can pass `name` (registers the box with the group) and `id`
// (links the row's Label). Assignment (not `as`) stays type-checked: Checkbox is
// assignable to this wider component type.
type GroupCheckboxProps = ComponentProps<typeof Checkbox> & {
  name?: string
  id?: string
}
const GroupCheckbox: FC<GroupCheckboxProps> = Checkbox

interface CheckboxGroupProps {
  /** Ticked items, as their `CheckboxGroupItem` values (controlled). */
  value?: string[]
  /** Initially ticked items (uncontrolled). */
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  /** Optional field label rendered above the items. */
  label?: ReactNode
  /** Optional helper text rendered under the label. */
  description?: ReactNode
  disabled?: boolean
  className?: string
  children?: ReactNode
}

function CheckboxGroup({
  value,
  defaultValue,
  onValueChange,
  label,
  description,
  disabled,
  className,
  children,
}: CheckboxGroupProps) {
  return (
    <BaseCheckboxGroup
      value={value}
      defaultValue={defaultValue}
      onValueChange={(v) => onValueChange?.(v)}
      disabled={disabled}
      className={cn("flex flex-col gap-2", className)}
    >
      {label || description ? (
        <div className="flex flex-col gap-1">
          {label ? <Label>{label}</Label> : null}
          {description ? (
            <p className="text-gray-10 text-[13px]">{description}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </BaseCheckboxGroup>
  )
}

interface CheckboxGroupItemProps {
  /** The checkbox's `name` — the string that appears in the group's value array. */
  value: string
  children?: ReactNode
  disabled?: boolean
  className?: string
}

function CheckboxGroupItem({
  value,
  children,
  disabled,
  className,
}: CheckboxGroupItemProps) {
  const id = useId()
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <GroupCheckbox name={value} id={id} isDisabled={disabled} />
      <Label
        htmlFor={id}
        className="text-gray-12 cursor-pointer text-sm font-normal tracking-normal"
      >
        {children}
      </Label>
    </div>
  )
}

export { CheckboxGroup, CheckboxGroupItem }
export type { CheckboxGroupProps, CheckboxGroupItemProps }
