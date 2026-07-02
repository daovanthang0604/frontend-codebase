import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../components/Sheet"

describe("Sheet", () => {
  it("renders SheetHeader with children", () => {
    render(
      <SheetHeader data-testid="header">
        <span>Header content</span>
      </SheetHeader>
    )
    expect(screen.getByTestId("header")).toBeInTheDocument()
    expect(screen.getByText("Header content")).toBeInTheDocument()
  })

  it("renders SheetFooter with children", () => {
    render(
      <SheetFooter data-testid="footer">
        <button>Save</button>
      </SheetFooter>
    )
    expect(screen.getByTestId("footer")).toBeInTheDocument()
    expect(screen.getByText("Save")).toBeInTheDocument()
  })

  it("renders SheetTitle", () => {
    render(<SheetTitle>My Sheet</SheetTitle>)
    expect(screen.getByText("My Sheet")).toBeInTheDocument()
  })

  it("renders SheetDescription", () => {
    render(<SheetDescription>A description</SheetDescription>)
    expect(screen.getByText("A description")).toBeInTheDocument()
  })

  it("applies custom className to header", () => {
    render(
      <SheetHeader data-testid="header" className="custom">
        Content
      </SheetHeader>
    )
    expect(screen.getByTestId("header")).toHaveClass("custom")
  })

  it("applies custom className to footer", () => {
    render(
      <SheetFooter data-testid="footer" className="custom">
        Content
      </SheetFooter>
    )
    expect(screen.getByTestId("footer")).toHaveClass("custom")
  })
})
