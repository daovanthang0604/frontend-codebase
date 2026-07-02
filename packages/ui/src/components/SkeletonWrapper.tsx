import { cn } from "../lib/utils"

export function SkeletonWrapper({
  children,
  isLoading,
  className,
}: {
  children: React.ReactNode
  isLoading: boolean
  className?: string
}) {
  return (
    <div className={cn("relative", isLoading && "*:text-transparent")}>
      {children}
      {isLoading && (
        <div
          className={cn(
            "bg-gray-11/10 absolute inset-x-0 inset-y-0.5 animate-pulse rounded-md",
            className
          )}
        />
      )}
    </div>
  )
}
