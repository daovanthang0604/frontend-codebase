"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@workspace/ui/components/Button"
import { FieldGroup } from "@workspace/ui/components/Field"
import { Label } from "@workspace/ui/components/Label"
import { cn } from "@workspace/ui/lib/utils"
import { EyeIcon, EyeOffIcon, SearchIcon, XIcon } from "lucide-react"
import {
  Input as AriaInput,
  SearchField as AriaSearchField,
  TextArea as AriaTextArea,
  TextField as AriaTextField,
  type SearchFieldProps as AriaSearchFieldProps,
  type TextFieldProps as AriaTextFieldProps,
} from "react-aria-components"
import { useDebounce } from "react-use"

interface InputProps extends AriaTextFieldProps {
  label?: string
  withAsterisk?: boolean
  tooltip?: React.ReactNode
  placeholder?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  ref?: React.RefCallback<HTMLInputElement>
}
function Input({
  className,
  label,
  withAsterisk,
  tooltip,
  leftIcon,
  rightIcon,
  ref,
  ...props
}: InputProps) {
  return (
    <AriaTextField
      className={"flex flex-col gap-1"}
      isInvalid={(props as any)["aria-invalid"]}
      {...props}
    >
      {label && (
        <Label withAsterisk={withAsterisk} tooltip={tooltip}>
          {label}
        </Label>
      )}
      <FieldGroup className={cn("py-0", className)}>
        {leftIcon && <div className="pr-2">{leftIcon}</div>}
        <AriaInput
          ref={ref}
          className="placeholder:text-gray-8 h-full flex-1 focus-visible:outline-none"
        />
        {rightIcon && <div className="flex pl-2">{rightIcon}</div>}
      </FieldGroup>
    </AriaTextField>
  )
}
interface PasswordInputProps extends AriaTextFieldProps {
  placeholder?: string
  label?: string
  withAsterisk?: boolean
  tooltip?: React.ReactNode
  leftIcon?: React.ReactNode
  ref?: React.RefCallback<HTMLInputElement>
}
function PasswordInput({
  className,
  label,
  withAsterisk,
  tooltip,
  leftIcon,
  ref,
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  return (
    <AriaTextField className={cn("flex flex-col gap-1")} {...props}>
      {label && (
        <Label withAsterisk={withAsterisk} tooltip={tooltip}>
          {label}
        </Label>
      )}
      <FieldGroup className={cn("py-0 pr-1", className)}>
        {leftIcon && <div className="pr-2">{leftIcon}</div>}
        <AriaInput
          ref={ref}
          type={isVisible ? "text" : "password"}
          className="placeholder:text-gray-8 h-full flex-1 focus-visible:outline-none"
        />
        <Button
          size="sm"
          mode="icon"
          variant="ghost"
          intent="secondary"
          excludeFromTabOrder
          onClick={() => setIsVisible(!isVisible)}
          tooltip="Toggle password visibility"
          tooltipDelay={1000}
          className="rounded-sm"
        >
          {isVisible ? <EyeIcon /> : <EyeOffIcon />}
        </Button>
      </FieldGroup>
    </AriaTextField>
  )
}
interface TextAreaProps extends AriaTextFieldProps {
  label?: string
  withAsterisk?: boolean
  tooltip?: React.ReactNode
  placeholder?: string
  ref?: React.RefCallback<HTMLTextAreaElement>
}
function TextArea({
  className,
  label,
  withAsterisk,
  tooltip,
  ref,
  ...props
}: TextAreaProps) {
  return (
    <AriaTextField className={cn("grid gap-1", className)} {...props}>
      {label && (
        <Label withAsterisk={withAsterisk} tooltip={tooltip}>
          {label}
        </Label>
      )}
      <AriaTextArea
        ref={ref}
        className={cn(
          // WDS textarea: white paper + hairline border + accent focus halo,
          // matching the input control system (Field).
          "bg-panel placeholder:text-gray-8 border-gray-a7 flex field-sizing-content min-h-[80px] w-full rounded-md border px-3.5 py-2.5 md:text-sm",
          "transition-[box-shadow,border-color] duration-150 ease-(--ease-out-quart)",
          /* Focus Within */
          "data-focused:border-accent-8 data-focused:ring-ring/30 data-focused:ring-[3px]",
          /* Disabled */
          "data-disabled:cursor-not-allowed data-disabled:opacity-60",
          /* Resets */
          "focus-visible:outline-none",
          /* Invalid */
          "data-invalid:border-error-9 data-invalid:ring-error-9 aria-invalid:ring-error-9",
          className
        )}
      />
    </AriaTextField>
  )
}
interface SearchInputProps extends AriaSearchFieldProps {
  placeholder?: string
  ref?: React.RefCallback<HTMLInputElement>
}
function SearchInput({ className, ref, ...props }: SearchInputProps) {
  return (
    <AriaSearchField {...props} aria-label="Search" className="group">
      <FieldGroup className={cn("py-0 pr-1.5", className)}>
        <div data-slot="left-icon" className="pr-2">
          <SearchIcon aria-hidden className="text-gray-11 size-4 opacity-50" />
        </div>
        <AriaInput
          ref={ref}
          aria-label="Search"
          className="placeholder:text-gray-8 h-full flex-1 focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        <Button
          size="xs"
          mode="icon"
          variant="ghost"
          tooltip="Clear"
          tooltipDelay={1000}
          className={cn(
            /* Hover */
            "data-hovered:opacity-100",
            /* Disabled */
            "data-disabled:pointer-events-none",
            /* Empty */
            "group-data-empty:invisible"
          )}
        >
          <XIcon />
        </Button>
      </FieldGroup>
    </AriaSearchField>
  )
}
interface DebouncedSearchInputProps extends SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  debounceTime?: number
}
function DebouncedSearchInput({
  value,
  onChange,
  placeholder = "Search...",
  debounceTime = 200,
  ...props
}: DebouncedSearchInputProps) {
  const [dirty, setDirty] = useState(false)
  const [internalValue, setInternalValue] = useState(value)
  useDebounce(
    () => {
      if (dirty) {
        onChange(internalValue)
      }
    },
    debounceTime,
    [internalValue, dirty]
  )
  useEffect(() => {
    if (value === undefined && internalValue) {
      // Prop-driven reset: clear the debounced internal value when the
      // controlled `value` is cleared externally. Intentional state sync.
      setDirty(false)
      setInternalValue("")
    }
  }, [value])
  return (
    <SearchInput
      value={internalValue}
      onChange={(v) => {
        setDirty(true)
        setInternalValue(v)
      }}
      placeholder={placeholder}
      {...props}
    />
  )
}
export { DebouncedSearchInput, Input, PasswordInput, SearchInput, TextArea }
export type { InputProps, PasswordInputProps, SearchInputProps }
