import { useMemo, useState } from "react"
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Table } from "@tanstack/react-table"
import { Button } from "@workspace/base-ui/components/Button"
import {
  Popover,
  PopoverDialog,
  PopoverTrigger,
} from "@workspace/base-ui/components/Popover"
import { ScrollArea } from "@workspace/base-ui/components/ScrollArea"
import { Switch } from "@workspace/base-ui/components/Switch"
import { cn } from "@workspace/base-ui/lib/utils"
import { capitalize } from "lodash"
import { GripVertical, Pin, RotateCcw, Settings2 } from "lucide-react"

interface DataTableDisplaySettingsProps<TData> {
  table: Table<TData>
  onResetToDefaults: () => void
}
interface SortableColumnItemProps {
  id: string
  label: string
  isVisible: boolean
  isPinned: "left" | "right" | false
  onToggleVisibility?: () => void
  onPin?: (position: "left" | "right" | false) => void
  className?: string
}
function toNormalText(str: string) {
  return (
    str
      // convert camelCase → camel Case
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      // replace snake_case and kebab-case
      .replace(/[-_]/g, " ")
      // collapse repeated spaces
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase()
  )
}
function getColumnLabel<TData>(
  column: ReturnType<Table<TData>["getAllColumns"]>[number]
) {
  const metaLabel = (
    column.columnDef.meta as
      | {
          label?: string
        }
      | undefined
  )?.label
  if (metaLabel) return metaLabel
  return typeof column.columnDef.header === "string"
    ? column.columnDef.header
    : column.id
}
function SortableColumnItem({
  id,
  label,
  isVisible,
  isPinned,
  onToggleVisibility,
  onPin,
  className,
}: SortableColumnItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  const formattedLabel = capitalize(toNormalText(label))
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 px-2 py-1.5",
        className,
        isDragging && "bg-accent-9/30 *:opacity-0"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="hover:bg-gray-3 cursor-grab rounded p-1 active:cursor-grabbing"
      >
        <GripVertical className="text-gray-11 h-4 w-4" />
      </button>
      <span className="grid flex-1 text-sm" title={formattedLabel}>
        <div className="truncate">{formattedLabel}</div>
      </span>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-6 w-6 p-0", isPinned === "left" && "text-accent-9")}
          onClick={() => onPin?.(isPinned === "left" ? false : "left")}
          tooltip="Pin to left"
        >
          <Pin className="size-3 rotate-45" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-6 w-6 p-0", isPinned === "right" && "text-accent-9")}
          onClick={() => onPin?.(isPinned === "right" ? false : "right")}
          tooltip="Pin to right"
        >
          <Pin className="size-3 -rotate-45" />
        </Button>
        <Switch
          isSelected={isVisible}
          onChange={onToggleVisibility}
          className="scale-75"
        />
      </div>
    </div>
  )
}
export function DataTableDisplaySettings<TData>({
  table,
  onResetToDefaults,
}: DataTableDisplaySettingsProps<TData>) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  const allColumns = table
    .getAllColumns()
    .filter((column) => column.id !== "select" && column.getCanHide())
  const totalItemsHeight = allColumns.length * 40 + 8
  const columnOrder = table.getState().columnOrder
  const orderedColumns =
    columnOrder.length > 0
      ? columnOrder
          .map((id) => allColumns.find((col) => col.id === id))
          .filter(Boolean)
      : allColumns
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setActiveId(null)
      const oldIndex = columnOrder.indexOf(active.id as string)
      const newIndex = columnOrder.indexOf(over.id as string)
      const newOrder = arrayMove(columnOrder, oldIndex, newIndex)
      table.setColumnOrder(newOrder)
    }
  }
  const handleSortStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }
  const activeColumnLabel = useMemo(() => {
    if (!activeId) return ""
    const activeColumn = orderedColumns.find((col) => col?.id === activeId)
    return activeColumn ? getColumnLabel(activeColumn) : activeId
  }, [activeId, orderedColumns])
  return (
    <PopoverTrigger>
      <Button
        variant="outline"
        size="sm"
        mode="icon"
        tooltip="Display Settings"
        className="gap-2"
      >
        <Settings2 className="h-4 w-4" />
      </Button>
      <Popover className="w-72 overflow-hidden" placement="bottom right">
        <PopoverDialog className="p-0">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <p className="text-sm font-semibold">Display Settings</p>
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={onResetToDefaults}
              leftIcon={<RotateCcw />}
            >
              Reset
            </Button>
          </div>
          <ScrollArea
            className="max-h-[300px]"
            style={{ height: totalItemsHeight }}
          >
            <div className="py-1">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleSortStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={orderedColumns.map((col) => col!.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {orderedColumns.map((column) => {
                    if (!column) return null
                    return (
                      <SortableColumnItem
                        key={column.id}
                        id={column.id}
                        label={getColumnLabel(column)}
                        isVisible={column.getIsVisible()}
                        isPinned={column.getIsPinned()}
                        onToggleVisibility={() =>
                          column.toggleVisibility(!column.getIsVisible())
                        }
                        onPin={(position) => column.pin(position)}
                      />
                    )
                  })}
                </SortableContext>
                <DragOverlay>
                  {activeId &&
                  orderedColumns.find((col) => col?.id === activeId) ? (
                    <SortableColumnItem
                      id={activeId}
                      label={activeColumnLabel}
                      isVisible={
                        orderedColumns
                          .find((col) => col?.id === activeId)
                          ?.getIsVisible() ?? false
                      }
                      isPinned={
                        orderedColumns
                          .find((col) => col?.id === activeId)
                          ?.getIsPinned() ?? false
                      }
                      className="bg-gray-3 rounded shadow-sm"
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>
            </div>
          </ScrollArea>
        </PopoverDialog>
      </Popover>
    </PopoverTrigger>
  )
}
