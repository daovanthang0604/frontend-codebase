import { Button } from "@workspace/base-ui/components/Button"
import { AlertCircle, Inbox } from "lucide-react"

import { Spinner } from "../Spinner"

function StatesContainer({ children }: { children: React.ReactNode }) {
  return (
    <tbody>
      <tr className="h-20">
        <td className="absolute inset-0 top-10 flex flex-col items-center pt-20">
          {children}
        </td>
      </tr>
    </tbody>
  )
}

export function DataTableLoading() {
  return (
    <StatesContainer>
      <Spinner className="text-accent-9 mb-4 size-6" />
    </StatesContainer>
  )
}

interface DataTableEmptyProps {
  title?: string
  description?: string
  icon?: React.ReactNode
}

export function DataTableEmpty({
  title = "No results found",
  description = "Try adjusting your search or filter criteria.",
  icon = <Inbox className="size-7 stroke-[1.5px]" />,
}: DataTableEmptyProps) {
  return (
    <StatesContainer>
      <div className="bg-gray-3 mb-3 rounded-lg p-3">{icon}</div>
      <h3 className="mb-1 text-lg font-semibold">{title}</h3>
      <p className="text-gray-11 max-w-sm text-center">{description}</p>
    </StatesContainer>
  )
}

interface DataTableErrorProps {
  message?: string
  onRetry?: () => void
}

export function DataTableError({
  message = "Something went wrong while loading the data.",
  onRetry,
}: DataTableErrorProps) {
  return (
    <StatesContainer>
      <div className="bg-error-9/10 mb-3 rounded-lg p-3">
        <AlertCircle className="text-error-11 size-7 stroke-[1.5px]" />
      </div>
      <h3 className="mb-1 text-lg font-semibold">Error loading data</h3>
      <p className="text-gray-11 mb-4 max-w-sm text-center">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </StatesContainer>
  )
}
