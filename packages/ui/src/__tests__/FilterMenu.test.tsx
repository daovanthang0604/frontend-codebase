import { fireEvent, render, screen, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { FilterMenu } from "../components/FilterMenu"

const options = [
  { value: "admin", label: "Admin", count: 2 },
  { value: "editor", label: "Editor", count: 5 },
  { value: "viewer", label: "Viewer", count: 3 },
]

describe("FilterMenu", () => {
  it("renders the label on the trigger pill", () => {
    render(
      <FilterMenu
        label="Role"
        options={options}
        value={[]}
        onChange={() => {}}
      />
    )
    expect(screen.getByRole("button", { name: "Role" })).toBeInTheDocument()
  })

  it("shows no count badge until something is selected", () => {
    render(
      <FilterMenu
        label="Role"
        options={options}
        value={[]}
        onChange={() => {}}
      />
    )
    const trigger = screen.getByRole("button", { name: "Role" })
    expect(within(trigger).queryByText("0")).not.toBeInTheDocument()
  })

  it("shows the active selection count on the trigger", () => {
    render(
      <FilterMenu
        label="Role"
        options={options}
        value={["admin", "editor"]}
        onChange={() => {}}
      />
    )
    const trigger = screen.getByRole("button", { name: "Role" })
    expect(within(trigger).getByText("2")).toBeInTheDocument()
  })

  it("opens the popover with options and their counts", () => {
    render(
      <FilterMenu
        label="Role"
        options={options}
        value={[]}
        onChange={() => {}}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: "Role" }))
    expect(
      screen.getByRole("menuitemcheckbox", { name: /admin/i })
    ).toBeInTheDocument()
    // editor's per-option count
    expect(screen.getByText("5")).toBeInTheDocument()
  })

  it("reflects checked state via aria-checked", () => {
    render(
      <FilterMenu
        label="Role"
        options={options}
        value={["admin"]}
        onChange={() => {}}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: "Role" }))
    expect(
      screen.getByRole("menuitemcheckbox", { name: /admin/i })
    ).toHaveAttribute("aria-checked", "true")
    expect(
      screen.getByRole("menuitemcheckbox", { name: /editor/i })
    ).toHaveAttribute("aria-checked", "false")
  })

  it("adds an unselected option to the selection (multiple)", () => {
    const onChange = vi.fn()
    render(
      <FilterMenu
        label="Role"
        options={options}
        value={["admin"]}
        onChange={onChange}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: "Role" }))
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: /editor/i }))
    expect(onChange).toHaveBeenCalledWith(["admin", "editor"])
  })

  it("removes a selected option from the selection (multiple)", () => {
    const onChange = vi.fn()
    render(
      <FilterMenu
        label="Role"
        options={options}
        value={["admin", "editor"]}
        onChange={onChange}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: "Role" }))
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: /admin/i }))
    expect(onChange).toHaveBeenCalledWith(["editor"])
  })

  it("keeps the popover open after toggling (multiple)", () => {
    render(
      <FilterMenu
        label="Role"
        options={options}
        value={[]}
        onChange={() => {}}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: "Role" }))
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: /admin/i }))
    expect(
      screen.getByRole("menuitemcheckbox", { name: /editor/i })
    ).toBeInTheDocument()
  })

  it("replaces the value in single-select mode", () => {
    const onChange = vi.fn()
    render(
      <FilterMenu
        label="Role"
        multiple={false}
        options={options}
        value={["admin"]}
        onChange={onChange}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: "Role" }))
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: /editor/i }))
    expect(onChange).toHaveBeenCalledWith(["editor"])
  })

  it("shows a Clear action only when active and clears on click", () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <FilterMenu
        label="Role"
        options={options}
        value={[]}
        onChange={onChange}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: "Role" }))
    expect(
      screen.queryByRole("button", { name: /clear role/i })
    ).not.toBeInTheDocument()

    rerender(
      <FilterMenu
        label="Role"
        options={options}
        value={["admin"]}
        onChange={onChange}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: /clear role/i }))
    expect(onChange).toHaveBeenCalledWith([])
  })

  it("accepts plain string options", () => {
    const onChange = vi.fn()
    render(
      <FilterMenu
        label="Role"
        options={["Admin", "Editor"]}
        value={[]}
        onChange={onChange}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: "Role" }))
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: "Admin" }))
    expect(onChange).toHaveBeenCalledWith(["Admin"])
  })
})
