import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DataTableToolbarContainer } from "../components/DataTable/DataTableToolbarContainer"

describe("DataTableToolbarContainer", () => {
  it("renders header", () => {
    render(<DataTableToolbarContainer header={<span>Header</span>} />)
    expect(screen.getByText("Header")).toBeInTheDocument()
  })

  it("renders content when provided", () => {
    render(
      <DataTableToolbarContainer
        header={<span>Header</span>}
        content={<span>Toolbar content</span>}
      />
    )
    expect(screen.getByText("Toolbar content")).toBeInTheDocument()
  })

  it("does not render separator when no content", () => {
    const { container } = render(
      <DataTableToolbarContainer header={<span>Header</span>} />
    )
    // Separator should not exist
    const separator = container.querySelector("[class*='h-px']")
    expect(separator).not.toBeInTheDocument()
  })

  it("renders separator when content is present", () => {
    const { container } = render(
      <DataTableToolbarContainer
        header={<span>Header</span>}
        content={<span>Content</span>}
      />
    )
    // Separator should exist between header and content
    const separators = container.querySelectorAll("[class*='h-px']")
    expect(separators.length).toBeGreaterThan(0)
  })
})
