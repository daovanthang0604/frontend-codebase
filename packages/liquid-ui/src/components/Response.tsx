"use client"

import { type ComponentProps } from "react"
import { Streamdown } from "streamdown"

import { cn } from "@workspace/liquid-ui/lib/utils"

// Renders assistant Markdown for the AI kit via streamdown — which is safe on
// INCOMPLETE markdown mid-stream (unterminated code fences / bold / links),
// supports GFM tables/lists, and highlights code blocks with shiki. Pass the
// (possibly still-streaming) text as children; keep the same node mounted across
// updates so streamdown can animate tokens in.
function Response({ className, ...props }: ComponentProps<typeof Streamdown>) {
  return (
    <Streamdown
      className={cn(
        // WDS prose: readable ink, comfortable rhythm, block spacing. streamdown
        // ships sensible element defaults; this tunes the container to the kit.
        "text-gray-12 space-y-3 text-sm leading-relaxed break-words",
        "[&_pre]:my-3 [&_pre]:rounded-lg [&_pre]:border [&_pre]:text-[13px]",
        "[&_code]:rounded [&_code]:text-[0.9em]",
        "[&_a]:text-accent-11 [&_a]:underline [&_a]:underline-offset-2",
        "[&_ol]:list-decimal [&_ul]:list-disc [&_:is(ol,ul)]:pl-5",
        "[&_table]:border [&_th]:border [&_td]:border [&_:is(th,td)]:px-2 [&_:is(th,td)]:py-1",
        "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
      {...props}
    />
  )
}

export { Response }
