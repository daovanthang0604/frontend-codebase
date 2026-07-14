"use client"

import type { ComponentProps } from "react"
import { Field as FieldPrimitive } from "@base-ui/react/field"
import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset"
import { Form as FormPrimitive } from "@base-ui/react/form"
import { labelVariants } from "@workspace/liquid-ui/components/Label"
import { cn } from "@workspace/liquid-ui/lib/utils"

// Thin styled wrappers over Base UI's form primitives (Form / Field / Fieldset).
// Each just ports the WDS look onto the underlying part and passes every prop
// through, so consumers keep Base UI's native validation + error wiring (the
// Form's `errors`, `onFormSubmit`/native `onSubmit`, per-field `validate`, …).
// The label reuses Label.tsx's `labelVariants` and the control borrows Input.tsx's
// `fieldGroup` recipe, so a Field-composed form matches the Input family exactly.

function Form({ className, ...props }: ComponentProps<typeof FormPrimitive>) {
  return (
    <FormPrimitive
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
}

function Field({
  className,
  ...props
}: ComponentProps<typeof FieldPrimitive.Root>) {
  return (
    <FieldPrimitive.Root
      className={cn("group flex flex-col gap-1.5", className)}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: ComponentProps<typeof FieldPrimitive.Label>) {
  return (
    <FieldPrimitive.Label
      className={cn(labelVariants(), className)}
      {...props}
    />
  )
}

function FieldControl({
  className,
  ...props
}: ComponentProps<typeof FieldPrimitive.Control>) {
  return (
    <FieldPrimitive.Control
      className={cn(
        // Input.tsx's control tray (`fieldGroup`), ported onto the bare control:
        // white paper, hairline border, soft accent focus halo, error-red border
        // when the surrounding Field is invalid.
        "bg-panel border-gray-a7 h-11 w-full rounded-md border px-3.5 transition-[box-shadow,border-color] duration-150 outline-none md:text-sm",
        "placeholder:text-gray-8",
        "focus-within:border-accent-a8 focus-within:ring-ring/30 focus-within:ring-2",
        "group-data-[disabled]:cursor-not-allowed group-data-[disabled]:opacity-60",
        "group-data-[invalid]:border-error-9 group-data-[invalid]:ring-error-9",
        className
      )}
      {...props}
    />
  )
}

function FieldError({
  className,
  ...props
}: ComponentProps<typeof FieldPrimitive.Error>) {
  return (
    <FieldPrimitive.Error
      className={cn("text-error-11 text-xs", className)}
      {...props}
    />
  )
}

function FieldDescription({
  className,
  ...props
}: ComponentProps<typeof FieldPrimitive.Description>) {
  return (
    <FieldPrimitive.Description
      className={cn("text-gray-11 text-xs", className)}
      {...props}
    />
  )
}

function Fieldset({
  className,
  ...props
}: ComponentProps<typeof FieldsetPrimitive.Root>) {
  return (
    <FieldsetPrimitive.Root
      className={cn("flex flex-col gap-4 border-0 p-0", className)}
      {...props}
    />
  )
}

function FieldsetLegend({
  className,
  ...props
}: ComponentProps<typeof FieldsetPrimitive.Legend>) {
  return (
    <FieldsetPrimitive.Legend
      className={cn("text-gray-12 text-sm font-semibold", className)}
      {...props}
    />
  )
}

export {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
  Fieldset,
  FieldsetLegend,
  Form,
}
