"use client"

import {
  useMemo,
  useState,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from "react"
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
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
import { Badge } from "@workspace/base-ui/components/Badge"
import { cn } from "@workspace/base-ui/lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type KanbanCardData = {
  id: string
  title: string
  // Cards are open records so callers can hang their own fields off them and
  // read them back in `renderCard`.
  [key: string]: unknown
}

type KanbanColumnData = {
  id: string
  title: string
  cards: KanbanCardData[]
}

type KanbanBoardProps = {
  columns: KanbanColumnData[]
  /**
   * Called with the next columns array whenever a card is reordered within a
   * column or moved across columns. The board is fully controlled — apply this
   * to your state so the move sticks.
   */
  onColumnsChange: (next: KanbanColumnData[]) => void
  /** Custom card body. Defaults to the card's `title`. */
  renderCard?: (card: KanbanCardData) => ReactNode
  className?: string
}

// ---------------------------------------------------------------------------
// Presentational pieces (exported for hand-rolled boards)
// ---------------------------------------------------------------------------

type KanbanCardProps = ComponentProps<"div">

/** A single boxed card. In React 19 `ref` flows through `...props` to the div. */
function KanbanCard({ className, ...props }: KanbanCardProps) {
  return (
    <div
      data-slot="kanban-card"
      className={cn(
        "bg-panel rounded-md border p-3 text-sm shadow-sm",
        className
      )}
      {...props}
    />
  )
}

type KanbanColumnProps = ComponentProps<"div"> & {
  title: ReactNode
  /** Rendered as a count Badge in the header when provided. */
  count?: number
}

