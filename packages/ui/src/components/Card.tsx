import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const cardVariants = cva(
  "text-gray-12 flex flex-col gap-5 rounded-xl border py-5",
  {
    variants: {
      variant: {
        // WDS: white paper card (bg-panel) on the cream page, hairline + soft
        // warm shadow so it reads as a separate liftable object.
        default: "border-gray-a5 bg-panel shadow-sm dark:shadow-none",
        elevated: "border-gray-a4 bg-panel shadow-md dark:shadow-lg",
        glass: "border-gray-a5 bg-panel/70 shadow-xl backdrop-blur-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type CardVariantProps = VariantProps<typeof cardVariants>

type CardProps = React.ComponentProps<"div"> & CardVariantProps

function Card({ className, variant, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant }), className)}
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
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
}
export type { CardProps }
