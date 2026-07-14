"use client"

import type { ReactNode } from "react"
import { ChevronDown, Wrench } from "lucide-react"

import { Badge } from "@workspace/liquid-ui/components/Badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/liquid-ui/components/Collapsible"
import { cn } from "@workspace/liquid-ui/lib/utils"

// Presentational, SDK-agnostic tool / function-call disclosure for the AI kit.
// Composes the Base UI Collapsible into a compact technical card: a header row
// naming the tool (mono) with a status pill, and a panel that shows the JSON
// input and the output (or an error). All state is passed in — this renders it.

type ToolState =
  | "input-streaming"
  | "input-available"
  | "output-available"
  | "output-error"

// AI SDK tool lifecycle -> a status pill: pending → running → done, plus error.
const STATE_META: Record<
  ToolState,
  { label: string; color: "gray" | "info" | "success" | "error" }
> = {
  "input-streaming": { label: "Pending", color: "gray" },
  "input-available": { label: "Running", color: "info" },
  "output-available": { label: "Completed", color: "success" },
  "output-error": { label: "Error", color: "error" },
}

function Tool({
  children,
  className,
  defaultOpen,
}: {
  children: ReactNode
  className?: string
  defaultOpen?: boolean
}) {
  return (
    <Collapsible
      defaultOpen={defaultOpen}
      className={cn("bg-gray-2 rounded-lg border text-sm", className)}
    >
      {children}
    </Collapsible>
  )
}

function ToolHeader({
  type,
  state,
  className,
}: {
  type: string
  state?: ToolState
  className?: string
}) {
  const meta = state ? STATE_META[state] : null

  return (
    <CollapsibleTrigger
      className={cn(
        "hover:bg-gray-3 gap-2 rounded-lg px-3 py-2 transition-colors",
        className
      )}
    >
      <Wrench className="text-gray-11 size-4 shrink-0" />
      <span className="text-gray-12 font-mono text-xs">{type}</span>
      {meta ? (
        <Badge size="sm" color={meta.color}>
          {meta.label}
        </Badge>
      ) : null}
      <ChevronDown className="text-gray-11 ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[open]:rotate-180" />
    </CollapsibleTrigger>
  )
}

function ToolContent({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) {
  return (
    <CollapsibleContent className={className}>
      {/* Inner wrapper carries the visuals so the panel's measured height (which
          Base UI animates) stays the content's own box. */}
      <div className="space-y-3 border-t p-3">{children}</div>
    </CollapsibleContent>
  )
}

function ToolInput({ input }: { input: unknown }) {
  return (
    <div className="space-y-1.5">
      <p className="text-gray-11 text-xs font-medium">Input</p>
      <pre className="bg-gray-3 text-gray-12 overflow-x-auto rounded-md p-2 text-xs">
        <code>{JSON.stringify(input, null, 2)}</code>
      </pre>
    </div>
  )
}

function ToolOutput({
  output,
  errorText,
}: {
  output?: ReactNode
  errorText?: string
}) {
  if (errorText == null && output == null) return null

  const isError = errorText != null

  return (
    <div className="space-y-1.5">
      <p className="text-gray-11 text-xs font-medium">
        {isError ? "Error" : "Output"}
      </p>
      {isError ? (
        <div className="text-error-11 text-xs">{errorText}</div>
      ) : (
        <div className="text-gray-12 text-sm break-words">{output}</div>
      )}
    </div>
  )
}

export { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput }
export type { ToolState }
