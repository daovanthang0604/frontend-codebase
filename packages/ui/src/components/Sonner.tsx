"use client"

import { Button } from "@workspace/ui/components/Button"
import {
  AlertTriangleIcon,
  CircleCheckIcon,
  CircleXIcon,
  InfoIcon,
  XIcon,
} from "lucide-react"
import { toast as sonnerToast, Toaster, type ToastT } from "sonner"

interface ToastProps {
  id: string | number
  title: string
  description?: React.ReactNode
  variant?: "success" | "error" | "info" | "warning" | "neutral"
}
/** A fully custom toast that still maintains the animations and interactions. */
function Toast(props: ToastProps) {
  const { title, description, id, variant = "neutral" } = props
  return (
    <div className="group bg-gray-2 text-gray-12 relative flex min-h-[64px] w-full items-center gap-3 rounded-xl border px-4 py-2.5 pr-7 shadow-lg md:w-[364px]">
      <ToastIcon variant={variant} />
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <p className="text-gray-12 text-sm font-semibold">{title}</p>
          {description && (
            <div className="text-gray-11 mt-0.5 text-sm">{description}</div>
          )}
        </div>
      </div>
      <Button
        size="sm"
        mode="icon"
        variant="ghost"
        onClick={() => sonnerToast.dismiss(id)}
        className="absolute top-1.5 right-1.5 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <XIcon className="text-gray-11 h-4 w-4" />
      </Button>
    </div>
  )
}
function ToastIcon({ variant }: { variant: ToastProps["variant"] }) {
  if (variant === "neutral") {
    return null
  }
  return (
    <>
      {variant === "success" && (
        <CircleCheckIcon className="text-success-9 size-5" />
      )}
      {variant === "error" && <CircleXIcon className="text-error-9 size-5" />}
      {variant === "info" && <InfoIcon className="text-info-9 size-5" />}
      {variant === "warning" && (
        <AlertTriangleIcon className="text-warning-9 size-5" />
      )}
    </>
  )
}
function createToast(variant: ToastProps["variant"]) {
  return (
    props: Omit<ToastProps, "id" | "variant">,
    options: Pick<ToastT, "position" | "duration"> = {}
  ) => {
    return sonnerToast.custom(
      (id) => <Toast id={id} variant={variant} {...props} />,
      {
        position: "bottom-right",
        ...options,
      }
    )
  }
}
const success = createToast("success")
const error = createToast("error")
const info = createToast("info")
const warning = createToast("warning")
const neutral = createToast("neutral")
const toast = {
  success,
  error,
  info,
  warning,
  neutral,
}
export { toast, Toaster }
