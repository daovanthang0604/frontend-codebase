import type { ReactNode } from "react"
import { Card } from "@workspace/ui/components/Card"

// Generic "nothing to show here" surface. Deliberately content-agnostic: the
// caller supplies the copy so the component never echoes back an identifier
// the user asked for (the Organization Profile page renders this on a 404 and
// must NOT leak whether the requested org id exists — see
// .plan/organization-profile-page/01-spec.md Slice 3).
export interface NotFoundStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export function NotFoundState({
  title,
  description,
  icon,
  action,
}: NotFoundStateProps) {
  return (
    <Card className="items-center gap-3 py-12 text-center">
      {icon != null && (
        <div aria-hidden className="text-gray-9 [&>svg]:size-8">
          {icon}
        </div>
      )}
      <div className="space-y-1 px-6">
        <h2 className="text-gray-12 text-lg font-semibold">{title}</h2>
        {description != null && (
          <p className="text-gray-11 mx-auto max-w-sm text-sm leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action != null && <div className="mt-1">{action}</div>}
    </Card>
  )
}
