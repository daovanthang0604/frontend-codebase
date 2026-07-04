import { useCallback, useEffect, useState } from "react"
import type {
  ColumnPinningState,
  ColumnSizingState,
  VisibilityState,
} from "@tanstack/react-table"

import type { DisplaySettings } from "../types/data-table"

const STORAGE_PREFIX = "data-table-settings-"
interface UseDataTableSettingsProps {
  storageKey: string
  defaultColumnVisibility?: VisibilityState
  defaultColumnSizing?: ColumnSizingState
  defaultColumnPinning?: ColumnPinningState
  defaultColumnOrder?: string[]
}
export function useDataTableSettings({
  storageKey,
  defaultColumnVisibility = {},
  defaultColumnSizing = {},
  defaultColumnPinning = { left: [], right: [] },
  defaultColumnOrder = [],
}: UseDataTableSettingsProps) {
  const fullStorageKey = STORAGE_PREFIX + storageKey
  const getStoredSettings = useCallback((): DisplaySettings | null => {
    try {
      const stored = localStorage.getItem(fullStorageKey)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error("Failed to parse stored settings:", error)
    }
    return null
  }, [fullStorageKey])
  const [settings, setSettings] = useState<DisplaySettings>(() => {
    const stored = getStoredSettings()
    return (
      stored || {
        columnVisibility: defaultColumnVisibility,
        columnSizing: defaultColumnSizing,
        columnPinning: defaultColumnPinning,
        columnOrder: defaultColumnOrder,
      }
    )
  })
  // Persist settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(fullStorageKey, JSON.stringify(settings))
    } catch (error) {
      console.error("Failed to save settings:", error)
    }
  }, [settings, fullStorageKey])
  const updateColumnVisibility = useCallback((visibility: VisibilityState) => {
    setSettings((prev) => ({ ...prev, columnVisibility: visibility }))
  }, [])
  const updateColumnSizing = useCallback((sizing: ColumnSizingState) => {
    setSettings((prev) => ({ ...prev, columnSizing: sizing }))
  }, [])
  const updateColumnPinning = useCallback((pinning: ColumnPinningState) => {
    setSettings((prev) => ({ ...prev, columnPinning: pinning }))
  }, [])
  const updateColumnOrder = useCallback((order: string[]) => {
    setSettings((prev) => ({ ...prev, columnOrder: order }))
  }, [])
  const resetToDefaults = useCallback(() => {
    const defaults: DisplaySettings = {
      columnVisibility: defaultColumnVisibility,
      columnSizing: defaultColumnSizing,
      columnPinning: defaultColumnPinning,
      columnOrder: defaultColumnOrder,
    }
    setSettings(defaults)
  }, [
    defaultColumnVisibility,
    defaultColumnSizing,
    defaultColumnPinning,
    defaultColumnOrder,
  ])
  return {
    settings,
    updateColumnVisibility,
    updateColumnSizing,
    updateColumnPinning,
    updateColumnOrder,
    resetToDefaults,
  }
}
