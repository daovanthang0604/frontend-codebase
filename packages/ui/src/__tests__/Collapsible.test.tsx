import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/Collapsible"

describe("Collapsible", () => {
  it("renders trigger and content", () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Hidden content</CollapsibleContent>
      </Collapsible>
    )

    expect(screen.getByText("Toggle")).toBeInTheDocument()
  })

  it("renders with defaultOpen", () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Visible content</CollapsibleContent>
      </Collapsible>
    )

    expect(screen.getByText("Visible content")).toBeInTheDocument()
  })

  it("toggles content on trigger click", () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    )

    fireEvent.click(screen.getByText("Toggle"))
    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  it("applies custom className", () => {
    const { container } = render(
      <Collapsible className="custom-collapsible">
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    )

    expect(container.firstElementChild).toHaveClass("custom-collapsible")
  })
})
