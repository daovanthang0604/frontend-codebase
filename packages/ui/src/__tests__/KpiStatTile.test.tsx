import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { KpiStatTile } from "../components/KpiStatTile"

describe("KpiStatTile", () => {
  it("renders the label and value", () => {
    render(<KpiStatTile label="Active" value="42" />)
    expect(screen.getByText("Active")).toBeInTheDocument()
    expect(screen.getByText("42")).toBeInTheDocument()
  })

  it("is non-interactive (no button) when onSelect is omitted", () => {
    render(<KpiStatTile label="Paid" value="3" />)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("renders a selectable button that reflects selected via aria-pressed", () => {
    render(
      <KpiStatTile label="Active" value="42" selected onSelect={() => {}} />
    )
    const button = screen.getByRole("button")
    expect(button).toHaveAttribute("aria-pressed", "true")
  })

  it("fires onSelect when the selectable tile is clicked", () => {
    const onSelect = vi.fn()
    render(<KpiStatTile label="Drafts" value="5" onSelect={onSelect} />)
    fireEvent.click(screen.getByRole("button"))
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it("renders the secondary slot when provided", () => {
    render(
      <KpiStatTile label="Published" value="7" secondary={<span>+42%</span>} />
    )
    expect(screen.getByText("+42%")).toBeInTheDocument()
  })
})
