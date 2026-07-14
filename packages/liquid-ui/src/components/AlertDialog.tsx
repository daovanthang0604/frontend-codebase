"use client"

import "@workspace/liquid-ui/lib/glass"

import { type ComponentProps, type ReactElement, type ReactNode } from "react"
import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog"
import { Button } from "@workspace/liquid-ui/components/Button"
import { cn } from "@workspace/liquid-ui/lib/utils"

// Modal confirm dialog on Base UI (Root/Trigger/Portal/Backdrop/Popup/Title/
// Description/Close). Mirrors Dialog.tsx's surface + entrance recipe verbatim,
// but this is Base UI's *alert-dialog*: it does NOT close on outside click (or
// Esc-to-outside-press) — the user must pick an explicit action, so there is no
// top-right X either. Root owns the focus trap, scroll lock and Esc. Shape:
//   <AlertDialog>
//     <AlertDialogTrigger><Button/></AlertDialogTrigger>
//     <AlertDialogContent>
//       <AlertDialogHeader>
//         <AlertDialogTitle/><AlertDialogDescription/>
//       </AlertDialogHeader>
//       <AlertDialogFooter>
//         <AlertDialogCancel>Cancel</AlertDialogCancel>
//         <AlertDialogAction>Confirm</AlertDialogAction>
//       </AlertDialogFooter>
//     </AlertDialogContent>
//   </AlertDialog>

// Root — groups all parts (open/defaultOpen/onOpenChange live here).
const AlertDialog = BaseAlertDialog.Root

// Feed the single child to Base UI's `render` so its open handlers merge onto it
// (matches the kit's "first child = trigger" convention).
function AlertDialogTrigger({ children }: { children: ReactElement }) {
  return <BaseAlertDialog.Trigger render={children} />
}

function AlertDialogOverlay({ className }: { className?: string }) {
  return (
    <BaseAlertDialog.Backdrop
      className={cn(
        "glass-scrim fixed inset-0 z-50",
        "transition-opacity duration-200 ease-out data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        className
      )}
    />
  )
}

interface AlertDialogContentProps {
  children?: ReactNode
  className?: string
}

function AlertDialogContent({ children, className }: AlertDialogContentProps) {
  return (
    <BaseAlertDialog.Portal>
      <AlertDialogOverlay />
      <BaseAlertDialog.Popup
        className={cn(
          // Liquid glass surface: glass-overlay swaps in the frosted-glass
          // material (fill + blur + rim + sheen + shadow) in place of the
          // solid bg-panel/border/shadow-2xl recipe; radius stays Tailwind's.
          // translate centers it, scale drives the zoom — separate css
          // properties in Tailwind v4, so they don't fight.
          "glass-overlay fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-40px)] w-full max-w-[calc(100vw-40px)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-2xl p-6 outline-none md:max-w-md",
          "origin-center transition-[opacity,scale] duration-200 ease-out",
          "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
          "data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:duration-150",
          className
        )}
      >
        {children}
      </BaseAlertDialog.Popup>
    </BaseAlertDialog.Portal>
  )
}

function AlertDialogHeader({ className, ...props }: ComponentProps<"div">) {
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

function AlertDialogFooter({ className, ...props }: ComponentProps<"div">) {
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

function AlertDialogTitle({
  className,
  ...props
}: ComponentProps<typeof BaseAlertDialog.Title>) {
  return (
    <BaseAlertDialog.Title
      // WDS dialog title: Lora editorial display.
      className={cn("text-gray-12 text-display-md font-serif", className)}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: ComponentProps<typeof BaseAlertDialog.Description>) {
  return (
    <BaseAlertDialog.Description
      className={cn(
        "text-gray-11 flex flex-col space-y-1.5 text-center text-sm sm:text-left",
        className
      )}
      {...props}
    />
  )
}

// Dismissive action — an outline Button wired to close via Base UI's Close part.
function AlertDialogCancel(props: ComponentProps<typeof Button>) {
  return (
    <BaseAlertDialog.Close render={<Button variant="outline" {...props} />} />
  )
}

// Confirming action — the primary (default solid) Button, also closes on click.
function AlertDialogAction(props: ComponentProps<typeof Button>) {
  return <BaseAlertDialog.Close render={<Button {...props} />} />
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger,
}
export type { AlertDialogContentProps }
