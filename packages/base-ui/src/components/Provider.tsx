"use client"

// Facade during the migration: base-ui's provider is ui's until the Toaster /
// ConfirmDialog primitives are themselves rebuilt on Base UI.
export { UIProvider } from "@workspace/ui/components/Provider"
