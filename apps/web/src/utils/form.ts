import { toast } from "@workspace/base-ui/components/Toast"
import { capitalize } from "lodash"
import type { UseFormReturn } from "react-hook-form"

export function showSubmitErrors(
  form: UseFormReturn<any>,
  error: any,
  options?: {
    toastTitle?: string
  }
) {
  try {
    const details = error.response?.data?.details
    const detailsEntries = details ? Object.values(details) : []
    const firstDetailMessage =
      detailsEntries[0] && capitalize(String(detailsEntries[0]))
    const message = firstDetailMessage || error.response?.data?.message
    if (message) {
      toast.error(options?.toastTitle || "Error", {
        description: message,
      })
    }
  } catch (error) {
    console.error(error)
  }
}
