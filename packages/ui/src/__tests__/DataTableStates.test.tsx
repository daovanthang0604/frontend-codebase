import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import {
  DataTableEmpty,
  DataTableError,
  DataTableLoading,
} from "../components/DataTable/DataTableStates"

// DataTable states render inside <tbody>, need a table wrapper
function TableWrapper({ children }: { children: React.ReactNode }) {
  return <table>{children}</table>
}

describe("DataTableLoading", () => {
  it("renders spinner", () => {
    const { container } = render(
      <TableWrapper>
        <DataTableLoading />
      </TableWrapper>
    )
    const spinner = container.querySelector("svg.animate-spin")
    expect(spinner).toBeInTheDocument()
  })
})

describe("DataTableEmpty", () => {
  it("renders default empty state", () => {
    render(
      <TableWrapper>
        <DataTableEmpty />
      </TableWrapper>
    )
    expect(screen.getByText("No results found")).toBeInTheDocument()
    expect(
      screen.getByText("Try adjusting your search or filter criteria.")
    ).toBeInTheDocument()
  })

  it("renders custom title and description", () => {
    render(
      <TableWrapper>
        <DataTableEmpty title="Nothing here" description="Custom message" />
      </TableWrapper>
    )
    expect(screen.getByText("Nothing here")).toBeInTheDocument()
    expect(screen.getByText("Custom message")).toBeInTheDocument()
  })
})

describe("DataTableError", () => {
  it("renders default error state", () => {
    render(
      <TableWrapper>
        <DataTableError />
      </TableWrapper>
    )
    expect(screen.getByText("Error loading data")).toBeInTheDocument()
    expect(
      screen.getByText("Something went wrong while loading the data.")
    ).toBeInTheDocument()
  })

  it("renders retry button when onRetry is provided", () => {
    const onRetry = vi.fn()
    render(
      <TableWrapper>
        <DataTableError onRetry={onRetry} />
      </TableWrapper>
    )
    expect(screen.getByText("Try again")).toBeInTheDocument()
  })

  it("does not render retry button when onRetry is not provided", () => {
    render(
      <TableWrapper>
        <DataTableError />
      </TableWrapper>
    )
    expect(screen.queryByText("Try again")).not.toBeInTheDocument()
  })

  it("renders custom error message", () => {
    render(
      <TableWrapper>
        <DataTableError message="Network error" />
      </TableWrapper>
    )
    expect(screen.getByText("Network error")).toBeInTheDocument()
  })
})
