"use client"

import type { ReactNode } from "react"
import { Switch as BaseSwitch } from "@base-ui/react/switch"

import { cn } from "@workspace/base-ui/lib/utils"

// Drop-in for @workspace/ui/Switch, rebuilt on Base UI (Switch.Root + Switch.Thumb,
// per 9ui). The react-aria props the app already passes are mapped onto Base UI's
// native API, and the WDS track/knob classes are ported verbatim — the only
// selector change is react-aria `group-data-selected` -> Base UI `data-checked`.
interface SwitchProps {
  isSelected?: boolean
  defaultSelected?: boolean
  onChange?: (isSelected: boolean) => void
  isDisabled?: boolean
  className?: string
  children?: ReactNode
}

function Switch({
  isSelected,
  defaultSelected,
  onChange,
  isDisabled,
  className,
  children,
}: SwitchProps) {
  const control = (
    <BaseSwitch.Root
      checked={isSelected}
      defaultChecked={defaultSelected}
      onCheckedChange={onChange}
      disabled={isDisabled}
      className={cn(
        // WDS switch: pill track, tan off, navy (accent) on — no border. 42x24.
        "peer inline-flex h-6 w-[42px] shrink-0 cursor-pointer items-center rounded-full outline-none transition-colors",
        "focus-visible:ring-offset-gray-1 focus-visible:ring-2 focus-visible:ring-offset-2",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        "bg-gray-4 data-checked:bg-accent-solid",
        className
      )}
    >
      <BaseSwitch.Thumb
        className={cn(
          // Spring the knob at the fast 150ms micro-interaction speed. 18px knob.
          "ease-spring pointer-events-none block size-[18px] rounded-full bg-white shadow-sm ring-0 transition-transform duration-[var(--dur-fast)]",
          "translate-x-[3px] data-checked:translate-x-[21px]"
        )}
      />
    </BaseSwitch.Root>
  )
  if (children == null) return control
  return (
    <label className="inline-flex items-center gap-2 text-sm leading-none font-medium">
      {control}
      {children}
    </label>
  )
}

export { Switch }
