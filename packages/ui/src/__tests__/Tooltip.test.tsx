import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Tooltip, TooltipTrigger } from "../components/Tooltip"

describe("TooltipTrigger", () => {
  it("renders trigger children", () => {
    render(
      <TooltipTrigger>
        <button>Hover me</button>
        <Tooltip>Tooltip text</Tooltip>
      </TooltipTrigger>
    )
    expect(screen.getByText("Hover me")).toBeInTheDocument()
  })

  it("renders trigger as a button", () => {
    render(
      <TooltipTrigger>
        <button>Trigger</button>
        <Tooltip>Info</Tooltip>
      </TooltipTrigger>
    )
    expect(screen.getByRole("button")).toBeInTheDocument()
  })
})
