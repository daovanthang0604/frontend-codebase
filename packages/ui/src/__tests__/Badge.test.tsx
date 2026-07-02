import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Badge } from "../components/Badge"

describe("Badge", () => {
  it("renders with default props", () => {
    render(<Badge>Status</Badge>)
    const badge = screen.getByText("Status")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveAttribute("data-slot", "badge")
  })

  it("renders with different sizes", () => {
    const { rerender } = render(<Badge size="sm">Small</Badge>)
    expect(screen.getByText("Small")).toBeInTheDocument()

    rerender(<Badge size="lg">Large</Badge>)
    expect(screen.getByText("Large")).toBeInTheDocument()
  })

  it("applies color style", () => {
    render(<Badge color="red">Error</Badge>)
    const badge = screen.getByText("Error")
    expect(badge).toHaveStyle({
      color: "var(--red-11)",
    })
  })

  it("applies custom className", () => {
    render(<Badge className="custom">Test</Badge>)
    expect(screen.getByText("Test")).toHaveClass("custom")
  })
})
