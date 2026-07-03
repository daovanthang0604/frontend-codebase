"use client"

import { useControllableState } from "@radix-ui/react-use-controllable-state"
import { Label } from "@workspace/ui/components/Label"
import { cn } from "@workspace/ui/lib/utils"
import { cva } from "class-variance-authority"
import { Circle } from "lucide-react"
import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  composeRenderProps,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps as AriaRadioProps,
} from "react-aria-components"

function BaseRadioGroup({ className, ...props }: AriaRadioGroupProps) {
  return (
    <AriaRadioGroup
      aria-label="radio"
      className={composeRenderProps(className, (className) =>
        cn("group/radiogroup flex flex-col flex-wrap gap-2", className)
      )}
      {...props}
    />
  )
}
const radioVariants = cva(
  [
    "group/radio flex cursor-pointer items-center text-sm",
    /* Disabled */
    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70",
    /* Invalid */
    "data-[invalid]:text-error-11",
  ],
  {
    variants: {
      variant: {
        default: ["group/default gap-x-2"],
        card: [
          "gap-x-3.5",
          // WDS soft card: white paper, hairline, 14px radius.
          "bg-panel border-gray-a7 rounded-lg border p-3.5",
          /* Selected — accent border + accent-soft tint */
          "data-selected:border-accent-8 data-selected:bg-accent-3 data-selected:border-1",
          /* Hovered */
          "data-hovered:border-gray-8",
          /* Focus Visible */
          "ring-offset-2 data-focus-visible:ring-2",
        ],
      },
    },
  }
)
type RadioVariantProps = {
  variant?: "default" | "card" | null | undefined
}
function Radio({
  className: _className,
  children,
  variant = "default",
  ...props
}: AriaRadioProps & RadioVariantProps) {
  return (
    <AriaRadio className={radioVariants({ variant })} {...props}>
      {composeRenderProps(children, (children, renderProps) => (
        <>
          <span
            className={cn(
              "transition-colors",
              // WDS radio: a 20px ring (not a filled disc) on white paper; the
              // ring + inner dot go accent (navy) when selected.
              "bg-panel ring-offset-gray-1 border-gray-a7 flex aspect-square size-5 items-center justify-center rounded-full border-2",
              /* Focus */
              "group-data-[focused]/radio:outline-none",
              /* Focus Visible */
              "group-data-[focus-visible]/default:ring-2 group-data-[focus-visible]/default:ring-offset-2",
              /* Selected — accent ring + accent inner dot (text drives the dot) */
              "group-data-[selected]/radio:border-accent-solid group-data-[selected]/radio:text-accent-solid",
              /* Hovered */
              "group-data-hovered/radio:border-gray-8",
              /* Pressed */
              "group-data-pressed/radio:scale-[0.95]",
              /* Disabled */
              "group-data-[disabled]/radio:cursor-not-allowed group-data-[disabled]/radio:opacity-50"
            )}
          >
            {renderProps.isSelected && (
              <Circle
                className={cn(
                  "animate-in fade-in-0 zoom-in-60 size-2.5 fill-current text-current"
                )}
              />
            )}
          </span>
          {children}
        </>
      ))}
    </AriaRadio>
  )
}
interface RadioOption {
  value: string | number
  label: string
}
interface RadioGroupProps<T extends RadioOption>
  extends Omit<AriaRadioGroupProps, "value" | "onChange" | "defaultValue"> {
  /** The label for the radio group. */
  label?: string
  /** The options for the radio group. */
  options: Array<T>
  /** The variant for the radio group. */
  variant?: "default" | "card"
  /** The class name for the radio group. */
  className?: string
  /** Whether to show an asterisk for the label. */
  withAsterisk?: boolean
  /** The tooltip for the radio group. */
  tooltip?: React.ReactNode
  /** Custom rendering function for each option in the radio group. */
  renderOption?: (option: T) => React.ReactNode
  /** If this prop is set, the radio group operates in a controlled manner and uses this value as its state. */
  value?: T
  /** If this prop is set, the radio group will call this function with the new value whenever the value changes. */
  onChange?: (value: T | undefined) => void
  /** Initial value used when the component is uncontrolled. */
  defaultValue?: T
}
function RadioGroup<T extends RadioOption>({
  options,
  renderOption,
  variant = "default",
  className,
  label,
  withAsterisk,
  tooltip,
  value: controlledValue,
  onChange: controlledOnChange,
  defaultValue,
  ...props
}: RadioGroupProps<T>) {
  const [value, onChange] = useControllableState<T | undefined>({
    prop: controlledValue,
    defaultProp: defaultValue,
    onChange: controlledOnChange,
  })
  return (
    <BaseRadioGroup
      value={JSON.stringify(value)}
      onChange={(v) => onChange(JSON.parse(v))}
      {...props}
    >
      {label && (
        <Label withAsterisk={withAsterisk} tooltip={tooltip}>
          {label}
        </Label>
      )}
      <div
        className={cn(
          "grid",
          variant === "card" && "gap-2.5",
          variant === "default" && "gap-1.5",
          className
        )}
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            value={JSON.stringify(option)}
            variant={variant}
          >
            {renderOption ? renderOption(option) : option.label}
          </Radio>
        ))}
      </div>
    </BaseRadioGroup>
  )
}
export { BaseRadioGroup, Radio, RadioGroup }
export type { RadioGroupProps, RadioOption }
