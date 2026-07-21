import type { RefObject } from "react"
import { Button } from "@workspace/liquid-ui/components/Button"
import { NumberInput } from "@workspace/liquid-ui/components/NumberInput"
import { cn } from "@workspace/liquid-ui/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useMeasure } from "react-use"

interface DataTablePaginationProps {
  pageIndex: number
  pageSize: number
  totalRows: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  className?: string
}
export function DataTablePagination({
  pageIndex,
  pageSize,
  totalRows,
  onPageChange,
  onPageSizeChange: _onPageSizeChange,
  className,
}: DataTablePaginationProps) {
  const [containerRef, { width }] = useMeasure()
  const pageCount = Math.ceil(totalRows / pageSize)
  const canPreviousPage = pageIndex > 0
  const canNextPage = pageIndex < pageCount - 1
  const startRow = totalRows && pageIndex * pageSize + 1
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows)
  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = []
    const maxVisiblePages = 7
    if (pageCount <= maxVisiblePages) {
      for (let i = 0; i < pageCount; i++) {
        pages.push(i)
      }
    } else {
      pages.push(0)
      if (pageIndex <= 2) {
        // Near start: 1, 2, 3, 4, ..., last
        for (let i = 1; i < 4; i++) {
          pages.push(i)
        }
        pages.push("ellipsis")
        pages.push(pageCount - 1)
      } else if (pageIndex >= pageCount - 3) {
        // Near end: 1, ..., last-3, last-2, last-1, last
        pages.push("ellipsis")
        for (let i = pageCount - 4; i < pageCount; i++) {
          pages.push(i)
        }
      } else {
        // Middle: 1, ..., prev, current, next, ..., last
        pages.push("ellipsis")
        pages.push(pageIndex - 1)
        pages.push(pageIndex)
        pages.push(pageIndex + 1)
        pages.push("ellipsis")
        pages.push(pageCount - 1)
      }
    }
    return pages
  }
  return (
    <div
      ref={containerRef as unknown as RefObject<HTMLDivElement>}
      className={cn(
        "border-border flex min-h-[50px] items-center justify-between border-t px-6 py-2",
        className
      )}
    >
      {/* Per Page Select & Total Rows */}
      <div className={"flex items-center gap-6 text-sm"}>
        {/* <div className="flex items-center gap-2">
          <span className="text-gray-11 whitespace-nowrap">Rows per page</span>
          <Select
            triggerClassName="w-[80px]"
            popoverProps={{ className: "w-[97px]" }}
            isSearchable={false}
            isClearable={false}
            value={pageSizeOptions.find((option) => option.value === pageSize)}
            onChange={(value) => {
              onPageSizeChange(value.value)
            }}
            options={pageSizeOptions}
          />
        </div> */}
        <span className="text-gray-11 whitespace-nowrap">
          Showing {startRow} to {endRow} of {totalRows}
        </span>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-6">
        {width > 768 && totalRows > pageSize && (
          <div className="flex items-center gap-1.5">
            <Button
              mode="icon"
              size="sm"
              variant="outline"
              onClick={() => onPageChange(pageIndex - 1)}
              isDisabled={!canPreviousPage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {getPageNumbers().map((page, index) =>
              page === "ellipsis" ? (
                <span key={`ellipsis-${index}`} className="text-gray-11 px-2">
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  mode="icon"
                  size="sm"
                  className="transition-none"
                  onClick={() => onPageChange(page)}
                  variant={page === pageIndex ? "solid" : "outline"}
                >
                  {page + 1}
                </Button>
              )
            )}

            <Button
              mode="icon"
              size="sm"
              variant="outline"
              isDisabled={!canNextPage}
              onClick={() => onPageChange(pageIndex + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {width <= 768 && totalRows > pageSize && (
          <div className="flex items-center gap-2">
            <span className="text-gray-11 text-sm">Go to</span>
            <NumberInput
              showStepper
              minValue={1}
              maxValue={pageCount}
              value={pageIndex + 1}
              onChange={(value) => onPageChange(value - 1)}
              className="h-8 w-16 text-center"
              aria-label="Go to page"
              onFocus={(e) => {
                const input = e.target as HTMLInputElement
                input.select()
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
