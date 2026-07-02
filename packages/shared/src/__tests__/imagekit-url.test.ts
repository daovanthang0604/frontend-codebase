import { describe, expect, it } from "vitest"

import { withTransform } from "../utils/imagekit-url"

describe("withTransform", () => {
  it("appends a tr= query to a plain URL", () => {
    expect(
      withTransform("https://ik.imagekit.io/x/y.jpg", {
        w: 200,
        h: 200,
        fo: "face",
      })
    ).toBe("https://ik.imagekit.io/x/y.jpg?tr=w-200,h-200,fo-face")
  })

  it("uses & when the URL already has a query string", () => {
    expect(
      withTransform("https://ik.imagekit.io/x/y.jpg?v=2", { w: 64, h: 64 })
    ).toBe("https://ik.imagekit.io/x/y.jpg?v=2&tr=w-64,h-64")
  })

  it("returns '' for null/undefined so callers need no guard", () => {
    expect(withTransform(null, { w: 64, h: 64 })).toBe("")
    expect(withTransform(undefined, { w: 64, h: 64 })).toBe("")
  })

  // imagekit-enhancements Slice 3: a signed URL's `ik-s` signature is computed
  // over the exact URL; appending `?tr=` would invalidate it (the asset 401s).
  it("leaves an already-signed URL unchanged (does not break the signature)", () => {
    const signed =
      "https://ik.imagekit.io/x/y.jpg?ik-t=1700000000&ik-s=deadbeef"
    expect(withTransform(signed, { w: 192, h: 192, fo: "face" })).toBe(signed)
  })

  it("detects the signature regardless of param position", () => {
    const signed = "https://ik.imagekit.io/x/y.jpg?foo=1&ik-s=abc&bar=2"
    expect(withTransform(signed, { w: 48, h: 48 })).toBe(signed)
  })
})
