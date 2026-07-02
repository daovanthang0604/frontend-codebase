import React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/Breadcrumb"
import { Link } from "@tanstack/react-router"

export interface AppBreadcrumbItem {
  label?: string
  href?: string
  isCurrentPage?: boolean
  render?: () => React.ReactNode
}

export interface AppBreadcrumbProps {
  items: AppBreadcrumbItem[]
  isLoading?: boolean
}

export function AppBreadcrumb({ items, isLoading }: AppBreadcrumbProps) {
  const renderItem = (breadcrumb: AppBreadcrumbItem) => {
    const { render, ...rest } = breadcrumb

    if (render) {
      return render()
    }

    if (rest.isCurrentPage) {
      return <BreadcrumbPage>{rest.label}</BreadcrumbPage>
    }

    return (
      <BreadcrumbLink asChild>
        <Link to={rest.href}>{rest.label}</Link>
      </BreadcrumbLink>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-gray-4 h-4 max-w-[250px] flex-1 animate-pulse rounded"></div>
    )
  }

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap whitespace-nowrap">
        {items.map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb.label}>
            <BreadcrumbItem>{renderItem(breadcrumb)}</BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
