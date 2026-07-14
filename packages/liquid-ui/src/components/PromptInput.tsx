"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react"
import { ArrowUp, Square } from "lucide-react"

import { Button } from "@workspace/liquid-ui/components/Button"
import { Spinner } from "@workspace/liquid-ui/components/Spinner"
import { cn } from "@workspace/liquid-ui/lib/utils"

// The chat composer for the AI kit — presentational + SDK-agnostic. A compound
// component: <PromptInput> is the <form> shell; the sub-parts (textarea, toolbar,
// tools, buttons, submit) coordinate through a small context that shares the
// textarea value + a submit fn, so the submit button can gate on emptiness and
// the textarea's Enter key can trigger the same submit path as the form.

interface PromptInputContextValue {
  value: string
  setValue: (value: string) => void
  submit: () => void
}

const PromptInputContext = createContext<PromptInputContextValue | null>(null)

function usePromptInput() {
  const ctx = useContext(PromptInputContext)
  if (!ctx) {
    throw new Error("PromptInput sub-components must be used within <PromptInput>")
  }
  return ctx
}

// Same focus treatment as Input.tsx's fieldGroup — a soft accent-a8 border that
// graduates into the softer accent ring, animated on box-shadow + border-color.
const promptInputContainer = cn(
  "bg-panel border-gray-a7 flex w-full flex-col overflow-hidden rounded-2xl border transition-[box-shadow,border-color] duration-150",
  "focus-within:border-accent-a8 focus-within:ring-ring/30 focus-within:ring-2"
)

interface PromptInputProps
  extends Omit<ComponentProps<"form">, "onSubmit"> {
  onSubmit?: (message: string) => void
}

function PromptInput({
  onSubmit,
  className,
  children,
  ...props
}: PromptInputProps) {
  const [value, setValue] = useState("")

  const submit = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmit?.(trimmed)
    setValue("")
  }, [value, onSubmit])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    submit()
  }

  const ctx = useMemo(
    () => ({ value, setValue, submit }),
    [value, submit]
  )

  return (
    <PromptInputContext.Provider value={ctx}>
      <form
        onSubmit={handleSubmit}
        className={cn(promptInputContainer, className)}
        {...props}
      >
        {children}
      </form>
    </PromptInputContext.Provider>
  )
}

interface PromptInputTextareaProps
  extends Omit<ComponentProps<"textarea">, "value" | "onChange"> {
  placeholder?: string
}

function PromptInputTextarea({
  className,
  placeholder = "Ask anything…",
  ...props
}: PromptInputTextareaProps) {
  const { value, setValue, submit } = usePromptInput()
  const ref = useRef<HTMLTextAreaElement>(null)

  // Prefer native CSS `field-sizing: content` for the auto-grow; fall back to a
  // scrollHeight measure on browsers that don't support it. The 200px cap is kept
  // in both paths (max-h class + Math.min) so the textarea scrolls past it.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof CSS !== "undefined" && CSS.supports?.("field-sizing", "content")) {
      return
    }
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }, [value])

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter submits; Shift+Enter inserts a newline. Skip while an IME is
    // composing so Enter can commit the candidate instead of sending.
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <textarea
      ref={ref}
      rows={1}
      placeholder={placeholder}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={handleKeyDown}
      className={cn(
        "field-sizing-content placeholder:text-gray-8 max-h-[200px] w-full resize-none bg-transparent px-4 pt-3 text-sm outline-none",
        className
      )}
      {...props}
    />
  )
}

function PromptInputToolbar({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center justify-between px-2 pb-2", className)}
      {...props}
    />
  )
}

function PromptInputTools({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  )
}

interface PromptInputButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

function PromptInputButton({ children, className, onClick }: PromptInputButtonProps) {
  return (
    <Button
      size="sm"
      mode="icon"
      variant="ghost"
      intent="secondary"
      type="button"
      onPress={onClick}
      className={className}
    >
      {children}
    </Button>
  )
}

interface PromptInputSubmitProps {
  status?: "ready" | "submitted" | "streaming"
  disabled?: boolean
  className?: string
}

function PromptInputSubmit({
  status = "ready",
  disabled,
  className,
}: PromptInputSubmitProps) {
  const { value } = usePromptInput()

  // While streaming the button reads as a stop control, so it stays enabled even
  // with an empty textarea; only the "ready" state gates on having text to send.
  const isDisabled = disabled || (status === "ready" && value.trim().length === 0)

  const icon =
    status === "streaming" ? (
      <Square />
    ) : status === "submitted" ? (
      <Spinner />
    ) : (
      <ArrowUp />
    )

  return (
    <Button
      size="sm"
      mode="icon"
      type="submit"
      isDisabled={isDisabled}
      className={className}
    >
      {icon}
    </Button>
  )
}

export {
  PromptInput,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  PromptInputButton,
  PromptInputSubmit,
}
export type {
  PromptInputProps,
  PromptInputTextareaProps,
  PromptInputButtonProps,
  PromptInputSubmitProps,
}
