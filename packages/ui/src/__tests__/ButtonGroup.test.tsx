import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ButtonGroup } from "../components/ButtonGroup"

describe("ButtonGroup", () => {
  it("renders with group role", () => {
    render(
      <ButtonGroup>
        <button>A</button>
        <button>B</button>
      </ButtonGroup>
    )

    expect(screen.getByRole("group")).toBeInTheDocument()
    expect(screen.getByRole("group")).toHaveAttribute(
      "data-slot",
      "button-group"
    )
  })

  it("renders children", () => {
    render(
      <ButtonGroup>
        <button>First</button>
        <button>Second</button>
      </ButtonGroup>
    )

    expect(screen.getByText("First")).toBeInTheDocument()
    expect(screen.getByText("Second")).toBeInTheDocument()
  })

  it("sets orientation data attribute", () => {
    render(
      <ButtonGroup orientation="vertical">
        <button>A</button>
      </ButtonGroup>
    )

    expect(screen.getByRole("group")).toHaveAttribute(
      "data-orientation",
      "vertical"
    )
  })

  it("defaults to horizontal orientation", () => {
    render(
      <ButtonGroup orientation="horizontal">
        <button>A</button>
      </ButtonGroup>
    )

    expect(screen.getByRole("group")).toHaveAttribute(
      "data-orientation",
      "horizontal"
    )
  })

  it("applies custom className", () => {
    render(
      <ButtonGroup className="custom-group">
        <button>A</button>
      </ButtonGroup>
    )

    expect(screen.getByRole("group")).toHaveClass("custom-group")
  })
})
