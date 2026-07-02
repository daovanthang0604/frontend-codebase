"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@workspace/ui/components/Button"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/Dialog"
import { Form } from "@workspace/ui/components/Form"
import { createStore } from "@xstate/store"
import { useSelector } from "@xstate/store/react"
import { RocketIcon, TriangleAlertIcon } from "lucide-react"
import { useForm, type UseFormReturn } from "react-hook-form"
import { z } from "zod"

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
interface ConfirmDialogContext<T extends z.ZodSchema<any, any>> {
  /** Indicates whether the confirm dialog is open */
  isOpen: boolean
  /** Data for the confirm dialog, including title, description, and actions */
  data?: {
    /** Whether to dismiss the dialog when the user clicks outside of it */
    isDismissable?: boolean
    /** The title displayed in the confirm dialog */
    title: string
    /** Optional description displayed in the confirm dialog */
    description?: string
    /** Text for the confirm action button */
    continueText?: string
    /** Text for the cancel action button */
    cancelText?: string
    /** Optional variant for the action button */
    intent?: "primary" | "danger"
    /** Callback function to be called when the confirm action is clicked */
    onContinue?: (values: z.infer<T>) => Promise<void> | void
    /** Callback function to be called when the cancel action is clicked */
    onCancel?: (values: z.infer<T>) => void
    form?: {
      schema?: T
      /** Displays the content of the confirm dialog, wrapped in the context of React Hook Form, allowing you to add any fields using react-hook-form. */
      content?: (
        form: UseFormReturn<z.infer<T>, any, z.infer<T>>
      ) => React.ReactNode
    }
  }
}
const confirmStore = createStore({
  context: {
    isOpen: false,
  } as ConfirmDialogContext<any>,
  on: {
    open: (_, data: ConfirmDialogContext<any>["data"]) => ({
      isOpen: true,
      data,
    }),
    close: (context) => ({ ...context, isOpen: false }),
  },
})
const { open, close } = confirmStore.trigger
function confirm<T extends z.ZodSchema<any, any>>(
  data: ConfirmDialogContext<T>["data"]
) {
  if (!data) return
  open(data)
}
function ConfirmDialog() {
  const [isPending, setIsPending] = useState(false)
  const isOpen = useSelector(confirmStore, (state) => state.context.isOpen)
  const data = useSelector(confirmStore, (state) => state.context.data)
  const intent = data?.intent || "primary"
  const form = useForm({
    defaultValues: data?.form?.schema,
    resolver: data?.form?.schema ? zodResolver(data.form.schema) : undefined,
  })
  const handleClose = () => {
    close()
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
    data?.onContinue?.(values)
    handleClose()
    return
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
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          close()
          setTimeout(() => {
            form.reset()
          }, 200)
        }
      }}
    >
      <DialogContent
        isDismissable={data?.isDismissable ?? false}
        className="md:max-w-[500px]"
        closeButton={false}
      >
        <Form {...form}>
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
        </Form>
      </DialogContent>
    </DialogTrigger>
  )
}
export { confirm, ConfirmDialog }
