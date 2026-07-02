"use client"

import { Tooltip, TooltipTrigger } from "@workspace/ui/components/Tooltip"
import { cn } from "@workspace/ui/lib/utils"
import { cva } from "class-variance-authority"
import { InfoIcon } from "lucide-react"
import {
  Label as AriaLabel,
  Focusable,
  Pressable,
  type LabelProps as AriaLabelProps,
} from "react-aria-components"

import { Button } from "./Button"
import { Popover, PopoverDialog, PopoverTrigger } from "./Popover"

const labelVariants = cva([
  // WDS field label: 12px / 600 / 0.04em tracking, muted ink.
  "text-gray-11 flex items-center gap-1 text-[12px] font-semibold tracking-[0.04em]",
  /* Disabled */
  "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70",
])
interface LabelProps extends AriaLabelProps {
  withAsterisk?: boolean
  tooltip?: React.ReactNode
}
function Label({
  children,
  className,
  withAsterisk,
  tooltip,
  ...props
}: LabelProps) {
  return (
    <AriaLabel className={cn(labelVariants(), className)} {...props}>
      {children}
      {withAsterisk && <span className="text-error-9"> *</span>}
      {tooltip && (
        <>
          <TooltipTrigger delay={0} closeDelay={0}>
            <Focusable>
              <InfoIcon className="text-gray-11 size-[14px] outline-none pointer-coarse:hidden" />
            </Focusable>
            <Tooltip>{tooltip}</Tooltip>
          </TooltipTrigger>
          <PopoverTrigger>
            <Button
              slot={null}
              size="sm"
              mode="icon"
              type="button"
              variant="ghost"
              className="-translate-x-1 pointer-fine:hidden"
            >
              <InfoIcon className="text-gray-11 size-[14px]! outline-none" />
            </Button>
            <Popover placement="top">
              <PopoverDialog className="p-2 text-sm">{tooltip}</PopoverDialog>
            </Popover>
          </PopoverTrigger>
        </>
      )}
    </AriaLabel>
  )
}
export { Label, labelVariants }
