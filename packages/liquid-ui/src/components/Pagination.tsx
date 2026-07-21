import type { ComponentProps } from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { buttonVariants } from "@workspace/liquid-ui/components/Button"
import { cn } from "@workspace/liquid-ui/lib/utils"

// Pure custom component — Base UI ships no pagination primitive, so this is
// presentational semantic HTML (nav > ul > li) whose interactive cells reuse the
// house `buttonVariants`. No "use client": callers wire onClick/href themselves.

function Pagination({ className, ...props }: ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul className={cn("flex items-center gap-1", className)} {...props} />
  )
}

function PaginationItem({ className, ...props }: ComponentProps<"li">) {
  return <li className={className} {...props} />
}

type PaginationLinkProps = ComponentProps<"a"> & {
  isActive?: boolean
  /** `icon` = square page cell; `default` = padded prev/next with a label. */
  size?: "default" | "icon"
}

// Active page: bordered accent (outline/primary). Inactive: neutral ghost.
// Both settle to a consistent h-9 so page numbers and prev/next line up.
function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-active={isActive || undefined}
      className={cn(
        buttonVariants({
          mode: size === "icon" ? "icon" : "default",
          variant: isActive ? "outline" : "ghost",
          intent: isActive ? "primary" : "secondary",
        }),
        size === "icon" ? "size-9" : "h-9 gap-1 px-2.5",
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  ...props
}: ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("pl-2.5", className)}
      {...props}
    >
      <ChevronLeft />
      <span>Previous</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  ...props
}: ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("pr-2.5", className)}
      {...props}
    >
      <span>Next</span>
      <ChevronRight />
    </PaginationLink>
  )
}

function PaginationEllipsis({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "text-gray-11 flex size-9 items-center justify-center",
        className
      )}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
export type { PaginationLinkProps }
