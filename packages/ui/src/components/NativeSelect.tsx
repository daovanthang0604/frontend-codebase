import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { cva } from "class-variance-authority"
import { ChevronDownIcon } from "lucide-react"

const nativeSelectVariants = cva(
  [
    "placeholder:text-gray-8 text-gray-12 h-8 w-full min-w-0 appearance-none rounded-md bg-transparent px-3 pr-7 text-sm font-medium transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed",
    "ring-inset focus-visible:ring-2",
    "aria-invalid:ring-error-9 aria-invalid:border-error-9",
  ],
  {
    variants: {
      variant: {
        outline: "bg-gray-2 border-gray-7 hover:not-disabled:bg-gray-3 border",
        minimal: "bg-gray-3 hover:not-disabled:bg-gray-4",
        ghost: "hover:not-disabled:bg-gray-3 bg-transparent",
      },
      size: {
        sm: "h-7 pl-2.5 [&_select-icon]:right-2.5",
        md: "h-8",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
    },
  }
)

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  variant?: "outline" | "minimal" | "ghost"
  size?: "sm" | "md"
}

function NativeSelect({
  className,
  variant,
  size = "md",
  ...props
}: NativeSelectProps) {
  return (
    <div
      className="group/native-select relative w-fit has-[select:disabled]:opacity-50"
      data-slot="native-select-wrapper"
    >
      <select
        data-slot="native-select"
        className={cn(nativeSelectVariants({ variant, size }), className)}
        {...props}
      />
      <ChevronDownIcon
        className="select-icon text-gray-12 pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 opacity-50 select-none"
        data-slot="native-select-icon"
      />
    </div>
  )
}

function NativeSelectOption({ ...props }: React.ComponentProps<"option">) {
  return <option data-slot="native-select-option" {...props} />
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn(className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
