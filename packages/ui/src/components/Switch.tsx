"use client"

import { cn } from "@workspace/ui/lib/utils"
import {
  Switch as AriaSwitch,
  composeRenderProps,
  type SwitchProps as AriaSwitchProps,
} from "react-aria-components"

const Switch = ({ children, className, ...props }: AriaSwitchProps) => (
  <AriaSwitch
    className={composeRenderProps(className, (className) =>
      cn(
        "group inline-flex items-center gap-2 text-sm leading-none font-medium data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70",
        className
      )
    )}
    {...props}
  >
    {composeRenderProps(children, (children) => (
      <>
        <div
          className={cn(
            // WDS switch: pill track, tan when off, navy (accent) when on — no
            // border. 42x24 track with an 18px knob.
            "peer inline-flex h-6 w-[42px] shrink-0 cursor-pointer items-center rounded-full transition-colors",
            /* Focus Visible */
            "group-data-[focus-visible]:ring-offset-gray-1 group-data-[focus-visible]:ring-2 group-data-[focus-visible]:ring-offset-2 group-data-[focus-visible]:outline-none",
            /* Disabled */
            "group-data-disabled:cursor-not-allowed group-data-disabled:opacity-50",
            /* Selected */
            "bg-gray-4 group-data-selected:bg-accent-solid",
            /* Readonly */
            "group-data-readonly:cursor-default",
            /* Resets */
            "focus-visible:outline-none"
          )}
        >
          <div
            className={cn(
              // Spring the knob translate (WDS personality), at the fast 150ms
              // micro-interaction speed - short travel, frequently toggled, so it
              // stays snappy not sluggish. Reduced motion: the global reset.
              "ease-spring pointer-events-none block size-[18px] rounded-full bg-white shadow-sm ring-0 transition-transform duration-[var(--dur-fast)]",
              /* Position */
              "translate-x-[3px] group-data-selected:translate-x-[21px]"
            )}
          />
        </div>
        {children}
      </>
    ))}
  </AriaSwitch>
)
export { Switch }
