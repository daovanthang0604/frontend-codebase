import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ScrollArea } from "../components/ScrollArea"

describe("ScrollArea", () => {
  it("renders children", () => {
    render(
      <ScrollArea>
        <p>Scrollable content</p>
      </ScrollArea>
    )

    expect(screen.getByText("Scrollable content")).toBeInTheDocument()
  })

  it("renders with correct data-slot", () => {
    const { container } = render(
      <ScrollArea>
        <p>Content</p>
      </ScrollArea>
    )

    expect(
      container.querySelector('[data-slot="scroll-area"]')
    ).toBeInTheDocument()
  })

  it("renders viewport with data-slot", () => {
    const { container } = render(
      <ScrollArea>
        <p>Content</p>
      </ScrollArea>
    )

    expect(
      container.querySelector('[data-slot="scroll-area-viewport"]')
    ).toBeInTheDocument()
  })

  it("applies custom className", () => {
    const { container } = render(
      <ScrollArea className="h-64">
        <p>Content</p>
      </ScrollArea>
    )

    expect(container.querySelector('[data-slot="scroll-area"]')).toHaveClass(
      "h-64"
    )
  })
})
