"use client"

import { useState, type ReactNode } from "react"
import { Field } from "@base-ui/react/field"
import { EyeIcon, EyeOffIcon, SearchIcon, XIcon } from "lucide-react"

import { Button } from "@workspace/liquid-ui/components/Button"
import { Label } from "@workspace/liquid-ui/components/Label"
import { cn } from "@workspace/liquid-ui/lib/utils"

// Drop-in for @workspace/liquid-ui/Input, rebuilt on Base UI Field (Root/Label/Control).
// ui used react-aria's TextField/SearchField; Base UI's Field gives the same
// label<->control linking, disabled/invalid context, and onValueChange(string).
// The WDS field-group container (bg-panel, hairline border, accent focus halo) is
// ported; disabled/invalid read off Field.Root's data-* via the `group`.

// The bordered control tray shared by every input in the family.
const fieldGroup = cn(
  "bg-panel border-gray-a7 relative flex h-11 w-full items-center overflow-hidden rounded-md border px-3.5 transition-[box-shadow,border-color] duration-150 md:text-sm",
  // On focus: a soft translucent-accent border (accent-a8, ~44%) that reads as a
  // gentle blue edge, not a hard dark line, graduating into the softer ring —
  // both derived from accent-9 so it's one cohesive soft-blue focus halo.
  "border focus-within:border-accent-a8 focus-within:ring-ring/30 focus-within:ring-2",
  "group-data-[disabled]:opacity-60 group-data-[disabled]:cursor-not-allowed",
  "group-data-[invalid]:border-error-9 group-data-[invalid]:ring-error-9",
  "[&_svg]:text-gray-9 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
)

const controlBase =
  "placeholder:text-gray-8 h-full min-w-0 flex-1 bg-transparent outline-none [&::-webkit-search-cancel-button]:hidden"

interface InputProps {
  label?: string
  withAsterisk?: boolean
  placeholder?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  isDisabled?: boolean
  isInvalid?: boolean
  type?: string
  name?: string
  className?: string
}

function Input({
  label,
  withAsterisk,
  placeholder,
  leftIcon,
  rightIcon,
  value,
  defaultValue,
  onChange,
  isDisabled,
  isInvalid,
  type,
  name,
  className,
}: InputProps) {
  return (
    <Field.Root
      disabled={isDisabled}
      invalid={isInvalid}
      name={name}
      className="group flex flex-col gap-1"
    >
      {label && (
        <Field.Label render={<Label withAsterisk={withAsterisk} />}>
          {label}
        </Field.Label>
      )}
      <div className={cn(fieldGroup, className)}>
        {leftIcon && <div className="pr-2">{leftIcon}</div>}
        <Field.Control
          type={type}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onValueChange={onChange}
          className={controlBase}
        />
        {rightIcon && <div className="flex pl-2">{rightIcon}</div>}
      </div>
    </Field.Root>
  )
}

interface PasswordInputProps
  extends Omit<InputProps, "leftIcon" | "rightIcon" | "type"> {
  leftIcon?: ReactNode
}

function PasswordInput({
  label,
  withAsterisk,
  placeholder,
  leftIcon,
  value,
  defaultValue,
  onChange,
  isDisabled,
  isInvalid,
  name,
  className,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false)
  return (
    <Field.Root
      disabled={isDisabled}
      invalid={isInvalid}
      name={name}
      className="group flex flex-col gap-1"
    >
      {label && (
        <Field.Label render={<Label withAsterisk={withAsterisk} />}>
          {label}
        </Field.Label>
      )}
      <div className={cn(fieldGroup, "pr-1", className)}>
        {leftIcon && <div className="pr-2">{leftIcon}</div>}
        <Field.Control
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onValueChange={onChange}
          className={controlBase}
        />
        <Button
          size="sm"
          mode="icon"
          variant="ghost"
          intent="secondary"
          type="button"
          excludeFromTabOrder
          onClick={() => setVisible((v) => !v)}
          className="rounded-sm"
        >
          {visible ? <EyeIcon /> : <EyeOffIcon />}
          <span className="sr-only">Toggle password visibility</span>
        </Button>
      </div>
    </Field.Root>
  )
}

interface TextAreaProps
  extends Omit<InputProps, "leftIcon" | "rightIcon" | "type"> {}

function TextArea({
  label,
  withAsterisk,
  placeholder,
  value,
  defaultValue,
  onChange,
  isDisabled,
  isInvalid,
  name,
  className,
}: TextAreaProps) {
  return (
    <Field.Root
      disabled={isDisabled}
      invalid={isInvalid}
      name={name}
      className="group grid gap-1"
    >
      {label && (
        <Field.Label render={<Label withAsterisk={withAsterisk} />}>
          {label}
        </Field.Label>
      )}
      <Field.Control
        render={<textarea />}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onChange}
        className={cn(
          // WDS textarea: white paper + hairline border + accent focus halo.
          "bg-panel placeholder:text-gray-8 border-gray-a7 field-sizing-content flex min-h-[80px] w-full rounded-md border px-3.5 py-2.5 outline-none md:text-sm",
          "transition-[box-shadow,border-color] duration-150",
          "focus-visible:border-accent-a8 focus-visible:ring-ring/30 focus-visible:ring-2",
          "group-data-[disabled]:cursor-not-allowed group-data-[disabled]:opacity-60",
          "group-data-[invalid]:border-error-9 group-data-[invalid]:ring-error-9",
          className
        )}
      />
    </Field.Root>
  )
}

interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  isDisabled?: boolean
  className?: string
}

function SearchInput({
  placeholder,
  value,
  onChange,
  isDisabled,
  className,
}: SearchInputProps) {
  return (
    <Field.Root
      disabled={isDisabled}
      className="group flex w-full flex-col"
    >
      <div className={cn(fieldGroup, "pr-1.5", className)}>
        <div className="pr-2">
          <SearchIcon aria-hidden className="text-gray-11 size-4 opacity-50" />
        </div>
        <Field.Control
          type="search"
          aria-label="Search"
          placeholder={placeholder}
          value={value}
          onValueChange={onChange}
          className={controlBase}
        />
        <Button
          size="xs"
          mode="icon"
          variant="ghost"
          type="button"
          excludeFromTabOrder
          onClick={() => onChange?.("")}
          className={cn("rounded-sm", !value && "invisible")}
        >
          <XIcon />
          <span className="sr-only">Clear</span>
        </Button>
      </div>
    </Field.Root>
  )
}

export { Input, PasswordInput, SearchInput, TextArea }
export type { InputProps, PasswordInputProps, SearchInputProps, TextAreaProps }
