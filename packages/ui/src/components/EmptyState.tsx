import type { ComponentProps, ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"

interface EmptyStateProps extends Omit<ComponentProps<"div">, "title"> {
  /** Optional icon (e.g. a lucide icon) shown above the title. */
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** Optional call-to-action, typically a <Button>. */
  action?: ReactNode
}

/**
 * Shared empty-state primitive: centered icon + title + description + action.
 * Promotes the per-page ad-hoc empty views into one reusable component so empty
 * coverage stays consistent across the CRM (lists, tables, dialogs). Not tied to
 * the [data-editorial] prototype scope — uses the system gray tokens.
 */
function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex min-h-[240px] flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        className
      )}
      {...props}
    >
      {icon ? (
        <div className="bg-gray-a3 text-gray-11 flex size-12 items-center justify-center rounded-2xl [&_svg]:size-6 [&_svg]:stroke-[1.5px]">
          {icon}
        </div>
      ) : null}
      <div className="space-y-1">
        <h2 className="text-gray-12 text-base font-medium text-balance">
          {title}
        </h2>
        {description ? (
          <p className="text-gray-11 mx-auto max-w-sm text-sm text-pretty">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}

export { EmptyState }
export type { EmptyStateProps }
