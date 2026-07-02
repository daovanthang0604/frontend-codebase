import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ListBox, ListBoxHeader, ListBoxItem } from "../components/ListBox"

describe("ListBox", () => {
  it("renders listbox with items", () => {
    render(
      <ListBox aria-label="Options" selectionMode="single">
        <ListBoxItem id="1">Option 1</ListBoxItem>
        <ListBoxItem id="2">Option 2</ListBoxItem>
        <ListBoxItem id="3">Option 3</ListBoxItem>
      </ListBox>
    )
    expect(screen.getByRole("listbox")).toBeInTheDocument()
    expect(screen.getByText("Option 1")).toBeInTheDocument()
    expect(screen.getByText("Option 2")).toBeInTheDocument()
    expect(screen.getByText("Option 3")).toBeInTheDocument()
  })

  it("renders items as options", () => {
    render(
      <ListBox aria-label="Options" selectionMode="single">
        <ListBoxItem id="1">Item A</ListBoxItem>
        <ListBoxItem id="2">Item B</ListBoxItem>
      </ListBox>
    )
    expect(screen.getAllByRole("option")).toHaveLength(2)
  })

  it("renders header", () => {
    render(<ListBoxHeader>Section Title</ListBoxHeader>)
    expect(screen.getByText("Section Title")).toBeInTheDocument()
  })

  it("applies custom className", () => {
    render(
      <ListBox aria-label="Test" className="custom-list">
        <ListBoxItem id="1">Item</ListBoxItem>
      </ListBox>
    )
    expect(screen.getByRole("listbox")).toHaveClass("custom-list")
  })
})
