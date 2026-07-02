"use client"

import { Button } from "@workspace/ui/components/Button"
import { cn } from "@workspace/ui/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

export interface PaginationProps {
  /** Current page (1-based). */
  page: number
  /** Total number of pages. */
  totalPages: number
  onPageChange: (page: number) => void
  /** Pages to show either side of the current page in the middle. Default 1. */
  siblingCount?: number
  className?: string
}

// Build the visible page list with ellipses. Pages are 1-based; "ellipsis"
// marks a collapsed gap. Page 1 and the last page are always shown.
function getPageItems(
  page: number,
  totalPages: number,
  siblingCount: number
): (number | "ellipsis")[] {
  // first + last + current + 2·siblings + 2 ellipses
  const maxVisible = siblingCount * 2 + 5
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const left = Math.max(page - siblingCount, 1)
  const right = Math.min(page + siblingCount, totalPages)
  const showLeftEllipsis = left > 2
  const showRightEllipsis = right < totalPages - 1

  const items: (number | "ellipsis")[] = [1]

  if (showLeftEllipsis) items.push("ellipsis")
  else for (let i = 2; i < left; i++) items.push(i)

  for (let i = left; i <= right; i++) {
    if (i !== 1 && i !== totalPages) items.push(i)
  }

  if (showRightEllipsis) items.push("ellipsis")
  else for (let i = right + 1; i < totalPages; i++) items.push(i)

  items.push(totalPages)
  return items
}

// WDS Pagination — a standalone page switcher (prev · numbered pages with
// ellipses · next). Controlled: pass `page` (1-based) and `onPageChange`.
function Pagination({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null
  const items = getPageItems(page, totalPages, siblingCount)

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center gap-1.5", className)}
    >
      <Button
        mode="icon"
        size="sm"
        variant="outline"
        aria-label="Previous page"
        isDisabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft />
      </Button>

      {items.map((item, i) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${i}`}
            aria-hidden
            className="text-gray-11 px-1.5 text-sm"
          >
            …
          </span>
        ) : (
          <Button
            key={item}
            mode="icon"
            size="sm"
            className="transition-none"
            variant={item === page ? "solid" : "outline"}
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
            onClick={() => onPageChange(item)}
          >
            {item}
          </Button>
        )
      )}

      <Button
        mode="icon"
        size="sm"
        variant="outline"
        aria-label="Next page"
        isDisabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight />
      </Button>
    </nav>
  )
}

export { Pagination }
