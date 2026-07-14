"use client"

import "@workspace/liquid-ui/lib/glass"

import { useMemo, type ComponentProps, type ReactNode } from "react"
import {
  Toast as BaseToast,
  type ToastManagerAddOptions,
} from "@base-ui/react/toast"
import { Button } from "@workspace/liquid-ui/components/Button"
import { cn } from "@workspace/liquid-ui/lib/utils"
import {
  AlertCircle,
  CheckCircle2,
  Info,
  X,
  type LucideIcon,
} from "lucide-react"

// Toast for @workspace/liquid-ui, built on Base UI's toast primitives
// (Provider / Portal / Viewport / Root / Title / Description / Close) plus its
// manager (`createToastManager` for a global handle, `useToastManager` for the
// in-viewport list + the `useToast` hook). Base UI has no styling of its own,
// so each toast is a liquid-glass card (glass-overlay); the manager's `type`
// drives the status tint.
//
// Usage:
//   <ToastProvider>{app}</ToastProvider>                    // once, near the root
//   toast.success("Saved", { description: "All changes saved." })   // fire anywhere
//   const toast = useToast(); toast.error("Failed")                 // or via the hook

// A module-level manager so `toast.*` can be fired from anywhere — even outside
// React. ToastProvider feeds this same instance into Base UI's context, so the
// global helper and the `useToast()` hook drive one shared queue.
const manager = BaseToast.createToastManager()

type ToastOptions = Omit<
  ToastManagerAddOptions<Record<string, unknown>>,
  "title"
>

interface ToastApi {
  (title: ReactNode, options?: ToastOptions): string
  success: (title: ReactNode, options?: ToastOptions) => string
  error: (title: ReactNode, options?: ToastOptions) => string
  info: (title: ReactNode, options?: ToastOptions) => string
  /** Dismiss a toast by the id returned when it was created. */
  close: (id: string) => void
}

type AddFn = (
  options: ToastManagerAddOptions<Record<string, unknown>>
) => string

function createApi(add: AddFn, close: (id: string) => void): ToastApi {
  const fire =
    (type?: string) =>
    (title: ReactNode, options?: ToastOptions): string =>
      add({ title, ...options, ...(type ? { type } : null) })
  return Object.assign(fire(), {
    success: fire("success"),
    error: fire("error"),
    info: fire("info"),
    close,
  })
}

/** Global toast helper — call from anywhere once <ToastProvider> is mounted. */
const toast = createApi(manager.add, manager.close)

/** Same ergonomic API bound to the nearest <ToastProvider> via React context. */
function useToast(): ToastApi {
  const { add, close } = BaseToast.useToastManager()
  return useMemo(() => createApi(add, close), [add, close])
}

const iconByType: Record<string, LucideIcon> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

// Left status tint by type — icon colour, plus a tinted border for errors.
const iconColorByType: Record<string, string> = {
  success: "text-green-11",
  error: "text-error-11",
  info: "text-accent-11",
}

const borderByType: Record<string, string> = {
  error: "border-error-9",
}

type ToastItem = ReturnType<typeof BaseToast.useToastManager>["toasts"][number]

function ToastCard({ toast: item }: { toast: ToastItem }) {
  const type = item.type
  const Icon = type ? iconByType[type] : undefined
  return (
    <BaseToast.Root
      toast={item}
      className={cn(
        // Liquid glass surface: glass-overlay swaps in the frosted-glass
        // material (fill + blur + rim + sheen + shadow) in place of the solid
        // bg-panel/border/shadow-lg recipe; radius stays Tailwind's.
        "glass-overlay relative flex gap-3 rounded-lg p-4",
        // Rest transform tracks the swipe drag so swipe-to-dismiss snaps back
        // cleanly; entrance/exit slide in from the right + fade. (Base UI drives
        // the swipe vars; it also sets an inline transform mid-drag that wins.)
        "[transform:translate(var(--toast-swipe-movement-x,0px),var(--toast-swipe-movement-y,0px))]",
        "transition-[transform,opacity] duration-300 ease-out",
        "data-[starting-style]:[transform:translateX(110%)] data-[starting-style]:opacity-0",
        "data-[ending-style]:[transform:translateX(110%)] data-[ending-style]:opacity-0 data-[ending-style]:duration-200",
        type ? borderByType[type] : undefined
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            "mt-0.5 size-4 shrink-0",
            type ? iconColorByType[type] : undefined
          )}
        />
      )}
      <div className="min-w-0 flex-1 pr-5">
        <BaseToast.Title className="text-gray-12 text-sm font-medium" />
        <BaseToast.Description className="text-gray-11 text-sm" />
      </div>
      <BaseToast.Close
        render={
          <Button
            size="sm"
            mode="icon"
            variant="ghost"
            className="absolute top-2 right-2"
          >
            <X className="text-gray-11 size-4!" />
            <span className="sr-only">Close</span>
          </Button>
        }
      />
    </BaseToast.Root>
  )
}

function ToastList() {
  const { toasts } = BaseToast.useToastManager()
  return toasts.map((item) => <ToastCard key={item.id} toast={item} />)
}

type ToastProviderProps = ComponentProps<typeof BaseToast.Provider>

function ToastProvider({
  children,
  toastManager = manager,
  ...props
}: ToastProviderProps) {
  return (
    <BaseToast.Provider toastManager={toastManager} {...props}>
      {children}
      <BaseToast.Portal>
        <BaseToast.Viewport className="fixed top-4 right-4 z-[100] flex w-[380px] max-w-[calc(100vw-2rem)] flex-col gap-2 outline-none">
          <ToastList />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  )
}

export { ToastProvider, toast, useToast }
export type { ToastApi, ToastOptions, ToastProviderProps }
