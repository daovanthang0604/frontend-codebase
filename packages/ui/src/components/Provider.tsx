"use client"

import { ConfirmDialog } from "@workspace/ui/components/ConfirmDialog"
import { Toaster } from "@workspace/ui/components/Sonner"

import "@workspace/ui/components/NProgress"
import "nprogress/nprogress.css"

interface UIProviderProps {
  children?: React.ReactNode
  locale?: string
}

/**
 * The UIProvider component supplies locale and theme context to the application, as well as toaster and confirm dialog functionality.
 */
export function UIProvider({ children }: UIProviderProps) {
  return (
    <>
      {children}
      <Toaster />
      <ConfirmDialog />
    </>
  )
}
