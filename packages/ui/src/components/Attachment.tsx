"use client"

import {
  createContext,
  useContext,
  type ComponentProps,
} from "react"
import { Button, type IconButtonProps } from "@workspace/ui/components/Button"
import { cn } from "@workspace/ui/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

// WDS Attachment — a file/image chip with metadata, upload states, and actions.
// For chat composers, message threads, and upload lists. Presentational compound
// component (reuses Button for actions). Compose:
//
//   <Attachment state="done">
//     <AttachmentMedia><FileTextIcon /></AttachmentMedia>
//     <AttachmentContent>
//       <AttachmentTitle>report.pdf</AttachmentTitle>
//       <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
//     </AttachmentContent>
//     <AttachmentActions>
//       <AttachmentAction aria-label="Remove"><XIcon /></AttachmentAction>
//     </AttachmentActions>
//   </Attachment>

export type AttachmentState =
  | "idle"
  | "uploading"
  | "processing"
  | "error"
  | "done"
type AttachmentSize = "default" | "sm" | "xs"

const AttachmentContext = createContext<{
  state: AttachmentState
  size: AttachmentSize
}>({ state: "done", size: "default" })

const attachmentVariants = cva(
  "group/attachment relative flex rounded-lg border transition-colors",
  {
    variants: {
      size: {
        default: "gap-3 p-2.5",
        sm: "gap-2.5 p-2",
        xs: "gap-2 p-1.5",
      },
      orientation: {
        horizontal: "flex-row items-center",
        vertical: "w-40 flex-col items-stretch",
      },
      state: {
        idle: "border-gray-a5 bg-gray-2",
        uploading: "border-gray-a5 bg-gray-2",
        processing: "border-gray-a5 bg-gray-2",
        error: "border-error-7 bg-error-3",
        done: "border-gray-a5 bg-gray-2",
      },
    },
    defaultVariants: {
      size: "default",
      orientation: "horizontal",
      state: "done",
    },
  }
)

interface AttachmentProps
  extends ComponentProps<"div">,
    VariantProps<typeof attachmentVariants> {}

function Attachment({
  className,
  size,
  orientation,
  state,
  ...props
}: AttachmentProps) {
  const resolvedState = state ?? "done"
  return (
    <AttachmentContext.Provider
      value={{ state: resolvedState, size: size ?? "default" }}
    >
      <div
        data-state={resolvedState}
        className={cn(
          attachmentVariants({ size, orientation, state }),
          className
        )}
        {...props}
      />
    </AttachmentContext.Provider>
  )
}

const mediaVariants = cva(
  "flex shrink-0 items-center justify-center overflow-hidden rounded-md",
  {
    variants: {
      variant: {
        icon: "bg-gray-3 text-gray-11",
        image: "bg-gray-3 [&_img]:size-full [&_img]:object-cover",
      },
      size: {
        default: "size-10 [&_svg]:size-4",
        sm: "size-9 [&_svg]:size-4",
        xs: "size-7 [&_svg]:size-3.5",
      },
    },
    defaultVariants: { variant: "icon", size: "default" },
  }
)

function AttachmentMedia({
  variant,
  className,
  ...props
}: ComponentProps<"div"> & { variant?: "icon" | "image" }) {
  const { size } = useContext(AttachmentContext)
  return (
    <div className={cn(mediaVariants({ variant, size }), className)} {...props} />
  )
}

function AttachmentContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex min-w-0 flex-1 flex-col justify-center", className)}
      {...props}
    />
  )
}

function AttachmentTitle({ className, ...props }: ComponentProps<"div">) {
  const { state } = useContext(AttachmentContext)
  const loading = state === "uploading" || state === "processing"
  return (
    <div
      className={cn(
        "text-gray-12 truncate text-sm font-medium",
        loading && "animate-pulse",
        state === "error" && "text-error-11",
        className
      )}
      {...props}
    />
  )
}

function AttachmentDescription({ className, ...props }: ComponentProps<"p">) {
  const { state } = useContext(AttachmentContext)
  return (
    <p
      className={cn(
        "text-gray-11 truncate text-xs",
        state === "error" && "text-error-11",
        className
      )}
      {...props}
    />
  )
}

function AttachmentActions({ className, ...props }: ComponentProps<"div">) {
  // z-10 so actions stay clickable above a full-card AttachmentTrigger.
  return (
    <div
      className={cn(
        "relative z-10 flex shrink-0 items-center gap-0.5 self-start",
        className
      )}
      {...props}
    />
  )
}

function AttachmentAction({
  className,
  size = "xs",
  variant = "ghost",
  intent = "secondary",
  ...props
}: Omit<IconButtonProps, "mode">) {
  return (
    <Button
      mode="icon"
      size={size}
      variant={variant}
      intent={intent}
      className={cn(
        "text-gray-11 hover:text-gray-12 size-6 [&_svg]:size-3.5",
        className
      )}
      {...props}
    />
  )
}

function AttachmentTrigger({ className, ...props }: ComponentProps<"button">) {
  // Full-card overlay for opening a link/dialog; sits behind AttachmentActions.
  return (
    <button
      type="button"
      className={cn(
        "focus-visible:ring-accent-7 absolute inset-0 z-0 rounded-lg outline-none focus-visible:ring-2",
        className
      )}
      {...props}
    />
  )
}

function AttachmentGroup({ className, ...props }: ComponentProps<"div">) {
  // Horizontal scroll with snap, hidden scrollbar, and soft edge fade.
  return (
    <div
      className={cn(
        "flex snap-x gap-2 overflow-x-auto scroll-smooth pb-1",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        "[mask-image:linear-gradient(to_right,transparent,#000_16px,#000_calc(100%-16px),transparent)]",
        "[&>*]:shrink-0 [&>*]:snap-start",
        className
      )}
      {...props}
    />
  )
}

export {
  Attachment,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger,
  AttachmentGroup,
}
