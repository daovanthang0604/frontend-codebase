import {
  createContext,
  memo,
  useEffect,
  useMemo,
  useRef,
  type RefObject,
} from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Cell,
  type ColumnDef,
  type ColumnPinningState,
  type Header,
  type Table,
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Checkbox } from "@workspace/ui/components/Checkbox"
import type {
  DataTableColumnMeta,
  DataTableProps,
} from "@workspace/ui/components/DataTable/types/data-table"
import { cn } from "@workspace/ui/lib/utils"

import type { FilterValue } from "../Filter"
import { DataTableFloatingBar } from "./DataTableFloatingBar"
import {
  DataTableEmpty,
  DataTableError,
  DataTableLoading,
} from "./DataTableStates"
import { useDataTableSettings } from "./hooks/use-data-table-settings"

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> extends DataTableColumnMeta {}
}
export const DEFAULT_PAGE_SIZE = 20
export const CustomTableContext = createContext<{
  emitStateChange: () => void
}>({
  emitStateChange: () => {},
})
function HeaderCell({
  header,
  isPinned,
}: {
  header: Header<any, any>
  isPinned?: "left" | "right"
}) {
  const isResizing = header.column.getIsResizing()
  return (
    <th
      key={header.id}
      className={cn(
        "text-gray-11 bg-gray-2 relative px-5 py-3.5 text-left align-middle text-[11px] font-bold tracking-[0.06em] whitespace-nowrap uppercase",
        isPinned === "left" &&
          "sticky left-0 z-20 shadow-[-6px_0_2px_-6px_var(--gray-a4)_inset]",
        isPinned === "right" &&
          "sticky right-0 z-20 shadow-[6px_0_2px_-6px_var(--gray-a4)_inset]",
        header.column.getCanResize() && "group"
      )}
      style={{
        width: header.getSize(),
        minWidth: header.column.columnDef.minSize,
        maxWidth: header.column.columnDef.maxSize,
        ...(isPinned === "left" && {
          left: header.column.getStart("left"),
        }),
        ...(isPinned === "right" && {
          right: header.column.getAfter("right"),
        }),
      }}
    >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
      {header.column.getCanResize() && (
        <div
          data-slot="data-table-resize-handle"
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          className={cn(
            "group/resize-handle absolute top-0 right-0 z-10 flex h-full w-2 cursor-col-resize touch-none items-center justify-center select-none"
          )}
        >
          <div
            className={cn(
              "bg-gray-7 group-hover/resize-handle:bg-gray-11 h-6 w-px transition-colors duration-150",
              isResizing && "bg-accent-9!"
            )}
          />
        </div>
      )}
    </th>
  )
}
function TableCell({
  cell,
  isPinned,
}: {
  cell: Cell<any, any>
  isPinned?: "left" | "right"
}) {
  const cellValue = cell.getValue()
  const title =
    typeof cellValue === "string" || typeof cellValue === "number"
      ? String(cellValue)
      : undefined
  const meta = cell.column.columnDef.meta as DataTableColumnMeta | undefined
  const truncate = meta?.truncate ?? true
  return (
    <td
      key={cell.id}
      title={title}
      className={cn(
        "text-gray-12 group-hover:bg-gray-2 px-5 py-4 align-middle text-sm",
        truncate && "truncate",
        "group-data-[state=selected]:bg-accent-a3",
        isPinned === "left" &&
          "bg-gray-1 group-hover:bg-gray-2 group-data-[state=selected]:bg-accent-a3 sticky left-0 z-10 shadow-[-6px_0_2px_-6px_var(--gray-a4)_inset]",
        isPinned === "right" &&
          "bg-gray-1 group-hover:bg-gray-2 group-data-[state=selected]:bg-accent-a3 sticky right-0 z-10 shadow-[6px_0_2px_-6px_var(--gray-a4)_inset]",
        "empty:before:content-['-']"
      )}
      style={{
        width: cell.column.getSize(),
        minWidth: cell.column.columnDef.minSize,
        maxWidth: cell.column.columnDef.maxSize,
        ...(isPinned === "left" && {
          left: cell.column.getStart("left"),
        }),
        ...(isPinned === "right" && {
          right: cell.column.getAfter("right"),
        }),
      }}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  )
}
function TableBody({
  table,
  tableContainerRef,
  estimatedRowHeight,
}: {
  table: Table<any>
  tableContainerRef: RefObject<HTMLDivElement | null>
  estimatedRowHeight: number
}) {
  const { rows } = table.getRowModel()
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => estimatedRowHeight,
    overscan: 10,
  })
  const virtualRows = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()
  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0)
      : 0
  const leftPinnedColumns = table.getLeftVisibleLeafColumns()
  const rightPinnedColumns = table.getRightVisibleLeafColumns()
  const centerColumns = table.getCenterVisibleLeafColumns()
  return (
    <tbody>
      {paddingTop > 0 && (
        <tr>
          <td style={{ height: `${paddingTop}px` }} />
        </tr>
      )}
      {virtualRows.map((virtualRow) => {
        const row = rows[virtualRow.index]
        if (!row) return null
        const isSelected = row.getIsSelected()
        return (
          <tr
            key={row.id}
            data-state={isSelected ? "selected" : undefined}
            className={cn("group border-gray-a4 border-t transition-colors")}
          >
            {leftPinnedColumns.map((column) => {
              const cell = row
                .getVisibleCells()
                .find((c) => c.column.id === column.id)
              return cell ? (
                <TableCell key={cell.id} cell={cell} isPinned="left" />
              ) : null
            })}
            {centerColumns.map((column) => {
              const cell = row
                .getVisibleCells()
                .find((c) => c.column.id === column.id)
              return cell ? <TableCell key={cell.id} cell={cell} /> : null
            })}
            {rightPinnedColumns.map((column) => {
              const cell = row
                .getVisibleCells()
                .find((c) => c.column.id === column.id)
              return cell ? (
                <TableCell key={cell.id} cell={cell} isPinned="right" />
              ) : null
            })}
          </tr>
        )
      })}
      {paddingBottom > 0 && (
        <tr>
          <td style={{ height: `${paddingBottom}px` }} />
        </tr>
      )}
    </tbody>
  )
}
const MemoizedTableBody = memo(
  TableBody,
  (prev, next) => prev.table.options.data === next.table.options.data
) as typeof TableBody
export function DataTable<
  TData extends {
    id: string | number
  },
