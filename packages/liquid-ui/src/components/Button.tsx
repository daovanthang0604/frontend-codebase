"use client"

import "@workspace/liquid-ui/lib/glass"

import * as React from "react"

import {
  buttonVariants,
  type ButtonVariantProps,
} from "@workspace/liquid-ui/components/Button.variants"
import { Spinner } from "@workspace/liquid-ui/components/Spinner"
import { cn } from "@workspace/liquid-ui/lib/utils"

// Lean, Base-UI-consistent Button — a styled native <button> over the shared
// buttonVariants (variant / intent / size / mode). Standalone: NO react-aria, NO
// xstate. It still ACCEPTS the react-aria-flavoured props the ported base-ui
// components pass (isDisabled, onPress, leftIcon/rightIcon, tooltip, asChild, …)
// and maps them to native behaviour, so those components keep working — but the
// heavy machinery (a real tooltip popover, press-event system, countdown state
// machine) is intentionally dropped. `intent` defaults contextually (primary for
// solid/link, else secondary) to match the look the variants encode. `tooltip`
// degrades to the native `title`.
type ButtonProps = Omit<React.ComponentProps<"button">, "onClick"> &
  ButtonVariantProps & {
    isDisabled?: boolean
    isLoading?: boolean
    fullWidth?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    onPress?: React.MouseEventHandler<HTMLButtonElement>
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    tooltip?: React.ReactNode
    tooltipPlacement?: string
    tooltipDelay?: number
    onTooltipOpenChange?: (open: boolean) => void
    excludeFromTabOrder?: boolean
    isMenuItem?: boolean
    asChild?: boolean
  }

function Button({
  className,
  variant,
  intent,
  size,
  mode,
  type = "button",
  isDisabled,
  disabled,
  isLoading,
  fullWidth,
  leftIcon,
  rightIcon,
  children,
  onPress,
  onClick,
  tooltip,
  // accepted for API compatibility, no popover in the lean button:
  tooltipPlacement: _tooltipPlacement,
  tooltipDelay: _tooltipDelay,
  onTooltipOpenChange: _onTooltipOpenChange,
  excludeFromTabOrder,
  isMenuItem: _isMenuItem,
  asChild,
  tabIndex,
  ...props
}: ButtonProps) {
  const resolvedIntent =
    intent ??
    (variant === undefined || variant === "solid" || variant === "link"
      ? "primary"
      : "secondary")
  const classes = cn(
    buttonVariants({ variant, intent: resolvedIntent, size, mode }),
    fullWidth && "w-full",
    className
  )
  const isOff = (isDisabled ?? disabled) || isLoading
  const handleClick = onPress ?? onClick

  // asChild: render the single child element AS the button (minimal Slot).
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>
    return React.cloneElement(child, {
      ...props,
      className: cn(classes, child.props.className as string | undefined),
    })
  }

  return (
    <button
      {...props}
      type={type}
      data-slot="button"
      disabled={isOff}
      tabIndex={excludeFromTabOrder ? -1 : tabIndex}
      title={typeof tooltip === "string" ? tooltip : undefined}
      className={classes}
      onClick={handleClick}
    >
      {isLoading ? <Spinner /> : leftIcon}
      {children}
      {rightIcon}
    </button>
  )
}

// GlassButton — a frosted-glass action. `ghost` is the only variant with no solid
// fill at rest, so the shared .glass-overlay recipe (blur + saturate, rim, sheen,
// shadow) reads as the button's own surface. Thin wrapper: every Button prop still
// works; `variant` is pinned so the glass look can't be swapped for a solid fill.
function GlassButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      variant="ghost"
      className={cn("glass-overlay", className)}
    />
  )
}

export { Button, GlassButton, buttonVariants }
export type { ButtonProps }
