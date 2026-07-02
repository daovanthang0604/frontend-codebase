"use client"

import { countdownMachine } from "@workspace/ui/components/Button.machine"
import {
  buttonVariants,
  type ButtonVariantProps,
} from "@workspace/ui/components/Button.variants"
import { Spinner } from "@workspace/ui/components/Spinner"
import { Tooltip, TooltipTrigger } from "@workspace/ui/components/Tooltip"
import { cn, formatCount } from "@workspace/ui/lib/utils"
import { useMachine } from "@xstate/react"
import { cva } from "class-variance-authority"
import { Slot } from "radix-ui"
import {
  Button as AriaButton,
  Focusable,
  type ButtonProps as AriaButtonProps,
  type PressEvent,
} from "react-aria-components"

interface CommonButtonProps
  extends AriaButtonProps,
    React.RefAttributes<HTMLButtonElement>,
    ButtonVariantProps {
  /* If true, the button will be rendered as a child */
  asChild?: boolean
  /** If true, the button will show a loading state */
  isLoading?: boolean
  /** The delay of the tooltip */
  tooltipDelay?: number
  /** If provided, the tooltip can be controlled externally */
  tooltipIsOpen?: boolean
  /** Called when tooltip open state changes (hover/focus/escape/etc) */
  onTooltipOpenChange?: (isOpen: boolean) => void
  /** The close delay of the tooltip */
  tooltipCloseDelay?: number
  /** The test id of the button */
  testId?: string
  /** If true, the button will show a badge */
  withBadge?: boolean
  /** The badge number of the button */
  badgeNumber?: number
}
export interface IconButtonProps extends CommonButtonProps {
  mode: "icon"
  /** Tooltip text for the button. */
  tooltip?: string | React.ReactNode
  /** The placement of the tooltip */
  tooltipPlacement?: "top" | "bottom" | "left" | "right"
}
export interface DefaultButtonProps extends CommonButtonProps {
  mode?: "default"
  /** Optional tooltip for default buttons */
  tooltip?: string | React.ReactNode
  /** The left icon of the button */
  leftIcon?: React.ReactNode
  /** The right icon of the button */
  rightIcon?: React.ReactNode
  /** If provided, the button will show a countdown */
  countdown?: number
  /** The placement of the tooltip */
  tooltipPlacement?: "top" | "bottom" | "left" | "right"
}
type ButtonProps = IconButtonProps | DefaultButtonProps
function Button(props: ButtonProps) {
  const {
    mode,
    size,
    intent,
    variant = "solid",
    className,
    fullWidth,
    isMenuItem,
    asChild = false,
    isLoading = false,
    children,
    isDisabled,
    tooltip,
    tooltipDelay = 1000,
    tooltipIsOpen,
    onTooltipOpenChange,
    tooltipCloseDelay = 0,
    tooltipPlacement = "top",
    withBadge,
    badgeNumber,
    testId,
    onPress,
    ...restProps
  } = props
  const isDefault = mode === "default" || mode === undefined
  const defaultIntent =
    variant === "solid" || variant === "link" ? "primary" : "secondary"
  const leftIcon = isDefault ? props.leftIcon : undefined
  const rightIcon = isDefault ? props.rightIcon : undefined
  // countdown and state machine setup
  const hasCountdown = isDefault && props.countdown !== undefined
  const initialCount = isDefault ? props.countdown : undefined
  const [state, send] = useMachine(countdownMachine, {
    input: {
      initialCount: initialCount || 0,
    },
  })
  const count = state.context.count
  const isCounting = hasCountdown && state.matches("Counting")
  const pressProps = {
    onPress: hasCountdown
      ? (e: PressEvent) => {
          send({ type: "START" })
          onPress?.(e)
        }
      : onPress,
  }
  // rendering
  const Comp = (asChild ? Slot.Root : AriaButton) as any
  const isLoadingOrDisabled = isLoading || isDisabled || isCounting
  const ariaProps: AriaButtonProps = asChild
    ? {}
    : {
        isPending: isLoading,
        isDisabled: isLoadingOrDisabled,
      }
  const button = (
    <Comp
      type="button"
      aria-label={mode === "icon" ? tooltip : undefined}
      data-testid={testId}
      data-has-right-element={!!rightIcon}
      data-has-left-element={!!leftIcon}
      className={cn(
        buttonVariants({
          mode,
          size,
          intent: intent || defaultIntent,
          variant,
          className,
          fullWidth,
          isMenuItem,
        })
      )}
      {...ariaProps}
      {...pressProps}
      {...restProps}
    >
      {isLoading && (
        <div className="spinner absolute inset-0 flex items-center justify-center text-transparent">
          <Spinner />
        </div>
      )}

      {/* badge */}
      {withBadge && (
        <div className="absolute top-0 right-0 z-[1] translate-x-1/2 -translate-y-1/2">
          <ButtonBadge
            badgeNumber={badgeNumber || 0}
            className="border-gray-1 border"
          />
        </div>
      )}

      {/* left icon */}
      {leftIcon}

      {/* children */}
      <Slot.Slottable>{children as React.ReactNode}</Slot.Slottable>

      {/* countdown  */}
      {hasCountdown && isCounting && (
        <ButtonBadge
          intent="secondary"
          badgeNumber={count}
          maxVisibleNumber={99}
        />
      )}

      {/* right icon */}
      {rightIcon}
    </Comp>
  )
  if (tooltip) {
    const isControlled = tooltipIsOpen !== undefined
    return (
      <TooltipTrigger
        delay={tooltipDelay}
        closeDelay={tooltipCloseDelay}
        {...(isControlled
          ? {
              isOpen: tooltipIsOpen,
              onOpenChange: onTooltipOpenChange ?? (() => {}),
            }
          : {})}
      >
        {asChild ? <Focusable>{button}</Focusable> : button}
        <Tooltip style={{ zIndex: 100000000 }} placement={tooltipPlacement}>
          {tooltip}
        </Tooltip>
      </TooltipTrigger>
    )
  }
  return button
}
const badgeVariants = cva(
  "bg-error-9 text-gray-12 flex min-h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-[14px]",
  {
    variants: {
      intent: {
        primary: "bg-accent-9",
        secondary: "bg-gray-9",
        danger: "bg-error-9",
      },
    },
    defaultVariants: {
      intent: "danger",
    },
  }
)
interface ButtonBadgeProps {
  badgeNumber?: number
  className?: string
  maxVisibleNumber?: number
  intent?: "primary" | "secondary" | "danger"
}
function ButtonBadge({
  badgeNumber,
  className,
  maxVisibleNumber = 9,
  intent,
}: ButtonBadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({ intent }),
        badgeNumber && badgeNumber > maxVisibleNumber && "pr-[3px]",
        !badgeNumber && "min-h-3 min-w-3",
        className
      )}
    >
      {badgeNumber ? formatCount(badgeNumber, maxVisibleNumber) : ""}
    </div>
  )
}
export { Button, ButtonBadge, buttonVariants }
export type { ButtonProps }
