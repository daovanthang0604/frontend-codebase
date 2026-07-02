import { describe, expect, it } from "vitest"

import { buttonVariants } from "../components/Button.variants"

describe("buttonVariants", () => {
  it("generates default classes", () => {
    const classes = buttonVariants()
    expect(classes).toContain("inline-flex")
    expect(classes).toContain("cursor-pointer")
  })

  it("applies size variants", () => {
    expect(buttonVariants({ size: "xs" })).toContain("h-7")
    expect(buttonVariants({ size: "sm" })).toContain("h-8")
    expect(buttonVariants({ size: "md" })).toContain("h-10")
    expect(buttonVariants({ size: "lg" })).toContain("h-12")
  })

  it("applies intent variants", () => {
    expect(buttonVariants({ intent: "primary" })).toContain("ring-accent-7")
    expect(buttonVariants({ intent: "secondary" })).toContain("ring-gray-7")
    expect(buttonVariants({ intent: "danger" })).toContain("ring-error-7")
  })

  it("applies solid primary compound variant", () => {
    const classes = buttonVariants({
      variant: "solid",
      intent: "primary",
    })
    expect(classes).toContain("bg-accent-solid")
    expect(classes).toContain("text-accent-contrast")
  })

  it("applies solid danger compound variant", () => {
    const classes = buttonVariants({
      variant: "solid",
      intent: "danger",
    })
    expect(classes).toContain("bg-error-9")
    expect(classes).toContain("text-white")
  })

  it("applies outline secondary compound variant", () => {
    const classes = buttonVariants({
      variant: "outline",
      intent: "secondary",
    })
    expect(classes).toContain("border-gray-7")
    expect(classes).toContain("bg-gray-1")
  })

  it("applies ghost variant", () => {
    const classes = buttonVariants({
      variant: "ghost",
      intent: "secondary",
    })
    expect(classes).not.toContain("bg-white")
    expect(classes).not.toContain("border")
  })

  it("applies fullWidth", () => {
    expect(buttonVariants({ fullWidth: true })).toContain("w-full")
  })

  it("applies icon mode size overrides", () => {
    expect(buttonVariants({ mode: "icon", size: "sm" })).toContain("size-8")
    expect(buttonVariants({ mode: "icon", size: "md" })).toContain("size-10")
    expect(buttonVariants({ mode: "icon", size: "lg" })).toContain("size-12")
  })

  it("applies isMenuItem variant", () => {
    const classes = buttonVariants({ isMenuItem: true })
    expect(classes).toContain("justify-start")
    expect(classes).toContain("rounded-none")
  })
})
