import { use } from "react"
import type { Column } from "@tanstack/react-table"
import { Button } from "@workspace/liquid-ui/components/Button"
import { cn } from "@workspace/liquid-ui/lib/utils"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"

import { CustomTableContext } from "./DataTable"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
  enableSorting?: boolean
}
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  enableSorting = true,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const { emitStateChange } = use(CustomTableContext)
  const isSorted = column.getIsSorted()
  if (!enableSorting) {
    return <div className={cn("flex items-center", className)}>{title}</div>
  }
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "text-gray-11 hover:bg-gray-a3! -ml-2 h-7 text-[11px] font-bold tracking-[0.06em] uppercase transition-colors",
          isSorted && "text-accent-11!"
        )}
        rightIcon={
          isSorted === "desc" ? (
            <ArrowDown />
          ) : isSorted === "asc" ? (
            <ArrowUp />
          ) : (
            <ArrowUpDown />
          )
        }
        onClick={() => {
          if (isSorted === "asc") {
            column.toggleSorting(true)
          } else if (isSorted === "desc") {
            column.clearSorting()
          } else {
            column.toggleSorting(false)
          }
          emitStateChange()
        }}
      >
        {title}
      </Button>
    </div>
  )
}
