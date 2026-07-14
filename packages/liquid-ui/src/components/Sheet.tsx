"use client"

import "@workspace/liquid-ui/lib/glass"

import {
  Children,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react"
import { Dialog as BaseDialog } from "@base-ui/react/dialog"
import { Button } from "@workspace/base-ui/components/Button"
import { cn } from "@workspace/liquid-ui/lib/utils"
import { X } from "lucide-react"

// Drop-in for @workspace/ui/Sheet — a side drawer. Same Base UI dialog machinery
// as our Dialog (modal: focus trap + scroll lock + Esc), but the Popup anchors to
// an edge and slides in. Same call shape:
//   <SheetTrigger>
//     <Button/>
//     <SheetContent side="right"><SheetHeader>…</SheetHeader></SheetContent>
//   </SheetTrigger>

interface SheetTriggerProps {
  children: ReactNode
  isOpen?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

function SheetTrigger({
  children,
  isOpen,
  defaultOpen,
  onOpenChange,
}: SheetTriggerProps) {
  const [trigger, ...content] = Children.toArray(children)
  return (
    <BaseDialog.Root
      open={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <BaseDialog.Trigger render={trigger as ReactElement} />
      {content}
    </BaseDialog.Root>
  )
}

function SheetOverlay({ className }: { className?: string }) {
  return (
    <BaseDialog.Backdrop
      className={cn(
        "glass-scrim fixed inset-0 z-50",
        "transition-opacity duration-300 ease-out data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        className
      )}
    />
  )
}

type SheetSide = "top" | "right" | "bottom" | "left"

// Anchor to the edge + slide from it. The drawer sits at an edge (no centering
// translate), so the animation translate is unopposed. NB: Tailwind v4 emits
// translate-*-full as the `translate` property, so the transition names it.
const sideClasses: Record<SheetSide, string> = {
  right:
    "inset-y-0 right-0 h-full w-3/4 sm:max-w-sm data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full",
  left: "inset-y-0 left-0 h-full w-3/4 sm:max-w-sm data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full",
  top: "inset-x-0 top-0 h-auto data-[starting-style]:-translate-y-full data-[ending-style]:-translate-y-full",
  bottom:
    "inset-x-0 bottom-0 h-auto data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full",
}

interface SheetContentProps {
  children?: ReactNode
  className?: string
  closeButton?: boolean
  side?: SheetSide
}

function SheetContent({
  children,
  className,
  closeButton = true,
  side = "right",
}: SheetContentProps) {
  return (
    <BaseDialog.Portal>
      <SheetOverlay />
      <BaseDialog.Popup
        className={cn(
          // Liquid glass surface: glass-overlay swaps in the frosted-glass
          // material (fill + blur + rim + sheen + shadow) in place of the solid
          // bg-panel/shadow-lg recipe (the per-side border also drops out of
          // sideClasses below); edge geometry stays exactly as base-ui's.
          "glass-overlay fixed z-50 flex flex-col gap-4 outline-none",
          "transition-[translate] duration-300 ease-out",
          sideClasses[side],
          className
        )}
      >
        {children}
        {closeButton && (
          <BaseDialog.Close
            render={
              <Button
                size="sm"
                mode="icon"
                variant="ghost"
                className="absolute top-2.5 right-2.5 z-[2]"
              >
                <X className="text-gray-11 size-4!" />
                <span className="sr-only">Close</span>
              </Button>
            }
          />
        )}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  )
}

function SheetHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-1.5 p-4", className)} {...props} />
  )
}

function SheetFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: ComponentProps<typeof BaseDialog.Title>) {
  return (
    <BaseDialog.Title
      className={cn("text-gray-12 text-display-sm font-serif", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: ComponentProps<typeof BaseDialog.Description>) {
  return (
    <BaseDialog.Description
      className={cn("text-gray-11 text-sm", className)}
      {...props}
    />
  )
}

const SheetClose = BaseDialog.Close

export {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
  SheetTrigger,
}
export type { SheetContentProps }
