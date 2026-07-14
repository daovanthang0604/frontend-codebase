"use client"

import { isValidElement, type ReactElement } from "react"
import {
  Button as BaseButton,
  type ButtonProps as BaseButtonProps,
} from "@base-ui/react/button"
import {
  buttonVariants,
  type ButtonVariantProps,
} from "@workspace/base-ui/components/Button.variants"
import { Spinner } from "@workspace/base-ui/components/Spinner"
import { Tooltip, TooltipTrigger } from "@workspace/base-ui/components/Tooltip"
import { cn, formatCount } from "@workspace/base-ui/lib/utils"
import { cva } from "class-variance-authority"
import { omit } from "lodash"

// Rebuilt on Base UI's Button primitive (was a facade re-export of
// @workspace/ui/Button). Keeps the ui Button's external API so it stays a drop-in
// for the ~25 consumers in this kit — the react-aria idioms they still pass map
// onto Base UI: isDisabled -> disabled, onPress -> onClick, asChild -> the render
// prop, excludeFromTabOrder -> tabIndex, and the loading state is driven by a
// self-set data-pending (Base UI has no isPending). ui/Button's countdown +
// isMenuItem are dropped (unused here); the tooltip + badge are kept.

type TooltipPlacement = "top" | "bottom" | "left" | "right"

type CommonButtonProps = BaseButtonProps &
  ButtonVariantProps & {
    /** If true, the button shows a loading spinner (visual only, still clickable) */
    isLoading?: boolean
    /** If true, the button is disabled */
    isDisabled?: boolean
    /** Render as the single child element (e.g. a router <Link>) via Base UI's render prop */
    asChild?: boolean
    /** If true, the button is skipped in the tab order */
    excludeFromTabOrder?: boolean
    /** react-aria press handler, folded into onClick */
    onPress?: BaseButtonProps["onClick"]
    /** The open delay of the tooltip */
    tooltipDelay?: number
    /** The placement of the tooltip */
    tooltipPlacement?: TooltipPlacement
    /** The test id of the button */
    testId?: string
    /** If true, the button shows a badge */
    withBadge?: boolean
    /** The badge number of the button */
    badgeNumber?: number
  }

type IconButtonProps = CommonButtonProps & {
  mode: "icon"
  /** Tooltip text — also the accessible label in icon mode. */
  tooltip?: React.ReactNode
}

type DefaultButtonProps = CommonButtonProps & {
  mode?: "default"
  /** Optional tooltip for the button. */
  tooltip?: React.ReactNode
  /** The left icon of the button */
  leftIcon?: React.ReactNode
  /** The right icon of the button */
  rightIcon?: React.ReactNode
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
    isLoading = false,
    isDisabled,
    disabled,
    asChild = false,
    excludeFromTabOrder,
    onPress,
    onClick,
    children,
    tooltip,
    tooltipDelay = 400,
    tooltipPlacement = "top",
    withBadge,
    badgeNumber,
    testId,
    ...restProps
  } = props

  const isDefault = mode === "default" || mode === undefined
  const defaultIntent =
    variant === "solid" || variant === "link" ? "primary" : "secondary"

  // leftIcon/rightIcon only live on the default arm of the union.
  const defaultProps = isDefault ? (props as DefaultButtonProps) : undefined
  const leftIcon = defaultProps?.leftIcon
  const rightIcon = defaultProps?.rightIcon

  // asChild renders the caller's element (e.g. a router <Link>) through Base UI's
  // render prop; the element is non-native and self-contained, so we skip the
  // inner decorations (icons/spinner/badge).
  const useRender = asChild && isValidElement(children)

  // onPress is the react-aria idiom our consumers still use; fold it into onClick.
  const handleClick: BaseButtonProps["onClick"] =
    onClick || onPress
      ? (e) => {
          onClick?.(e)
          onPress?.(e)
        }
      : undefined

  const sharedProps = {
    // Default to type=button so buttons inside forms don't submit; a caller's
    // explicit type (in restProps) still wins. Skipped when rendering as another
    // element, which brings its own semantics.
    ...(!useRender && { type: "button" as const }),
    // Base UI has no isPending; drive the loading styles off our own data-pending.
    ...(isLoading && { "data-pending": true }),
    "aria-label":
      mode === "icon" && typeof tooltip === "string" ? tooltip : undefined,
    "data-testid": testId,
    "data-has-right-element": !!rightIcon,
    "data-has-left-element": !!leftIcon,
    disabled: isDisabled ?? disabled,
    tabIndex: excludeFromTabOrder ? -1 : undefined,
    onClick: handleClick,
    className: cn(
      buttonVariants({
        mode,
        size,
        intent: intent || defaultIntent,
        variant,
        className,
        fullWidth,
      })
    ),
    ...omit(restProps, ["leftIcon", "rightIcon"]),
  }

  const button = useRender ? (
    <BaseButton
      render={children as ReactElement}
      nativeButton={false}
      {...sharedProps}
    />
  ) : (
    <BaseButton {...sharedProps}>
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
      {children}

      {/* right icon */}
      {rightIcon}
    </BaseButton>
  )

  if (tooltip) {
    return (
      <TooltipTrigger delay={tooltipDelay}>
        {button}
        <Tooltip placement={tooltipPlacement}>{tooltip}</Tooltip>
      </TooltipTrigger>
    )
  }

  return button
}

const badgeVariants = cva(
  "bg-error-9 flex min-h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-[14px] text-white",
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