/** A column shell: warm gray surface, title + count header, cards below. */
function KanbanColumn({
  title,
  count,
  className,
  children,
  ...props
}: KanbanColumnProps) {
  return (
    <div
      data-slot="kanban-column"
      className={cn(
        "bg-gray-2 flex w-72 shrink-0 flex-col gap-2 rounded-lg p-2",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2 px-1 pt-1">
        <span className="text-gray-12 text-sm font-semibold">{title}</span>
        {count != null ? (
          <Badge color="gray" size="sm">
            {count}
          </Badge>
        ) : null}
      </div>
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Board internals
// ---------------------------------------------------------------------------

/** Column id if `id` is one, else the column that holds the card with `id`. */
function findColumn(
  columns: KanbanColumnData[],
  id: string
): KanbanColumnData | undefined {
  const asColumn = columns.find((col) => col.id === id)
  if (asColumn) return asColumn
  return columns.find((col) => col.cards.some((card) => card.id === id))
}

function findCard(
  columns: KanbanColumnData[],
  id: string
): KanbanCardData | undefined {
  for (const col of columns) {
    const card = col.cards.find((c) => c.id === id)
    if (card) return card
  }
  return undefined
}

function SortableCard({
  card,
  renderCard,
}: {
  card: KanbanCardData
  renderCard?: (card: KanbanCardData) => ReactNode
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id })
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  return (
    <KanbanCard
      ref={setNodeRef}
      style={style}
      className={cn(
        "cursor-grab touch-none select-none active:cursor-grabbing",
        // Hidden while the DragOverlay clone is the visible one.
        isDragging && "opacity-40"
      )}
      {...attributes}
      {...listeners}
    >
      {renderCard ? renderCard(card) : card.title}
    </KanbanCard>
  )
}

function BoardColumn({
  column,
  renderCard,
}: {
  column: KanbanColumnData
  renderCard?: (card: KanbanCardData) => ReactNode
}) {
  // The column is itself a droppable so an *empty* column (no sortable cards to
  // collide with) is still a valid drop target.
  const { setNodeRef } = useDroppable({ id: column.id })
  return (
    <KanbanColumn title={column.title} count={column.cards.length}>
      <SortableContext
        items={column.cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="flex min-h-16 flex-col gap-2">
          {column.cards.map((card) => (
            <SortableCard key={card.id} card={card} renderCard={renderCard} />
          ))}
        </div>
      </SortableContext>
    </KanbanColumn>
  )
}

// ---------------------------------------------------------------------------
// Board
// ---------------------------------------------------------------------------

/**
 * Data-driven, drag-and-drop Kanban board (the classic dnd-kit multi-container
 * sortable). Cards reorder within a column and move across columns; every move
 * produces a fresh `columns` array via `onColumnsChange`.
 *
 * Cross-column moves happen live in `onDragOver` (the card visibly hops into the
 * hovered column); `onDragEnd` only finalizes the exact index within the
 * landing column.
 */
function KanbanBoard({
  columns,
  onColumnsChange,
  renderCard,
  className,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    // A small distance threshold so a click on a card isn't read as a drag.
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const activeCard = useMemo(
    () => (activeId == null ? null : findCard(columns, activeId)),
    [activeId, columns]
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (over == null) return

    const activeCardId = active.id as string
    const overId = over.id as string

    const activeColumn = findColumn(columns, activeCardId)
    const overColumn = findColumn(columns, overId)
    // Same-column drags are handled visually by the sortable strategy and
    // finalized in handleDragEnd — nothing to move here.
    if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) return

    const movedCard = activeColumn.cards.find((c) => c.id === activeCardId)
    if (!movedCard) return

    const overCards = overColumn.cards
    const overIsColumn = columns.some((c) => c.id === overId)

    let newIndex: number
    if (overIsColumn) {
      // Dropped onto the column body (e.g. empty space) → append.
      newIndex = overCards.length
    } else {
      const overIndex = overCards.findIndex((c) => c.id === overId)
      const draggedRect = active.rect.current.translated
      // Insert after the hovered card once the pointer passes its midpoint.
      const isBelow =
        draggedRect != null &&
        draggedRect.top > over.rect.top + over.rect.height / 2
      newIndex =
        overIndex >= 0 ? overIndex + (isBelow ? 1 : 0) : overCards.length
    }

    onColumnsChange(
      columns.map((col) => {
        if (col.id === activeColumn.id) {
          return {
            ...col,
            cards: col.cards.filter((c) => c.id !== activeCardId),
          }
        }
        if (col.id === overColumn.id) {
          return {
            ...col,
            cards: [
              ...col.cards.slice(0, newIndex),
              movedCard,
              ...col.cards.slice(newIndex),
            ],
          }
        }
        return col
      })
    )
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (over == null) return

    const activeCardId = active.id as string
    const overId = over.id as string

    const activeColumn = findColumn(columns, activeCardId)
    const overColumn = findColumn(columns, overId)
    // Cross-column moves already landed in handleDragOver; here we only settle
    // the final position within the card's (now current) column.
    if (!activeColumn || !overColumn || activeColumn.id !== overColumn.id) return

    const oldIndex = activeColumn.cards.findIndex((c) => c.id === activeCardId)
    const newIndex = overColumn.cards.findIndex((c) => c.id === overId)
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return

    onColumnsChange(
      columns.map((col) =>
        col.id === overColumn.id
          ? { ...col, cards: arrayMove(col.cards, oldIndex, newIndex) }
          : col
      )
    )
  }

  function handleDragCancel() {
    setActiveId(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className={cn("flex items-start gap-4 overflow-x-auto pb-2", className)}>
        {columns.map((column) => (
          <BoardColumn
            key={column.id}
            column={column}
            renderCard={renderCard}
          />
        ))}
      </div>
      <DragOverlay>
        {activeCard ? (
          <KanbanCard className="cursor-grabbing shadow-lg">
            {renderCard ? renderCard(activeCard) : activeCard.title}
          </KanbanCard>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export { KanbanBoard, KanbanColumn, KanbanCard }
export type {
  KanbanBoardProps,
  KanbanColumnData,
  KanbanCardData,
  KanbanColumnProps,
  KanbanCardProps,
}
