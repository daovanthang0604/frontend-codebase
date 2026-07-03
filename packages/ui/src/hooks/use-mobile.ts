import * as React from "react"

const DEFAULT_MOBILE_BREAKPOINT = 768

interface UseIsMobileProps {
  breakpoint?: number
}

export function useIsMobile({
  breakpoint = DEFAULT_MOBILE_BREAKPOINT,
}: UseIsMobileProps = {}) {
  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
      mql.addEventListener("change", onStoreChange)
      return () => mql.removeEventListener("change", onStoreChange)
    },
    [breakpoint]
  )

  // useSyncExternalStore is the compiler-safe way to read an external source
  // (viewport width) without a setState-in-effect: getSnapshot reads the current
  // width synchronously, and the matchMedia subscription drives re-renders.
  return React.useSyncExternalStore(
    subscribe,
    () => window.innerWidth < breakpoint,
    () => false
  )
}
