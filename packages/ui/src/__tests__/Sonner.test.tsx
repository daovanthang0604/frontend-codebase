import { describe, expect, it } from "vitest"

import { toast } from "../components/Sonner"

describe("toast", () => {
  it("exports all toast variants", () => {
    expect(toast.success).toBeTypeOf("function")
    expect(toast.error).toBeTypeOf("function")
    expect(toast.info).toBeTypeOf("function")
    expect(toast.warning).toBeTypeOf("function")
    expect(toast.neutral).toBeTypeOf("function")
  })
})
