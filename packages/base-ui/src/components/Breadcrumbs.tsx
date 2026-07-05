import {
  cloneElement,
  isValidElement,
  type ComponentProps,
  type ReactElement,
} from "react"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@workspace/base-ui/lib/utils"

// Pure custom component — Base UI ships no breadcrumb primitive, so this is
// plain semantic HTML (nav > ol > li) styled with WDS tokens. No "use client":
// it is entirely static (asChild is done with cloneElement, not a hook).

// Breadcrumbs owns both the <nav> landmark and the <ol> list; `className`
// extends the list so callers can tune spacing without a separate List export.
function Breadcrumbs({
  className,
  children,
  ...props
}: ComponentProps<"nav">) {
  return (
    <nav aria-label="breadcrumb" {...props}>
      <ol
        className={cn(
          "text-gray-11 flex flex-wrap items-center gap-1.5 text-sm",
          className
        )}
      >
        {children}
      </ol>
    </nav>
  )
}

function BreadcrumbItem({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  )
}

// `asChild` renders the caller's element (e.g. a router <Link>) with the link
// styling merged in — a hook-free stand-in for Radix's Slot.
function BreadcrumbLink({
  asChild = false,
  className,
  children,
  ...props
}: ComponentProps<"a"> & { asChild?: boolean }) {
  const classes = cn(
    "text-gray-11 hover:text-gray-12 rounded-sm transition-colors outline-none",
    "focus-visible:ring-accent-7 focus-visible:ring-2",
    className
  )

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<any>
    return cloneElement(child, {
      ...props,
      ...child.props,
      className: cn(classes, child.props.className),
    })
  }

  return (
    <a className={classes} {...props}>
      {children}
    </a>
  )
}

// The current page: not a link, announced as current.
function BreadcrumbPage({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-gray-12 font-medium", className)}
      {...props}
    />
  )
}

// Decorative divider — hidden from assistive tech. Defaults to a chevron but
// accepts children so a caller can swap the glyph (e.g. a slash).
function BreadcrumbSeparator({
  children,
  className,
  ...props
}: ComponentProps<"li">) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn("text-gray-9 [&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  )
}

// Collapsed-crumbs indicator; pair with a menu/popover to reveal hidden items.
function BreadcrumbEllipsis({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn(
        "text-gray-11 flex size-5 items-center justify-center",
        className
      )}
      {...props}
    >
      <MoreHorizontal className="size-4" />
    </span>
  )
}

export {
  Breadcrumbs,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
}
