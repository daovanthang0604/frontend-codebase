"use client"

import React from "react"
import { Button } from "@workspace/ui/components/Button"
import { cn } from "@workspace/ui/lib/utils"
import { X } from "lucide-react"
import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Heading as AriaHeading,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  composeRenderProps,
  type DialogProps as AriaDialogProps,
  type HeadingProps as AriaHeadingProps,
  type ModalOverlayProps as AriaModalOverlayProps,
} from "react-aria-components"

const Dialog = AriaDialog
const DialogTrigger = AriaDialogTrigger
const DialogOverlay = ({
  className,
  isDismissable = true,
  ...props
}: AriaModalOverlayProps) => (
  <AriaModalOverlay
    isDismissable={isDismissable}
    className={composeRenderProps(className, (className) =>
      cn(
        "fixed inset-0 z-50 h-[var(--page-height)] backdrop-blur-sm",
        "bg-gray-a12/80",
        /* Exiting */
        "data-[exiting]:animate-out data-[exiting]:fade-out-0 max-md:data-[exiting]:duration-300",
        /* Entering */
        "data-[entering]:animate-in data-[entering]:fade-in-0 max-md:data-[entering]:duration-300",
        className
      )
    )}
    {...props}
  />
)
interface DialogContentProps
  extends Omit<React.ComponentProps<typeof AriaModal>, "children"> {
  children?: AriaDialogProps["children"]
  role?: AriaDialogProps["role"]
  /** Whether to show the close button */
  closeButton?: boolean
  /** Whether to dismiss the dialog when the user clicks outside of it */
  isDismissable?: boolean
}
const DialogContent = ({
  className,
  children,
  role,
  closeButton = true,
  isDismissable = true,
  ...props
}: DialogContentProps) => (
  <DialogOverlay isDismissable={isDismissable}>
    <AriaModal
      className={composeRenderProps(className, (className) =>
        cn(
          // WDS: white paper modal (bg-panel) with the soft bookish 2xl radius.
          "bg-panel fixed left-[50vw] z-50 max-h-[var(--visual-viewport-height)] w-full max-w-[calc(100vw-40px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl p-5 shadow-2xl md:max-w-lg dark:border",
          "data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0",
          "md:data-[entering]:zoom-in-97 md:data-[exiting]:zoom-out-97",
          "max-md:data-[entering]:slide-in-from-bottom-5 max-md:data-[exiting]:slide-out-to-bottom-5 max-md:data-[exiting]:duration-300",
          className
        )
      )}
      style={{
        // This is an exceptional case where we can't use Tailwind, so we have to apply the style directly
        top: "calc(var(--visual-viewport-height) / 2)",
      }}
      {...props}
    >
      <AriaDialog
        role={role}
        className={cn("flex flex-col gap-4", "h-full outline-none")}
      >
        {composeRenderProps(children, (children, renderProps) => (
          <>
            {children}
            {closeButton && (
              <Button
                size="sm"
                onClick={renderProps.close}
                mode="icon"
                variant="ghost"
                tooltip="Close"
                tooltipDelay={2000}
                className="absolute top-2.5 right-2.5"
              >
                <X className="text-gray-11 size-4!" />
                <span className="sr-only">Close</span>
              </Button>
            )}
          </>
        ))}
      </AriaDialog>
    </AriaModal>
  </DialogOverlay>
)
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-4 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end",
      className
    )}
    {...props}
  />
)
const DialogTitle = ({ className, ...props }: AriaHeadingProps) => (
  <AriaHeading
    slot="title"
    // WDS dialog title: Lora editorial display.
    className={cn("text-gray-12 text-display-md font-serif", className)}
    {...props}
  />
)
const DialogDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn(
      "text-gray-11 flex flex-col space-y-1.5 text-center text-sm sm:text-left",
      className
    )}
    {...props}
  />
)
export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
}
export type { DialogContentProps }
