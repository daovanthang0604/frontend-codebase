import { confirm } from "@workspace/base-ui/components/ConfirmDialog"
import { useBlocker } from "@tanstack/react-router"

export function useFormBlocker({ isDirty }: { isDirty: boolean }) {
  return useBlocker({
    shouldBlockFn: () => {
      if (!isDirty) return false

      return new Promise((resolve) => {
        confirm({
          title: "Do you want to leave?",
          description: "Changes you made will not be saved.",
          continueText: "Leave",
          intent: "primary",
          onContinue: async () => {
            resolve(false)
          },
          onCancel: () => {
            resolve(true)
          },
        })
      })
    },
    enableBeforeUnload: isDirty,
  })
}
