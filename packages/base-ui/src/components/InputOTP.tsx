"use client"

import * as React from "react"
import { OTPInput, OTPInputContext, type SlotProps } from "input-otp"
import { MinusIcon } from "lucide-react"

import { cn } from "@workspace/base-ui/lib/utils"

// One-time-code field, built on `input-otp`. The hidden real input is overlaid
// on a row of boxed cells; `input-otp` reports per-slot state (char / caret /
// active) which we paint. The all-in-one <InputOTP> is the common path; the
// compound InputOTPGroup/Slot/Separator mirror the shadcn API for split layouts.

// bg-panel + hairline border matches the Input family; the active cell lifts
// with an accent border and the same soft accent ring as our focus halo.
function cellClassName(isActive: boolean) {
  return cn(
    "bg-panel relative flex size-10 items-center justify-center rounded-md border text-sm font-medium transition-[box-shadow,border-color]",
    isActive && "border-accent-8 ring-ring/30 z-10 ring-2"
  )
}

// Blinking text cursor. The theme ships no `caret-blink` keyframe, so the
// built-in `animate-pulse` stands in — it reads as a blink on a 1px accent bar.
function OTPCaret() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="bg-accent-9 h-4 w-px animate-pulse" />
    </div>
  )
}

// Cell painted from render-callback slot data (all-in-one path — `input-otp`
// scopes OTPInputContext to children only, never to the `render` output).
function OTPCell({ char, placeholderChar, hasFakeCaret, isActive }: SlotProps) {
  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cellClassName(isActive)}
    >
      {char ?? placeholderChar}
      {hasFakeCaret ? <OTPCaret /> : null}
    </div>
  )
}

interface InputOTPProps {
  maxLength?: number
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  className?: string
  /** Compound mode: pass InputOTPGroup/Slot/Separator to lay out cells yourself. */
  children?: React.ReactNode
}

function InputOTP({
  maxLength = 6,
  value,
  onChange,
  disabled,
  className,
  children,
}: InputOTPProps) {
  const containerClassName = cn(
    "flex items-center gap-2 has-disabled:opacity-60",
    className
  )
  // Compound mode: children own the layout and read OTPInputContext.
  if (children) {
    return (
      <OTPInput
        data-slot="input-otp"
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        disabled={disabled}
        containerClassName={containerClassName}
        className="disabled:cursor-not-allowed"
      >
        {children}
      </OTPInput>
    )
  }
  // All-in-one: paint every slot as a boxed cell from the render callback.
  return (
    <OTPInput
      data-slot="input-otp"
      maxLength={maxLength}
      value={value}
      onChange={onChange}
      disabled={disabled}
      containerClassName={containerClassName}
      className="disabled:cursor-not-allowed"
      render={({ slots }) => (
        <InputOTPGroup>
          {slots.map((slot, i) => (
            <OTPCell key={i} {...slot} />
          ))}
        </InputOTPGroup>
      )}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & { index: number }) {
  const slot = React.useContext(OTPInputContext).slots[index]
  return (
    <div
      data-slot="input-otp-slot"
      data-active={slot?.isActive}
      className={cn(cellClassName(!!slot?.isActive), className)}
      {...props}
    >
      {slot?.char ?? slot?.placeholderChar}
      {slot?.hasFakeCaret ? <OTPCaret /> : null}
    </div>
  )
}

function InputOTPSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      role="separator"
      className={cn("text-gray-9 flex items-center", className)}
      {...props}
    >
      <MinusIcon className="size-4" />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
export type { InputOTPProps }
