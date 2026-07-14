"use client"

import type { ReactNode } from "react"

import { ConfirmDialog } from "@workspace/liquid-ui/components/ConfirmDialog"
import { ToastProvider } from "@workspace/liquid-ui/components/Toast"

interface UIProviderProps {
  children?: ReactNode
  locale?: string
}

// liquid-ui's app provider — standalone (no @workspace/ui / sonner). Wraps the
// tree in the Base UI Toast provider and mounts the imperative ConfirmDialog host,
// so `toast(...)` and `confirm(...)` work anywhere below it.
export function UIProvider({ children }: UIProviderProps) {
  return (
    <ToastProvider>
      {children}
      <ConfirmDialog />
    </ToastProvider>
  )
}
