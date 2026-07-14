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

// Drop-in for @workspace/ui/Dialog, rebuilt on Base UI (Root/Trigger/Portal/
// Backdrop/Popup/Title/Description/Close). Modal by default — Base UI's Root
// handles the focus trap, scroll lock and Esc. Same call shape:
//   <DialogTrigger>
//     <Button/>                          {/* trigger */}
//     <DialogContent>
//       <DialogHeader><DialogTitle/><DialogDescription/></DialogHeader>
//       <DialogFooter>…<DialogClose>…</DialogClose></DialogFooter>
//     </DialogContent>
//   </DialogTrigger>
// react-aria wired close via a Button with slot="close"; Base UI uses the
// <DialogClose> part instead (the one intentional API change).

interface DialogTriggerProps {
  children: ReactNode
  isOpen?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

function DialogTrigger({
  children,
  isOpen,
  defaultOpen,
  onOpenChange,
}: DialogTriggerProps) {
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

function DialogOverlay({ className }: { className?: string }) {
  return (
    <BaseDialog.Backdrop
      className={cn(
        "glass-scrim fixed inset-0 z-50",
        "transition-opacity duration-200 ease-out data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        className
      )}
    />
  )
}

interface DialogContentProps {
  children?: ReactNode
  className?: string
  /** Whether to show the top-right close button */
  closeButton?: boolean
}

function DialogContent({
  children,
  className,
  closeButton = true,
}: DialogContentProps) {
  return (
    <BaseDialog.Portal>
      <DialogOverlay />
      <BaseDialog.Popup
        className={cn(
          // Liquid glass surface: glass-overlay swaps in the frosted-glass
          // material (fill + blur + rim + sheen + shadow) in place of the
          // solid bg-panel/shadow-2xl/dark:border recipe; radius stays
          // Tailwind's 2xl. translate centers it, scale drives the zoom —
          // separate css properties in Tailwind v4, so they don't fight.
          "glass-overlay fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-40px)] w-full max-w-[calc(100vw-40px)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-2xl p-5 outline-none md:max-w-lg",
          "origin-center transition-[opacity,scale] duration-200 ease-out",
          "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
          "data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:duration-150",
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
                className="absolute top-2.5 right-2.5"
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

function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-4 text-center sm:text-left",
        className
      )}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: ComponentProps<typeof BaseDialog.Title>) {
  return (
    <BaseDialog.Title
      // WDS dialog title: Lora editorial display.
      className={cn("text-gray-12 text-display-md font-serif", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof BaseDialog.Description>) {
  return (
    <BaseDialog.Description
      className={cn(
        "text-gray-11 flex flex-col space-y-1.5 text-center text-sm sm:text-left",
        className
      )}
      {...props}
    />
  )
}

// Wrap any button to close the dialog (react-aria's slot="close" equivalent).
const DialogClose = BaseDialog.Close

export {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
}
export type { DialogContentProps }
