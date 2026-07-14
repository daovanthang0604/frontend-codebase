"use client"

import { createContext, useContext, type ReactNode } from "react"

import { cn } from "@workspace/liquid-ui/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/liquid-ui/components/Avatar"

// AI/CHAT kit — a presentational, SDK-agnostic chat message row. The whole kit
// shares one layout language: assistant turns are full-width plain prose with a
// small avatar on the left; user turns are a right-aligned soft bubble. `Message`
// publishes its `from` role over context so `MessageContent` can style itself
// (bubble vs. plain) without prop drilling.

type Role = "user" | "assistant"

const MessageContext = createContext<Role>("assistant")

// First letter of the first + last word (e.g. "Ada Lovelace" -> "AL"); a single
// word contributes its first two letters (e.g. "AI" -> "AI").
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ""
  const first = parts[0] ?? ""
  if (parts.length === 1) return first.slice(0, 2).toUpperCase()
  const last = parts[parts.length - 1] ?? ""
  return (first.charAt(0) + last.charAt(0)).toUpperCase()
}

function Message({
  from,
  children,
  className,
}: {
  from: Role
  children: ReactNode
  className?: string
}) {
  return (
    <MessageContext.Provider value={from}>
      <div
        data-role={from}
        className={cn(
          from === "user" ? "flex justify-end" : "flex gap-3",
          className
        )}
      >
        {children}
      </div>
    </MessageContext.Provider>
  )
}

function MessageContent({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const from = useContext(MessageContext)
  return (
    <div
      data-slot="message-content"
      className={cn(
        from === "user"
          ? "bg-gray-3 text-gray-12 max-w-[80%] rounded-2xl px-4 py-2.5 text-sm"
          : "text-gray-12 min-w-0 flex-1 text-sm",
        className
      )}
    >
      {children}
    </div>
  )
}

function MessageAvatar({ src, name }: { src?: string; name?: string }) {
  return (
    <Avatar className="size-8 shrink-0">
      {src ? <AvatarImage src={src} alt={name} /> : null}
      <AvatarFallback>{name ? initials(name) : null}</AvatarFallback>
    </Avatar>
  )
}

export { Message, MessageAvatar, MessageContent }
