import { FieldGroup } from "@workspace/ui/components/Field"
import { Label } from "@workspace/ui/components/Label"
import { Separator } from "@workspace/ui/components/Separator"
import { cn } from "@workspace/ui/lib/utils"
import { ChevronDown, ChevronUp } from "lucide-react"
import {
  Button as AriaButton,
  Input as AriaInput,
  NumberField as AriaNumberField,
  composeRenderProps,
  type ButtonProps as AriaButtonProps,
  type InputProps as AriaInputProps,
  type NumberFieldProps as AriaNumberFieldProps,
} from "react-aria-components"

function NumberFieldInput({
  className,
  ref,
  ...props
}: AriaInputProps & {
  ref?: React.RefCallback<HTMLInputElement>
}) {
  return (
    <AriaInput
      ref={ref}
      inputMode="numeric"
      className={composeRenderProps(className, (className) =>
        cn(
          "placeholder:text-gray-8 w-fit min-w-0 flex-1 border-transparent pr-2 outline-0 [&::-webkit-search-cancel-button]:hidden",
          className
        )
      )}
      {...props}
    />
  )
}
function NumberFieldSteppers({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("absolute right-0 flex items-center", className)}
      {...props}
    >
      <Separator orientation="vertical" className="h-5" />
      <div className="flex flex-col pr-0.5">
        <NumberFieldStepper slot="increment" aria-label="Increment">
          <ChevronUp aria-hidden className="size-4 translate-y-px" />
        </NumberFieldStepper>
        <NumberFieldStepper slot="decrement" aria-label="Decrement">
          <ChevronDown aria-hidden className="size-4 -translate-y-px" />
        </NumberFieldStepper>
      </div>
    </div>
  )
}
function NumberFieldStepper({ className, ...props }: AriaButtonProps) {
  return (
    <AriaButton
      className={composeRenderProps(className, (className) =>
        cn(
          "flex items-center justify-center px-1 transition-[color,background-color,transform]",
          "[&>svg]:text-gray-11 w-auto grow",
          /** Hover */
          "data-hovered:[&>svg]:text-gray-12",
          /** Pressed — WDS press idiom: settle 1px down, no shrink (motion-safe only) */
          "motion-safe:data-pressed:transform-[translateY(1px)]",
          className
        )
      )}
      {...props}
    />
  )
}
interface NumberInputProps extends AriaNumberFieldProps {
  showStepper?: boolean
  placeholder?: string
  label?: string
  withAsterisk?: boolean
  tooltip?: React.ReactNode
  ref?: React.RefCallback<HTMLInputElement>
}
function NumberInput({
  className,
  showStepper = false,
  placeholder,
  label,
  withAsterisk,
  tooltip,
  formatOptions,
  ref,
  ...props
}: NumberInputProps) {
  return (
    <AriaNumberField
      formatOptions={{ useGrouping: false, ...formatOptions }}
      className={composeRenderProps(className, (className) =>
        cn("group flex flex-col gap-1", className)
      )}
      {...props}
    >
      {label && (
        <Label withAsterisk={withAsterisk} tooltip={tooltip}>
          {label}
        </Label>
      )}
      <FieldGroup>
        <NumberFieldInput placeholder={placeholder} ref={ref} />
        {showStepper && <NumberFieldSteppers />}
      </FieldGroup>
    </AriaNumberField>
  )
}
export { NumberInput }
export type { NumberInputProps }
