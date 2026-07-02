import { cn } from "@workspace/ui/lib/utils"

export function PageSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto min-h-[80vh] w-full max-w-7xl animate-pulse p-5",
        className
      )}
    >
      <div className="mb-7">
        <div className="bg-gray-11/10 mb-1.5 h-8 w-1/2 max-w-70 rounded" />
        {/* <div className="bg-gray-11/10 mb-8 h-5 w-1/3 max-w-60 rounded"></div> */}
      </div>
      <div className="bg-gray-11/10 mb-5 h-7 w-8/12 rounded" />
      <div className="mb-6 space-y-2">
        <div className="bg-gray-11/10 h-7 w-10/12 rounded" />
        <div className="bg-gray-11/10 h-7 w-11/12 rounded" />
        <div className="bg-gray-11/10 h-7 w-9/12 rounded" />
      </div>
      <div className="mb-6 space-y-2">
        <div className="bg-gray-11/10 h-7 w-11/12 rounded" />
        <div className="bg-gray-11/10 h-7 w-8/12 rounded" />
      </div>
    </div>
  )
}
