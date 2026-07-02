import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "../components/Avatar"

describe("Avatar", () => {
  it("renders with default size", () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    const avatar = screen.getByTestId("avatar")
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute("data-slot", "avatar")
    expect(avatar).toHaveAttribute("data-size", "default")
  })

  it("renders with sm size", () => {
    render(
      <Avatar data-testid="avatar" size="sm">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByTestId("avatar")).toHaveAttribute("data-size", "sm")
  })

  it("renders with lg size", () => {
    render(
      <Avatar data-testid="avatar" size="lg">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByTestId("avatar")).toHaveAttribute("data-size", "lg")
  })

  it("renders fallback text", () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByText("JD")).toBeInTheDocument()
  })

  it("renders fallback when image has not loaded", () => {
    // Radix Avatar shows fallback until image loads (onload doesn't fire in jsdom)
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.png" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByText("JD")).toBeInTheDocument()
  })

  it("applies custom className", () => {
    render(
      <Avatar data-testid="avatar" className="custom-class">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByTestId("avatar")).toHaveClass("custom-class")
  })
})

describe("AvatarBadge", () => {
  it("renders badge", () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
        <AvatarBadge data-testid="badge" />
      </Avatar>
    )
    expect(screen.getByTestId("badge")).toHaveAttribute(
      "data-slot",
      "avatar-badge"
    )
  })
})

describe("AvatarGroup", () => {
  it("renders group with multiple avatars", () => {
    render(
      <AvatarGroup data-testid="group">
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    )
    expect(screen.getByTestId("group")).toHaveAttribute(
      "data-slot",
      "avatar-group"
    )
    expect(screen.getByText("A")).toBeInTheDocument()
    expect(screen.getByText("B")).toBeInTheDocument()
  })
})

describe("AvatarGroupCount", () => {
  it("renders count", () => {
    render(<AvatarGroupCount>+3</AvatarGroupCount>)
    expect(screen.getByText("+3")).toBeInTheDocument()
  })
})
