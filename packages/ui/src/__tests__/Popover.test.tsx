import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Button } from "../components/Button"
import { Popover, PopoverDialog, PopoverTrigger } from "../components/Popover"

describe("Popover", () => {
  it("renders trigger", () => {
    render(
      <PopoverTrigger>
        <Button>Open Popover</Button>
        <Popover>
          <PopoverDialog>Popover content</PopoverDialog>
        </Popover>
      </PopoverTrigger>
    )
    expect(screen.getByText("Open Popover")).toBeInTheDocument()
  })

  it("shows popover content on trigger click", () => {
    render(
      <PopoverTrigger>
        <Button>Toggle</Button>
        <Popover>
          <PopoverDialog>Hello from popover</PopoverDialog>
        </Popover>
      </PopoverTrigger>
    )
    fireEvent.click(screen.getByText("Toggle"))
    expect(screen.getByText("Hello from popover")).toBeInTheDocument()
  })
})
