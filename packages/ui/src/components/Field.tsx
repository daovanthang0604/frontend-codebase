"use client"

import { cn } from "@workspace/ui/lib/utils"
import { cva } from "class-variance-authority"
import {
  Group as AriaGroup,
  composeRenderProps,
  type GroupProps as AriaGroupProps,
} from "react-aria-components"

const fieldGroupVariants = cva("", {
  variants: {
    variant: {
      default: [
        // WDS control: white paper surface (bg-panel), 44px tall (--control-h),
        // 14px side padding, 11px radius. Hairline border → accent on focus.
        "bg-panel relative flex h-11 w-full items-center overflow-hidden rounded-md px-3.5 transition-[box-shadow,border-color] duration-150 ease-(--ease-out-quart) md:text-sm",
        "border-gray-a7 border",
        /* SVGs */
        "[&_svg]:text-gray-9 [&_svg]:pointer-events-none [&_svg]:size-[16px] [&_svg]:shrink-0 [&_svg]:stroke-2",
        /* Focus Within */
        "data-[focus-within]:border-accent-8 data-[focus-within]:ring-ring/30 data-[focus-within]:ring-[3px]",
        /* Disabled */
        "data-[disabled]:opacity-60",
        /* Invalid */
        "data-[invalid]:ring-error-9 aria-invalid:ring-error-9 data-[invalid]:border-error-9",
      ],
      ghost: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})
export type FieldGroupVariantProps = {
  variant?: "default" | "ghost" | null | undefined
}
interface GroupProps extends AriaGroupProps, FieldGroupVariantProps {}
function FieldGroup({ className, variant, ...props }: GroupProps) {
  return (
    <AriaGroup
      className={composeRenderProps(className, (className) =>
        cn(fieldGroupVariants({ variant }), className)
      )}
      {...props}
    />
  )
}
export { FieldGroup, fieldGroupVariants }
