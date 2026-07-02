"use client"

import { useControllableState } from "@radix-ui/react-use-controllable-state"
import { Label, labelVariants } from "@workspace/ui/components/Label"
import { cn } from "@workspace/ui/lib/utils"
import { cva } from "class-variance-authority"
import { Check, Minus } from "lucide-react"
import {
  Checkbox as AriaCheckbox,
  CheckboxGroup as AriaCheckboxGroup,
  composeRenderProps,
  type CheckboxGroupProps as AriaCheckboxGroupProps,
  type CheckboxProps as AriaCheckboxProps,
} from "react-aria-components"

const checkboxVariants = cva(
  ["group/checkbox relative flex cursor-pointer items-center text-sm"],
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
          /* Invalid */
          "data-[invalid]:text-error-11",
        ],
      },
    },
  }
)
function Checkbox({
  className,
  children,
  variant = "default",
  reduceMotion = false,
  isDisabled,
  readOnly,
  ...props
}: AriaCheckboxProps & {
  variant?: "default" | "card"
  reduceMotion?: boolean
  readOnly?: boolean
}) {
  return (
    <AriaCheckbox
      className={composeRenderProps(className, (className) =>
        cn(checkboxVariants({ variant }), labelVariants, className)
      )}
      isDisabled={isDisabled || readOnly}
      {...props}
    >
      {composeRenderProps(children, (children, renderProps) => (
        <>
          <div
            className={cn(
              "transition-all duration-150",
              reduceMotion && "transition-none",
              // WDS: 20px square on white paper (surface-0), hairline border;
              // accent fill + white check when selected.
              "bg-panel text-accent-contrast ring-offset-gray-1 border-gray-a7 flex size-5 shrink-0 items-center justify-center rounded-[6px] border",
              /* Focus Visible */
              "group-data-[focus-visible]/default:ring-2 group-data-[focus-visible]/default:ring-offset-2 group-data-[focus-visible]/default:outline-none",
              /* Selected */
              "group-data-[indeterminate]/checkbox:bg-accent-solid group-data-[selected]/checkbox:bg-accent-solid group-data-[indeterminate]/checkbox:border-accent-solid group-data-[selected]/checkbox:border-accent-solid",
              /* Hovered */
              "group-data-hovered/checkbox:border-gray-8",
              /* Disabled */
              !readOnly &&
                "group-data-[disabled]:cursor-not-allowed group-data-[disabled]/checkbox:cursor-not-allowed group-data-[disabled]/checkbox:opacity-80",
              /* Resets */
              "focus:outline-none focus-visible:outline-none",
              /* Pressed */
              "group-data-pressed/checkbox:scale-[0.95]"
            )}
          >
            {renderProps.isIndeterminate ? (
              <Minus
                className={cn(
                  "animate-in zoom-in-60 fade-in size-4",
                  reduceMotion && "animate-none"
                )}
              />
            ) : renderProps.isSelected ? (
              <Check
                className={cn(
                  "animate-in zoom-in-60 fade-in size-4",
                  reduceMotion && "animate-none"
                )}
              />
            ) : null}
          </div>
          {children}
        </>
      ))}
    </AriaCheckbox>
  )
}
interface CheckboxOption {
  value: string | number
  label: string
}
interface CheckboxGroupProps<T extends CheckboxOption>
  extends Omit<AriaCheckboxGroupProps, "value" | "onChange" | "defaultValue"> {
  /** The label for the checkbox group. */
  label?: string
  /** The options for the checkbox group. */
  options: Array<T>
  /** The variant for the checkbox group. */
  variant?: "default" | "card"
  /** The class name for the checkbox group. */
  className?: string
  /** Whether to show an asterisk for the label. */
  withAsterisk?: boolean
  /** The tooltip for the checkbox group. */
  tooltip?: React.ReactNode
  /** Custom rendering function for each option in the checkbox group. */
  renderOption?: (option: T) => React.ReactNode
  /** If this prop is set, the checkbox group operates in a controlled manner and uses this value as its state. */
  value?: Array<T>
  /** If this prop is set, the checkbox group will call this function with the new value whenever the value changes. */
  onChange?: (value: Array<T>) => void
  /** Initial value used when the component is uncontrolled. */
  defaultValue?: Array<T>
}
function CheckboxGroup<T extends CheckboxOption>({
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
}: CheckboxGroupProps<T>) {
  const [value, onChange] = useControllableState({
    prop: controlledValue,
    defaultProp: defaultValue ?? [],
    onChange: controlledOnChange,
  })
  return (
    <AriaCheckboxGroup
      className="grid gap-1.5"
      value={value.map((v) => JSON.stringify(v))}
      onChange={(v) => onChange(v.map((v) => JSON.parse(v)))}
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
        {options.map((option) => {
          return (
            <Checkbox
              key={option.value}
              value={JSON.stringify(option)}
              variant={variant}
            >
              {renderOption ? renderOption(option) : option.label}
            </Checkbox>
          )
        })}
      </div>
    </AriaCheckboxGroup>
  )
}
export { Checkbox, CheckboxGroup }
export type { CheckboxGroupProps, CheckboxOption }
