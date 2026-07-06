import { AlertCircle } from "lucide-react"

interface PageErrorProps {
  title?: string
  message?: string
}

export function PageError({
  title = "Something went wrong",
  message = "An error occurred while loading the data.",
}: PageErrorProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center px-4">
      <div className="bg-error-9/10 mb-3 rounded-lg p-3">
        <AlertCircle className="text-error-11 size-7 stroke-[1.5px]" />
      </div>
      <h4 className="text-gray-12 mb-1 text-lg font-semibold">{title}</h4>
      <p className="text-gray-11 mb-4 max-w-sm text-center text-base">
        {message}
      </p>
    </div>
  )
}
