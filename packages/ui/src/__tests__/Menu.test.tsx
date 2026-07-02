import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Button } from "../components/Button"
import {
  Menu,
  MenuHeader,
  MenuItem,
  MenuPopover,
  MenuSeparator,
  MenuTrigger,
} from "../components/Menu"

describe("Menu", () => {
  it("renders menu trigger", () => {
    render(
      <MenuTrigger>
        <Button>Open Menu</Button>
        <MenuPopover>
          <Menu>
            <MenuItem id="edit">Edit</MenuItem>
            <MenuItem id="delete">Delete</MenuItem>
          </Menu>
        </MenuPopover>
      </MenuTrigger>
    )
    expect(screen.getByText("Open Menu")).toBeInTheDocument()
  })

  it("opens menu on trigger click", () => {
    render(
      <MenuTrigger>
        <Button>Actions</Button>
        <MenuPopover>
          <Menu>
            <MenuItem id="copy">Copy</MenuItem>
            <MenuItem id="paste">Paste</MenuItem>
          </Menu>
        </MenuPopover>
      </MenuTrigger>
    )
    fireEvent.click(screen.getByText("Actions"))
    expect(screen.getByText("Copy")).toBeInTheDocument()
    expect(screen.getByText("Paste")).toBeInTheDocument()
  })

  it("renders menu header", () => {
    render(
      <MenuTrigger>
        <Button>Menu</Button>
        <MenuPopover>
          <Menu>
            <MenuHeader>File Options</MenuHeader>
            <MenuItem id="new">New</MenuItem>
          </Menu>
        </MenuPopover>
      </MenuTrigger>
    )
    fireEvent.click(screen.getByText("Menu"))
    expect(screen.getByText("File Options")).toBeInTheDocument()
  })

  it("renders menu separator", () => {
    render(
      <MenuTrigger>
        <Button>Menu</Button>
        <MenuPopover>
          <Menu>
            <MenuItem id="a">A</MenuItem>
            <MenuSeparator data-testid="sep" />
            <MenuItem id="b">B</MenuItem>
          </Menu>
        </MenuPopover>
      </MenuTrigger>
    )
    fireEvent.click(screen.getByText("Menu"))
    expect(screen.getByTestId("sep")).toBeInTheDocument()
  })
})
