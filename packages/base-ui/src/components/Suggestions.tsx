"use client"

import { type ComponentProps, type ReactNode } from "react"

import { Button } from "@workspace/base-ui/components/Button"
import { cn } from "@workspace/base-ui/lib/utils"

// Prompt-starter chips for the AI kit: presentational + SDK-agnostic. The row
// wrapper just lays chips out; each <Suggestion> is a pill Button that reports
// its own text back through onClick so the caller can send it as a prompt.
//
// Shape: <Suggestions>{items.map((s) => <Suggestion key={s} suggestion={s} onClick={send} />)}</Suggestions>.

function Suggestions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  )
}

interface SuggestionProps {
  /** The prompt text — used as the label (unless children override) and passed to onClick. */
  suggestion: string
  onClick?: (suggestion: string) => void
  className?: string
  children?: ReactNode
}

// A pill chip = base-ui Button (outline/secondary/sm) capped into a capsule.
function Suggestion({
  suggestion,
  onClick,
  className,
  children,
}: SuggestionProps) {
  return (
    <Button
      variant="outline"
      intent="secondary"
      size="sm"
      className={cn("rounded-full", className)}
      onPress={() => onClick?.(suggestion)}
    >
      {children ?? suggestion}
    </Button>
  )
}

export { Suggestions, Suggestion }
export type { SuggestionProps }
