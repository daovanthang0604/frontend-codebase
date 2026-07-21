import "@workspace/liquid-ui/lib/glass"

import * as React from "react"
import { GlassPanel } from "@workspace/liquid-ui/components/GlassPanel"
import { cn } from "@workspace/liquid-ui/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

// Drop-in for @workspace/liquid-ui/Card. Header/Title/Description/Content are
// reproduced verbatim (only the `cn` import changed). The Card surface itself
// renders as a real GlassPanel instead of the bg-panel/backdrop-blur recipe:
// `default`/`elevated`/`glass` each pick a tint + elevation pair off GlassPanel
// (frost/float, frost/hero, clear/float). The additive `solid` variant keeps
// base-ui's original plain div as a non-glass fallback. No hooks live here, so
// no "use client" -- GlassPanel's own file already carries it.
const cardVariants = cva("text-gray-12 flex flex-col gap-5 py-5", {
  variants: {
    variant: {
      // default/elevated/glass render via <GlassPanel> below -- it supplies
      // fill/blur/border/radius itself, so no Tailwind surface classes here.
      default: "",
      elevated: "",
      glass: "",
      // Non-glass fallback: base-ui's original solid "paper card" recipe.
      solid:
        "border-gray-a5 bg-panel rounded-xl border shadow-sm dark:shadow-none",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

type CardVariantProps = VariantProps<typeof cardVariants>

type CardProps = React.ComponentProps<"div"> & CardVariantProps

function Card({ className, variant, ...props }: CardProps) {
  const classes = cn(cardVariants({ variant }), className)

  if (variant === "solid") {
    return <div data-slot="card" className={classes} {...props} />
  }

  return (
    <GlassPanel
      data-slot="card"
      tint={variant === "glass" ? "clear" : "frost"}
      elevation={variant === "elevated" ? "hero" : "float"}
      className={classes}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-5 [.border-b]:pb-5",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      // WDS card titles are Lora serif display (display-sm = 18px/1.2/700).
      className={cn("text-gray-12 text-display-sm font-serif", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-gray-11 text-sm", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-5", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cardVariants,
}
export type { CardProps }
