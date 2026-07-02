"use client"

import React from "react"
import { cva } from "class-variance-authority"
import {
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
  composeRenderProps,
  OverlayArrow,
  type TooltipProps as AriaTooltipProps,
  type TooltipTriggerComponentProps as AriaTooltipTriggerComponentProps,
} from "react-aria-components"

export function TooltipTrigger({
  children,
  ...props
}: AriaTooltipTriggerComponentProps) {
  return (
    <AriaTooltipTrigger delay={0} closeDelay={0} {...props}>
      {children}
    </AriaTooltipTrigger>
  )
}
export interface TooltipProps extends Omit<AriaTooltipProps, "children"> {
  children: React.ReactNode
}
const styles = cva(
  [
    "bg-gray-2 pointer-events-none max-w-lg",
    "group rounded-md border px-2 py-1 text-sm drop-shadow-lg will-change-transform",
  ],
  {
    variants: {
      isEntering: {
        true: 'animate-in fade-in data-[placement="bottom"]:slide-in-from-top-20 data-[placement="top"]:slide-in-from-bottom-20 data-[placement="left"]:slide-in-from-right-20 data-[placement="right"]:slide-in-from-left-20 duration-200 ease-out',
      },
      isExiting: {
        true: 'animate-out fade-out data-[placement="bottom"]:slide-out-to-top-20 data-[placement="top"]:slide-out-to-bottom-20 data-[placement="left"]:slide-out-to-right-20 data-[placement="right"]:slide-out-to-left-20 duration-150 ease-in',
      },
    },
  }
)
export function Tooltip({ children, ...props }: TooltipProps) {
  return (
    <AriaTooltip
      placement="top"
      offset={10}
      className={composeRenderProps(props.className, (className, renderProps) =>
        styles({ ...renderProps, className })
      )}
      {...props}
    >
      <OverlayArrow>
        <svg
          width={8}
          height={8}
          viewBox="0 0 8 8"
          className='fill-gray-2 stroke-gray-6 group-data-[placement="bottom"]:rotate-180 group-data-[placement="left"]:-rotate-90 group-data-[placement="right"]:rotate-90'
        >
          <path d="M0 0 L4 4 L8 0" />
        </svg>
      </OverlayArrow>
      {children}
    </AriaTooltip>
  )
}
