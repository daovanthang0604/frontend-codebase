import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { GripVerticalIcon } from "lucide-react"
import * as AriaResizable from "react-resizable-panels"

function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof AriaResizable.PanelGroup>) {
  return (
    <AriaResizable.PanelGroup
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full",
        "data-[panel-group-direction=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

const ResizablePanel = React.forwardRef<
  React.ComponentRef<typeof AriaResizable.Panel>,
  React.ComponentProps<typeof AriaResizable.Panel>
>((props, ref) => {
  return (
    <AriaResizable.Panel ref={ref} data-slot="resizable-panel" {...props} />
  )
})

ResizablePanel.displayName = "ResizablePanel"

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof AriaResizable.PanelResizeHandle> & {
  withHandle?: boolean
}) {
  return (
    <AriaResizable.PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(
        "relative flex items-center justify-center",
        "data-[panel-group-direction=horizontal]:h-full data-[panel-group-direction=horizontal]:w-px data-[panel-group-direction=horizontal]:self-center",
        "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",
        "bg-gray-6",
        // "cursor-grab! data-resize-handle-active:cursor-grabbing!",
        "hover:bg-gray-7 data-resize-handle-active:bg-accent-9",
        "transition-colors duration-150",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div
          className={cn(
            "bg-gray-5 text-gray-11 pointer-events-none z-10 flex h-5 w-3 items-center justify-center rounded-full shadow-sm",
            "opacity-0 transition-opacity group-hover:opacity-100",
            "data-[panel-group-direction=vertical]:rotate-90"
          )}
        >
          <GripVerticalIcon className="size-3" aria-hidden="true" />
        </div>
      )}
    </AriaResizable.PanelResizeHandle>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
