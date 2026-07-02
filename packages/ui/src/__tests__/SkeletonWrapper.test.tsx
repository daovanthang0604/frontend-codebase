import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { SkeletonWrapper } from "../components/SkeletonWrapper"

describe("SkeletonWrapper", () => {
  it("renders children", () => {
    render(
      <SkeletonWrapper isLoading={false}>
        <span>Content</span>
      </SkeletonWrapper>
    )
    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  it("shows skeleton overlay when loading", () => {
    const { container } = render(
      <SkeletonWrapper isLoading={true}>
        <span>Content</span>
      </SkeletonWrapper>
    )
    const overlay = container.querySelector(".animate-pulse")
    expect(overlay).toBeInTheDocument()
  })

  it("hides text when loading", () => {
    const { container } = render(
      <SkeletonWrapper isLoading={true}>
        <span>Content</span>
      </SkeletonWrapper>
    )
    const wrapper = container.firstElementChild
    expect(wrapper?.className).toContain("text-transparent")
  })

  it("does not show skeleton overlay when not loading", () => {
    const { container } = render(
      <SkeletonWrapper isLoading={false}>
        <span>Content</span>
      </SkeletonWrapper>
    )
    const overlay = container.querySelector(".animate-pulse")
    expect(overlay).not.toBeInTheDocument()
  })

  it("applies custom className to skeleton overlay", () => {
    const { container } = render(
      <SkeletonWrapper isLoading={true} className="custom-skeleton">
        <span>Content</span>
      </SkeletonWrapper>
    )
    const overlay = container.querySelector(".animate-pulse")
    expect(overlay).toHaveClass("custom-skeleton")
  })
})
