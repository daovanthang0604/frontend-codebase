import DOMPurify from "dompurify"
import { marked } from "marked"

const ALLOWED_TAGS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "br",
  "hr",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "del",
  "mark",
  "sub",
  "sup",
  "code",
  "pre",
  "blockquote",
  "a",
  "ul",
  "ol",
  "li",
  "img",
  "figure",
  "figcaption",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "span",
  "div",
]

const ALLOWED_ATTR = ["href", "src", "alt", "title", "class", "target", "rel"]

/**
 * Parses markdown (or already-HTML content) and returns sanitized HTML.
 * Input is treated as untrusted — it may come from LLM output.
 * `marked` passes HTML through mostly unchanged, so callers don't need to
 * distinguish between the two formats.
 */
export function sanitizeContent(content: string): string {
  const rawHtml = marked.parse(content, { async: false }) as string

  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|#|\/)/i,
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onfocus"],
  })
}
