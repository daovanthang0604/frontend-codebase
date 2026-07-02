import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Input, SearchInput, TextArea } from "../components/Input"

describe("Input", () => {
  it("renders input field", () => {
    render(<Input aria-label="Name" />)
    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })

  it("renders with label", () => {
    render(<Input label="Email" />)
    expect(screen.getByText("Email")).toBeInTheDocument()
  })

  it("renders with asterisk", () => {
    render(<Input label="Required" withAsterisk />)
    expect(screen.getByText("*")).toBeInTheDocument()
  })

  it("renders with left icon", () => {
    render(
      <Input
        aria-label="Search"
        leftIcon={<span data-testid="icon">🔍</span>}
      />
    )
    expect(screen.getByTestId("icon")).toBeInTheDocument()
  })

  it("renders with right icon", () => {
    render(
      <Input aria-label="Input" rightIcon={<span data-testid="icon">✓</span>} />
    )
    expect(screen.getByTestId("icon")).toBeInTheDocument()
  })
})

describe("TextArea", () => {
  it("renders textarea", () => {
    render(<TextArea aria-label="Comment" />)
    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })

  it("renders with label", () => {
    render(<TextArea label="Description" />)
    expect(screen.getByText("Description")).toBeInTheDocument()
  })
})

describe("SearchInput", () => {
  it("renders search input", () => {
    render(<SearchInput />)
    expect(screen.getByRole("searchbox")).toBeInTheDocument()
  })
})
