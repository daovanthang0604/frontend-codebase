// Trigger a browser file download for an already-fetched Blob via a transient
// anchor. Extracted from the inline handler in
// pages/Management/Users/BulkCreateUsersDialog.tsx so the Workflow Jobs row
// actions (phase export + worker logs) and the Discover-Crawl Only export link
// can share one code path (SOW §7.2 / FE-5).
//
// Why blob + anchor (not `window.open`/a plain `<a href>`): the API is JWT-only
// via the axios interceptor, so a bare browser GET wouldn't ship the
// Authorization / x-subdomain headers the admin endpoints require. Callers
// fetch the bytes with `responseType: "blob"` first, then pass the Blob here.
export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  try {
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = filename
    anchor.rel = "noopener"
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
  } finally {
    // Defer the revoke past the current task so the browser has a tick to
    // start reading the blob — a synchronous revoke races the async download
    // read and can produce 0-byte files on Safari / older Firefox.
    setTimeout(() => URL.revokeObjectURL(url), 0)
  }
}
