import { Button } from "@workspace/ui/components/Button"
import { Card, CardContent } from "@workspace/ui/components/Card"
import { Link } from "@tanstack/react-router"
import { ArrowLeft, CircleX, SearchX } from "lucide-react"

interface Page404Props {
  title?: string
  message?: string
  backTo?: string
  backLabel?: string
}

export function Page404({
  title = "Page not found",
  message = "The page you are looking for does not exist or may have been moved.",
  backTo = "/",
  backLabel = "Go back home",
}: Page404Props) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="bg-gray-9/10 text-gray-11 rounded-2xl p-4">
          <CircleX className="size-8 stroke-[1.5px]" />
        </div>

        <div className="space-y-0.5">
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-gray-11 mx-auto max-w-md text-sm">{message}</p>
        </div>

        <Button asChild leftIcon={<ArrowLeft className="size-4" />}>
          <Link to={backTo}>{backLabel}</Link>
        </Button>
      </div>
    </div>
  )
}
