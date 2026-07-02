import { describe, expect, it } from "vitest"

import { removeEmoji, toNormalText } from "../utils/text"

describe("toNormalText", () => {
  it("converts camelCase to normal text", () => {
    expect(toNormalText("camelCase")).toBe("camel case")
    expect(toNormalText("myVariableName")).toBe("my variable name")
  })

  it("converts snake_case to normal text", () => {
    expect(toNormalText("snake_case")).toBe("snake case")
    expect(toNormalText("my_variable_name")).toBe("my variable name")
  })

  it("converts kebab-case to normal text", () => {
    expect(toNormalText("kebab-case")).toBe("kebab case")
  })

  it("trims and collapses whitespace", () => {
    expect(toNormalText("  hello   world  ")).toBe("hello world")
  })

  it("lowercases the result", () => {
    expect(toNormalText("HelloWorld")).toBe("hello world")
  })
})

describe("removeEmoji", () => {
  it("removes emoji characters from text", () => {
    expect(removeEmoji("Hello 👋 World")).toBe("Hello  World")
  })

  it("returns plain text unchanged", () => {
    expect(removeEmoji("Hello World")).toBe("Hello World")
  })

  it("handles empty string", () => {
    expect(removeEmoji("")).toBe("")
  })
})