>({
  // Core data
  columns,
  data,
  dataSource = "server",
  // Loading/error states
  isLoading = false,
  isFetching,
  isError = false,
  errorMessage,
  // Components
  filterBar: _filterBar,
  actionBar,
  // State for server-side operations
  initialState,
  onStateChange,
  rowCount,
  // Selection
  enableRowSelection = false,
  // Search
  searchPlaceholder: _searchPlaceholder = "Search...",
  // Display settings
  storageKey = "default-table",
  defaultColumnVisibility = {},
  defaultColumnSizing = {},
  defaultColumnPinning = { left: [], right: [] },
  defaultColumnOrder,
  // Virtualization
  estimatedRowHeight = 44,
  // Custom empty state
  emptyStateTitle,
  emptyStateDescription,
  emptyStateIcon,
}: DataTableProps<TData>) {
  const tableContainerRef = useRef<HTMLDivElement>(null)
  // Calculate default column order from columns if not provided
  const calculatedDefaultOrder = useMemo(() => {
    if (defaultColumnOrder) return defaultColumnOrder
    return [
      "select",
      ...(columns
        .map(
          (col) =>
            (
              col as {
                accessorKey?: string
              }
            ).accessorKey ||
            (
              col as {
                id?: string
              }
            ).id
        )
        .filter(Boolean) as string[]),
    ]
  }, [columns, defaultColumnOrder])
  const {
    settings,
    updateColumnVisibility,
    updateColumnSizing,
    updateColumnPinning,
    updateColumnOrder,
  } = useDataTableSettings({
    storageKey,
    defaultColumnVisibility,
    defaultColumnSizing,
    defaultColumnPinning,
    defaultColumnOrder: calculatedDefaultOrder,
  })
  // Selection column
  const selectionColumn: ColumnDef<TData> = {
    id: "select",
    size: 48,
    minSize: 48,
    maxSize: 48,
    enableResizing: false,
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => {
      return (
        <div className="flex items-center justify-center">
          <Checkbox
            isSelected={table.getIsAllPageRowsSelected()}
            isIndeterminate={table.getIsSomePageRowsSelected()}
            onChange={(isSelected) => {
              table.toggleAllPageRowsSelected(isSelected)
            }}
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        </div>
      )
    },
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          isSelected={row.getIsSelected()}
          isDisabled={!row.getCanSelect()}
          isIndeterminate={row.getIsSomeSelected()}
          onChange={row.getToggleSelectedHandler()}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      </div>
    ),
  }
  const allColumns = useMemo(() => {
    if (enableRowSelection) {
      return [selectionColumn, ...columns]
    }
    return columns
  }, [columns, enableRowSelection])
  // Always pin selection column to the left
  const columnPinning = useMemo((): ColumnPinningState => {
    const left = settings.columnPinning.left || []
    const right = settings.columnPinning.right || []
    // Ensure "select" is always first in left pinned columns when row selection is enabled
    if (enableRowSelection && !left.includes("select")) {
      return { left: ["select", ...left], right }
    }
    return { left, right }
  }, [settings.columnPinning, enableRowSelection])
  const table = useReactTable({
    data,
    columns: allColumns,
    initialState: {
      pagination: {
        pageSize: DEFAULT_PAGE_SIZE,
      },
      ...initialState,
    },
    rowCount: rowCount,
    state: {
      columnVisibility: settings.columnVisibility,
      columnSizing: settings.columnSizing,
      columnPinning,
      columnOrder:
        settings.columnOrder.length > 0
          ? settings.columnOrder
          : calculatedDefaultOrder,
    },
    enableRowSelection,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "auto",
    onColumnVisibilityChange: (updater) => {
      const newVisibility =
        typeof updater === "function"
          ? updater(settings.columnVisibility)
          : updater
      updateColumnVisibility(newVisibility)
    },
    onColumnSizingChange: (updater) => {
      const newSizing =
        typeof updater === "function" ? updater(settings.columnSizing) : updater
      updateColumnSizing(newSizing)
    },
    onColumnPinningChange: (updater) => {
      const newPinning =
        typeof updater === "function"
          ? updater(settings.columnPinning)
          : updater
      updateColumnPinning(newPinning)
    },
    onColumnOrderChange: (updater) => {
      const newOrder =
        typeof updater === "function" ? updater(settings.columnOrder) : updater
      updateColumnOrder(newOrder)
    },
    getRowId: (row) => String(row.id),
    manualPagination: dataSource === "server",
    manualFiltering: dataSource === "server",
    manualSorting: dataSource === "server",
    autoResetPageIndex: dataSource === "client",
  })
  const { rows } = table.getRowModel()
  // Get pinned and center columns
  const leftPinnedColumns = table.getLeftVisibleLeafColumns()
  const rightPinnedColumns = table.getRightVisibleLeafColumns()
  const centerColumns = table.getCenterVisibleLeafColumns()
  const state = table.getState()
  // column filters props (client side)
  const _columnFilters: FilterValue = useMemo(
    () =>
      state.columnFilters.reduce((acc, filter) => {
        try {
          acc[filter.id] = filter.value as any
          return acc
        } catch {
          return acc
        }
      }, {} as FilterValue),
    [state.columnFilters]
  )
  const emitStateChange = () => {
    setTimeout(() => {
      onStateChange?.(table.getState())
    }, 50)
  }
  const _setColumnFilters = (filters: FilterValue) => {
    table.setColumnFilters(
      Object.entries(filters).map(([id, value]) => ({ id, value }))
    )
    if (dataSource === "server") {
      table.setPageIndex(0)
    }
    emitStateChange()
  }
  const clearSelection = () => {
    table.resetRowSelection()
  }
  useEffect(() => {
    // workaround to force table re-render on initial mount
    table.toggleAllRowsExpanded()
  }, [])
  return (
    <CustomTableContext.Provider value={{ emitStateChange }}>
      <div className="flex flex-col gap-4">
        {/* Toolbar */}
        {/* <div className="flex items-center gap-2">
          <div className="flex-1">
            <DebouncedSearchInput
              placeholder={searchPlaceholder}
              value={table.getState().globalFilter}
              onChange={(v) => {
                table.setGlobalFilter(v)
                emitStateChange()
              }}
            />
          </div>
          {filterBar && (
            <div>
              {filterBar?.({
                table,
              })}
            </div>
          )}
        </div> */}

        {/* Table Container — the table "earns a box": a self-contained white
            card with hairline border and rounded corners (design-system Table). */}
        <div className="border-gray-a4 bg-gray-1 relative overflow-hidden rounded-xl border">
          <div
            ref={tableContainerRef}
            className="relative min-h-[220px] flex-1 overflow-x-auto"
          >
            <table
              data-fetching={isFetching ? "true" : undefined}
              className="w-full table-fixed border-collapse data-[fetching=true]:opacity-60"
            >
              <thead className="sticky top-0 z-30">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {leftPinnedColumns.map((column) => {
                      const header = headerGroup.headers.find(
                        (h) => h.column.id === column.id
                      )
                      return header ? (
                        <HeaderCell
                          key={header.id}
                          header={header}
                          isPinned="left"
                        />
                      ) : null
                    })}
                    {centerColumns.map((column) => {
                      const header = headerGroup.headers.find(
                        (h) => h.column.id === column.id
                      )
                      return header ? (
                        <HeaderCell key={header.id} header={header} />
                      ) : null
                    })}
                    {rightPinnedColumns.map((column) => {
                      const header = headerGroup.headers.find(
                        (h) => h.column.id === column.id
                      )
                      return header ? (
                        <HeaderCell
                          key={header.id}
                          header={header}
                          isPinned="right"
                        />
                      ) : null
                    })}
                  </tr>
                ))}
              </thead>
              {isLoading ? (
                <DataTableLoading />
              ) : isError ? (
                <DataTableError message={errorMessage} />
              ) : rows.length === 0 ? (
                <DataTableEmpty
                  title={emptyStateTitle}
                  description={emptyStateDescription}
                  icon={emptyStateIcon}
                />
              ) : (
                <>
                  {table.getState().columnSizingInfo.isResizingColumn ? (
                    <MemoizedTableBody
                      table={table}
                      tableContainerRef={tableContainerRef}
                      estimatedRowHeight={estimatedRowHeight}
                    />
                  ) : (
                    <TableBody
                      table={table}
                      tableContainerRef={tableContainerRef}
                      estimatedRowHeight={estimatedRowHeight}
                    />
                  )}
                </>
              )}
            </table>
          </div>
        </div>

        {actionBar && enableRowSelection && (
          <DataTableFloatingBar
            selectedCount={Object.keys(table.getState().rowSelection).length}
            onClearSelection={clearSelection}
          >
            {actionBar?.({ table, clearSelection })}
          </DataTableFloatingBar>
        )}
      </div>
    </CustomTableContext.Provider>
  )
}
