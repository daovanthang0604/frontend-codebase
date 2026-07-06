"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
} from "react"
import { ChevronDown } from "lucide-react"

import { Button } from "@workspace/base-ui/components/Button"
import { cn } from "@workspace/base-ui/lib/utils"

// Presentational, SDK-agnostic chat viewport for the AI kit. It owns nothing but
// scroll behaviour: a native overflow container that STICKS to the bottom as new
// content streams in, but only while the user is already reading the latest turn —
// scrolling up to re-read history detaches the stick so we never yank them down.
//
// Shape: <Conversation><ConversationContent/><ConversationScrollButton/></Conversation>.
// The wrapper is `relative` so the floating scroll button positions against it;
// the scroll element + helpers are shared via context so the button can react to
// (and act on) the same viewport.

interface ConversationContextValue {
  scrollRef: React.RefObject<HTMLDivElement | null>
  scrollToBottom: () => void
  isAtBottom: boolean
}

const ConversationContext = createContext<ConversationContextValue | null>(null)

function useConversation() {
  const ctx = useContext(ConversationContext)
  if (!ctx) {
    throw new Error("Conversation components must be used within <Conversation>")
  }
  return ctx
}

// Distance from the bottom (px) still treated as "at the bottom". A small slack
// absorbs sub-pixel rounding and lets the last line breathe without detaching.
const BOTTOM_THRESHOLD = 32

function Conversation({ className, children, ...props }: ComponentProps<"div">) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)
  // Ref mirror of isAtBottom so the observer callback reads the live value
  // without re-subscribing on every scroll.
  const isAtBottomRef = useRef(true)

  const measure = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight
    const atBottom = distance <= BOTTOM_THRESHOLD
    isAtBottomRef.current = atBottom
    setIsAtBottom(atBottom)
  }, [])

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior })
  }, [])

  // Keep the viewport pinned as content grows — but only when the user hasn't
  // scrolled away. A MutationObserver catches streamed token/message DOM changes
  // that don't fire scroll or resize events on the container itself.
  useEffect(() => {
    if (typeof window === "undefined") return
    const el = scrollRef.current
    if (!el) return

    // Land at the bottom on first mount so a fresh thread opens on the newest turn.
    scrollToBottom("auto")
    measure()

    const stick = () => {
      if (isAtBottomRef.current) scrollToBottom("auto")
    }

    const mutation = new MutationObserver(stick)
    mutation.observe(el, { childList: true, subtree: true, characterData: true })

    // ResizeObserver covers content that reflows without DOM mutations (images
    // loading, wrapping) as well as the viewport itself resizing.
    const resize =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(stick)
        : undefined
    resize?.observe(el)

    return () => {
      mutation.disconnect()
      resize?.disconnect()
    }
  }, [measure, scrollToBottom])

  return (
    <ConversationContext.Provider
      value={{ scrollRef, scrollToBottom: () => scrollToBottom("smooth"), isAtBottom }}
    >
      <div className={cn("relative flex-1 min-h-0", className)} {...props}>
        <div
          ref={scrollRef}
          onScroll={measure}
          role="log"
          aria-live="polite"
          className="h-full overflow-y-auto"
        >
          {children}
        </div>
      </div>
    </ConversationContext.Provider>
  )
}

function ConversationContent({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function ConversationScrollButton({
  className,
  ...props
}: Omit<ComponentProps<typeof Button>, "mode">) {
  const { scrollToBottom, isAtBottom } = useConversation()
  return (
    <Button
      mode="icon"
      size="sm"
      variant="outline"
      tooltip="Scroll to bottom"
      onPress={() => scrollToBottom()}
      // Fade + scale the pill in when detached; keep it mounted (pointer-events
      // off while hidden) so the transition can play in both directions.
      className={cn(
        "bg-panel absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full shadow-md transition-all duration-200",
        isAtBottom
          ? "pointer-events-none scale-90 opacity-0"
          : "scale-100 opacity-100",
        className
      )}
      {...props}
    >
      <ChevronDown />
    </Button>
  )
}

export { Conversation, ConversationContent, ConversationScrollButton }
