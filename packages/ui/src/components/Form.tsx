"use client"

import * as React from "react"
import type { RefObject } from "react"
import { Slot } from "@radix-ui/react-slot"
import { Label } from "@workspace/ui/components/Label"
import { cn } from "@workspace/ui/lib/utils"
import type { LabelProps } from "react-aria-components"
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form"
import { useIntersection } from "react-use"

const Form = FormProvider
type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}
const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }
  const { id } = itemContext
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}
type FormItemContextValue = {
  id: string
}
const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)
function FormItem({
  className,
  flow = "column",
  ...props
}: React.ComponentProps<"div"> & {
  flow?: "row" | "column"
}) {
  const id = React.useId()
  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn(
          "flex gap-1",
          flow === "column" && "flex-col",
          flow === "row" && "flex-row items-center",
          className
        )}
        {...props}
      />
    </FormItemContext.Provider>
  )
}
function FormLabel({ className, ...props }: LabelProps) {
  const { error, formItemId } = useFormField()
  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("whitespace-nowrap", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}
function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
  const ariaProps = {
    isInvalid: !!error,
  }
  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...ariaProps}
      {...props}
    />
  )
}
function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField()
  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-gray-11 my-0 text-xs", className)}
      {...props}
    />
  )
}
function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : props.children
  if (!body) {
    return null
  }
  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-error-11 my-0 text-[13px]", className)}
      {...props}
    >
      {body}
    </p>
  )
}
function setSubmitErrors(
  form: UseFormReturn<any>,
  error: Record<string, string>
) {
  try {
    Object.entries(error).forEach(([key, value]) => {
      form.setError(key, { message: value })
    })
    // focus the first error
    form.setFocus(Object.keys(error)[0] as string)
  } catch (error) {
    console.error(error)
  }
}
interface FormFloatingActionsProps extends React.PropsWithChildren {
  className?: string
}
function FormFloatingActions({
  children,
  className,
}: FormFloatingActionsProps) {
  const startIntersectionRef = React.useRef<HTMLDivElement>(null)
  const intersection = useIntersection(
    startIntersectionRef as RefObject<HTMLElement>,
    { root: document.body }
  )
  return (
    <>
      <div
        data-intersecting={intersection?.isIntersecting}
        className={cn(
          "group w-[calc(100%+18px)] translate-x-[-9px] border border-transparent p-2 transition-all",
          !intersection?.isIntersecting &&
            "bg-gray-1 border-gray-6 sticky bottom-2 z-10 rounded-xl shadow-lg",
          className
        )}
      >
        {children}
      </div>
      <div ref={startIntersectionRef} />
    </>
  )
}
export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormFloatingActions,
  setSubmitErrors,
  useFormField,
}
