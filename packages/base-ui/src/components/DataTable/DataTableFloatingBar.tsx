import { Button } from "@workspace/base-ui/components/Button"
import { Separator } from "@workspace/base-ui/components/Separator"
import { cn } from "@workspace/base-ui/lib/utils"
import { X } from "lucide-react"

interface DataTableFloatingBarProps {
  selectedCount: number
  onClearSelection: () => void
  children?: React.ReactNode
}

export function DataTableFloatingBar({
  selectedCount,
  onClearSelection,
  children,
}: DataTableFloatingBarProps) {
  if (selectedCount === 0) return null

  return (
    <div
      className={cn(
        "fixed bottom-18 left-1/2 z-10 -translate-x-1/2",
        "bg-gray-2 text-gray-12",
        "rounded-xl border p-2 shadow-2xl dark:shadow-[0_25px_50px_0px_rgba(0,0,0,0.2),0_15px_25px_-2px_rgba(0,0,0,0.1)]",
        "flex items-center gap-4",
        "animate-in fade-in slide-in-from-bottom-4"
      )}
    >
      <div className="flex items-center gap-1.5 pl-2">
        <span className="text-sm font-medium">{selectedCount} selected</span>
        <Button
          variant="ghost"
          size="sm"
          className="text-floating-bar-foreground/70 hover:text-floating-bar-foreground hover:bg-floating-bar-foreground/10 h-7 w-7 p-0"
          onClick={onClearSelection}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <Separator orientation="vertical" className="bg-gray-6 h-6" />
      <div className="flex items-center gap-2">{children}</div>
    </div>
  )
}
