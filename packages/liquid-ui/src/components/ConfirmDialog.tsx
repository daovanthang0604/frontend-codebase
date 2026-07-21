"use client"

import "@workspace/liquid-ui/lib/glass"

import React, { useState, useSyncExternalStore } from "react"
import { Dialog as BaseDialog } from "@base-ui/react/dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@workspace/liquid-ui/components/Button"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/liquid-ui/components/Dialog"
import { RocketIcon, TriangleAlertIcon } from "lucide-react"
import { FormProvider, useForm, type UseFormReturn } from "react-hook-form"
import { z } from "zod"

// Imperative confirm dialog for @workspace/base-ui — a drop-in for
// @workspace/liquid-ui/ConfirmDialog. Fire `confirm({...})` from anywhere; a single
// mounted <ConfirmDialog/> (near the app root) renders it. Supports an async
// `onContinue` (shows a spinner, closes on resolve, stays open on reject), a
// primary/danger intent, optional outside-click dismissal, and an optional
// inline react-hook-form (schema + render-prop) whose values flow to onContinue.
//
// Two intentional swaps from the ui original: the global store is a minimal
// useSyncExternalStore snapshot (Base UI has no @xstate/store dep), and it
// composes Base UI's Dialog.Root directly (controlled `open`) rather than the
// trigger-splitting <DialogTrigger>, since it opens imperatively — no trigger.

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor

interface ConfirmDialogData<T extends z.ZodSchema<any, any>> {
  /** Whether clicking outside / pressing Esc dismisses the dialog (default false). */
  isDismissable?: boolean
  /** The title displayed in the confirm dialog. */
  title: string
  /** Optional description displayed in the confirm dialog. */
  description?: string
  /** Text for the confirm action button. */
  continueText?: string
  /** Text for the cancel action button. */
  cancelText?: string
  /** Colour intent for the confirm button (and the header icon). */
  intent?: "primary" | "danger"
  /** Called when the user confirms; async keeps the dialog in a pending state. */
  onContinue?: (values: z.infer<T>) => Promise<void> | void
  /** Called when the user cancels (or dismisses). */
  onCancel?: (values: z.infer<T>) => void
  form?: {
    schema?: T
    /** Extra content rendered inside a react-hook-form context — add any fields. */
    content?: (
      form: UseFormReturn<z.infer<T>, any, z.infer<T>>
    ) => React.ReactNode
  }
}

// Module-level snapshot store so `confirm()` fires from anywhere (even outside
// React). `state` is replaced (never mutated) on each change so the snapshot
// identity flips and subscribers re-render.
interface ConfirmState {
  isOpen: boolean
  data?: ConfirmDialogData<any>
}
let state: ConfirmState = { isOpen: false }
const listeners = new Set<() => void>()
function emit() {
  for (const listener of listeners) listener()
}
function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
function getSnapshot() {
  return state
}

function confirm<T extends z.ZodSchema<any, any>>(data: ConfirmDialogData<T>) {
  if (!data) return
  state = { isOpen: true, data }
  emit()
}
function closeConfirm() {
  state = { ...state, isOpen: false }
  emit()
}

function ConfirmDialog() {
  const [isPending, setIsPending] = useState(false)
  const { isOpen, data } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot
  )
  const intent = data?.intent || "primary"
  const form = useForm({
    defaultValues: data?.form?.schema,
    resolver: data?.form?.schema ? zodResolver(data.form.schema) : undefined,
  })
  const handleClose = () => {
    closeConfirm()
    setTimeout(() => {
      form.reset()
      setIsPending(false)
    }, 200)
  }
  const handleCancel = () => {
    data?.onCancel?.(form.getValues())
    handleClose()
  }
  const handleSubmit = form.handleSubmit((values) => {
    if (!data?.onContinue) {
      handleClose()
      return
    }
    if (data.onContinue instanceof AsyncFunction) {
      setIsPending(true)
      const onContinueAsync = data.onContinue as (values: any) => Promise<void>
      onContinueAsync(values)
        .then(() => {
          handleClose()
        })
        .catch(() => {
          setIsPending(false)
        })
      return
    }
    data.onContinue(values)
    handleClose()
  })
  const getIcon = (): React.ReactNode => {
    if (intent === "danger") {
      return (
        <div
          aria-hidden
          className="bg-error-3 flex shrink-0 items-center justify-center rounded-full p-2"
        >
          <TriangleAlertIcon className="text-error-9 size-5" />
        </div>
      )
    }
    return (
      <div
        aria-hidden
        className="bg-accent-3 flex shrink-0 items-center justify-center rounded-full p-2"
      >
        <RocketIcon className="text-accent-9 size-5" />
      </div>
    )
  }
  return (
    <BaseDialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (open) return
        // Base UI requested a close (Esc / backdrop). Honour it only when the
        // dialog is dismissable; otherwise the controlled `open` keeps it up.
        if (data?.isDismissable) handleCancel()
      }}
    >
      <DialogContent closeButton={false} className="md:max-w-[500px]">
        <FormProvider {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center gap-2">
                  {getIcon()}
                  {data?.title || "Confirm"}
                </div>
              </DialogTitle>
              <DialogDescription>
                {data?.description || "Are you sure you want to confirm?"}
              </DialogDescription>
            </DialogHeader>
            {data?.form?.content && data.form.content(form)}
            <DialogFooter>
              <Button
                variant="minimal"
                onClick={handleCancel}
                isDisabled={isPending}
              >
                {data?.cancelText || "Cancel"}
              </Button>
              <Button
                type="submit"
                variant="solid"
                intent={intent}
                isLoading={isPending}
              >
                {data?.continueText || "Continue"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </BaseDialog.Root>
  )
}

export { confirm, ConfirmDialog }
