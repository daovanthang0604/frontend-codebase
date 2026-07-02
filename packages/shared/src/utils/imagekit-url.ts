/**
 * Hard-coded ImageKit upload endpoint. ImageKit's SDK ships this same URL
 * and it has been stable across SDK versions; pinning it here means callers
 * don't have to. Re-exported so the FE upload helper and any future
 * server-side proxy share one source of truth.
 */
export const IMAGEKIT_UPLOAD_URL =
  "https://upload.imagekit.io/api/v1/files/upload"

/**
 * Build an ImageKit URL with the requested transformation parameters
 * appended in the `tr=` query string.
 *
 * Returns "" when `url` is null/undefined so callers can drop the result
 * into `<img src={...} />` (or `Avatar` `src`) without an extra guard.
 *
 * Examples:
 *   withTransform("https://ik.imagekit.io/x/y.jpg", { w: 200, h: 200, fo: "face" })
 *   → "https://ik.imagekit.io/x/y.jpg?tr=w-200,h-200,fo-face"
 *
 *   withTransform(undefined, { w: 64, h: 64 })
 *   → ""
 *
 * Signed-URL safety (imagekit-enhancements Slice 3): an ImageKit signed URL
 * carries an `ik-s` signature computed over the exact URL at signing time.
 * Appending `?tr=` / `&tr=` afterwards changes the signed string and
 * invalidates the signature (the asset then 401s). The signature is minted
 * server-side, so the client cannot re-sign a transformed variant. When the
 * URL is already signed we therefore return it unchanged — correctness
 * (the image renders) wins over the client-side resize; the backend mints
 * pre-sized signed URLs where a specific transform is required.
 */
export interface ImagekitTransformOpts {
  w: number
  h: number
  fo?: "face" | "center"
}

/** True for an ImageKit signed delivery URL (carries the `ik-s` signature param). */
function isSignedImagekitUrl(url: string): boolean {
  return /[?&]ik-s=/.test(url)
}

export function withTransform(
  url: string | null | undefined,
  opts: ImagekitTransformOpts
): string {
  if (!url) return ""
  if (isSignedImagekitUrl(url)) return url
  const focusFragment = opts.fo ? `,fo-${opts.fo}` : ""
  const params = `tr=w-${opts.w},h-${opts.h}${focusFragment}`
  return url.includes("?") ? `${url}&${params}` : `${url}?${params}`
}
