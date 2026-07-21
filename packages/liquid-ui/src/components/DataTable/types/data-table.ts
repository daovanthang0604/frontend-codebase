import type {
  ColumnDef,
  ColumnPinningState,
  ColumnSizingState,
  InitialTableState,
  Row,
  Table,
  TableState,
  VisibilityState,
} from "@tanstack/react-table"
import type { ButtonProps } from "@workspace/liquid-ui/components/Button"

export interface DataTableProps<TData> {
  /** Columns to display */
  columns: ColumnDef<TData, any>[]
  /** Data to display */
  data: TData[]
  /** Whether the data is fetched from the server or client. Defaults to "server" */
  dataSource?: "server" | "client"
  /** Whether the data is loading */
  isLoading?: boolean
  /** Whether the data is fetching */
  isFetching?: boolean
  /** Whether the data is error */
  isError?: boolean
  /** Error message */
  errorMessage?: string
  /** Search placeholder */
  searchPlaceholder?: string
  /** Render a toolbar */
  filterBar?: (table: { table: Table<TData> }) => React.ReactNode
  /** Render an action bar */
  actionBar?: ({
    table,
  }: {
    table: Table<TData>
    clearSelection: () => void
  }) => React.ReactNode
  /** Initial state for the table */
  initialState?: InitialTableState
  /** Callback when the state changes */
  onStateChange?: (state: TableState) => void
  /** Total number of rows for server-side pagination */
  rowCount?: number
  /** Whether to enable row selection */
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean)
  /** Key to store the display settings in localStorage */
  storageKey?: string
  defaultColumnVisibility?: VisibilityState
  defaultColumnSizing?: ColumnSizingState
  defaultColumnPinning?: ColumnPinningState
  defaultColumnOrder?: string[]
  /** Estimated row height for virtualization */
  estimatedRowHeight?: number
  /** Title for the empty state */
  emptyStateTitle?: string
  /** Description for the empty state */
  emptyStateDescription?: string
  /** Icon for the empty state */
  emptyStateIcon?: React.ReactNode
}
export interface SortingState {
  id: string
  desc: boolean
}
export interface BulkAction {
  label: string
  leftIcon?: React.ReactNode
  onClick: (selectedRows: Record<string, boolean>) => void
  intent?: ButtonProps["intent"]
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
}
export interface DisplaySettings {
  columnVisibility: VisibilityState
  columnSizing: ColumnSizingState
  columnPinning: ColumnPinningState
  columnOrder: string[]
}
export interface DataTableState {
  sorting: SortingState[]
  columnVisibility: VisibilityState
  columnSizing: ColumnSizingState
  columnPinning: ColumnPinningState
  columnOrder: string[]
  rowSelection: Record<string, boolean>
}
export interface DataTableColumnMeta {
  truncate?: boolean
  label?: string
}
