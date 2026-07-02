import { useEffect, useRef, useState } from "react"

export function useManualTooltip(timeoutMs = 1200) {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  const clear = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const show = () => {
    clear()
    setOpen(true)
    timeoutRef.current = window.setTimeout(() => setOpen(false), timeoutMs)
  }

  const onOpenChange = (next: boolean) => {
    if (!next) setOpen(false)
  }

  useEffect(() => {
    return () => clear()
  }, [])

  return { open, show, onOpenChange }
}
