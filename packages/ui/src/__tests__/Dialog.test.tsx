import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Button } from "../components/Button"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/Dialog"

describe("Dialog", () => {
  it("renders dialog trigger", () => {
    render(
      <DialogTrigger>
        <Button>Open</Button>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </DialogTrigger>
    )

    expect(screen.getByText("Open")).toBeInTheDocument()
  })

  it("renders dialog header with title and description", () => {
    render(
      <DialogHeader data-testid="header">
        <DialogTitle>My Dialog</DialogTitle>
        <DialogDescription>Some description</DialogDescription>
      </DialogHeader>
    )

    expect(screen.getByText("My Dialog")).toBeInTheDocument()
    expect(screen.getByText("Some description")).toBeInTheDocument()
  })

  it("renders dialog footer", () => {
    render(
      <DialogFooter data-testid="footer">
        <button>Cancel</button>
        <button>Confirm</button>
      </DialogFooter>
    )

    expect(screen.getByText("Cancel")).toBeInTheDocument()
    expect(screen.getByText("Confirm")).toBeInTheDocument()
  })

  it("applies custom className to header", () => {
    render(
      <DialogHeader data-testid="header" className="custom-header">
        <DialogTitle>Title</DialogTitle>
      </DialogHeader>
    )

    expect(screen.getByTestId("header")).toHaveClass("custom-header")
  })

  it("applies custom className to footer", () => {
    render(
      <DialogFooter data-testid="footer" className="custom-footer">
        <button>OK</button>
      </DialogFooter>
    )

    expect(screen.getByTestId("footer")).toHaveClass("custom-footer")
  })
})
