"use client"

import { createContext, useContext, type ReactNode } from "react"
import { Brain, ChevronDown } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/base-ui/components/Collapsible"
import { cn } from "@workspace/base-ui/lib/utils"

// Presentational, SDK-agnostic "thinking" disclosure for the AI kit. Composes the
// Base UI Collapsible (Root/Trigger/Panel): a muted trigger row that reads
// "Thinking…" while the model streams its chain-of-thought and settles to
// "Thought for {duration}s" once done; the panel holds the reasoning (usually a
// <Response>) behind a hairline left rail. `isStreaming`/`duration` flow from the
// root to the trigger via context so callers only pass them once.

interface ReasoningContextValue {
  isStreaming?: boolean
  duration?: number
}

const ReasoningContext = createContext<ReasoningContextValue>({})

function useReasoning() {
  return useContext(ReasoningContext)
}

interface ReasoningProps {
  children: ReactNode
  className?: string
  isStreaming?: boolean
  /** Wall-clock seconds the model spent reasoning; shown once streaming ends. */
  duration?: number
  defaultOpen?: boolean
}

function Reasoning({
  children,
  className,
  isStreaming,
  duration,
  defaultOpen,
}: ReasoningProps) {
  return (
    <ReasoningContext.Provider value={{ isStreaming, duration }}>
      <Collapsible defaultOpen={defaultOpen} className={className}>
        {children}
      </Collapsible>
    </ReasoningContext.Provider>
  )
}

function ReasoningTrigger({ className }: { className?: string }) {
  const { isStreaming, duration } = useReasoning()

  const label = isStreaming
    ? "Thinking…"
    : duration != null
      ? `Thought for ${duration}s`
      : "Reasoning"

  return (
    <CollapsibleTrigger
      className={cn(
        "text-gray-11 hover:text-gray-12 flex items-center gap-2 text-sm transition-colors",
        className
      )}
    >
      <Brain className="size-4 shrink-0" />
      <span>{label}</span>
      <ChevronDown className="size-4 shrink-0 transition-transform duration-200 group-data-[open]:rotate-180" />
    </CollapsibleTrigger>
  )
}

function ReasoningContent({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) {
  return (
    <CollapsibleContent className={className}>
      {/* Rail styling lives on an inner element so it is not part of the panel's
          measured height (Base UI animates the panel's own box). */}
      <div className="border-gray-a5 text-gray-11 mt-2 ml-2 border-l pl-4 text-sm">
        {children}
      </div>
    </CollapsibleContent>
  )
}

export { Reasoning, ReasoningContent, ReasoningTrigger }
export type { ReasoningProps }
