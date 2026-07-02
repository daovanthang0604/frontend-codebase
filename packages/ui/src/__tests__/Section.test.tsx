import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Section } from "../components/Section"

describe("Section", () => {
  it("renders a serif (Lora) title and children", () => {
    render(
      <Section data-testid="sec" title="Overview">
        <p>Body</p>
      </Section>
    )
    expect(screen.getByTestId("sec")).toHaveAttribute("data-slot", "section")
    const heading = screen.getByRole("heading", { name: "Overview" })
    expect(heading.tagName).toBe("H2") // default level
    expect(heading).toHaveClass("font-serif", "text-display-sm")
    expect(screen.getByText("Body")).toBeInTheDocument()
  })

  it("renders eyebrow, meta and actions", () => {
    render(
      <Section
        title="Stats"
        eyebrow="In this campaign"
        meta="vs last month"
        actions={<button>Edit</button>}
      />
    )
    expect(screen.getByText("In this campaign")).toBeInTheDocument()
    expect(screen.getByText("vs last month")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument()
  })

  it("honours headingLevel", () => {
    render(<Section title="T" headingLevel={3} />)
    expect(screen.getByRole("heading", { name: "T" }).tagName).toBe("H3")
  })

  it("renders the hairline divider by default and omits it when false", () => {
    const { rerender } = render(<Section data-testid="sec" title="T" />)
    expect(screen.getByTestId("sec").querySelector("header")).toHaveClass(
      "border-b",
      "border-gray-a6"
    )
    rerender(<Section data-testid="sec" title="T" divider={false} />)
    expect(screen.getByTestId("sec").querySelector("header")).not.toHaveClass(
      "border-b"
    )
  })
})
