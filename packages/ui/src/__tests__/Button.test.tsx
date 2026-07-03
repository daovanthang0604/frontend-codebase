import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Button } from "../components/Button"

describe("Button", () => {
  it("renders with children", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("renders with default type button", () => {
    render(<Button>Submit</Button>)
    expect(screen.getByRole("button")).toHaveAttribute("type", "button")
  })

  it("renders in loading state", () => {
    const { container } = render(<Button isLoading>Loading</Button>)
    const spinner = container.querySelector(".spinner")
    expect(spinner).toBeInTheDocument()
  })

  it("renders icon button with aria-label", () => {
    render(
      <Button mode="icon" tooltip="Settings">
        <span>⚙️</span>
      </Button>
    )
    const button = screen.getByRole("button")
    expect(button).toHaveAttribute("aria-label", "Settings")
  })

  it("renders with left and right icons", () => {
    render(
      <Button
        leftIcon={<span data-testid="left-icon">←</span>}
        rightIcon={<span data-testid="right-icon">→</span>}
      >
        Navigate
      </Button>
    )
    expect(screen.getByTestId("left-icon")).toBeInTheDocument()
    expect(screen.getByTestId("right-icon")).toBeInTheDocument()
  })

  it("renders with badge", () => {
    render(
      <Button withBadge badgeNumber={5}>
        Notifications
      </Button>
    )
    expect(screen.getByText("5")).toBeInTheDocument()
  })

  it("renders with testId", () => {
    render(<Button testId="my-button">Test</Button>)
    expect(screen.getByTestId("my-button")).toBeInTheDocument()
  })

  it("applies disabled state", () => {
    render(<Button isDisabled>Disabled</Button>)
    expect(screen.getByRole("button")).toBeDisabled()
  })
})
