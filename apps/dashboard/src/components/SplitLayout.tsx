import { BarChart3 } from "lucide-react"

export function SplitLayout({
  children,
}: {
  children: React.ReactNode
  imageSrc?: string
}) {
  return (
    <div className="bg-gray-2 grid min-h-svh grid-cols-1 lg:grid-cols-2">
      <div className="relative flex min-h-svh items-center justify-center px-4 py-16 sm:px-8">
        <div className="w-full max-w-[430px]">{children}</div>
      </div>

      <div className="relative hidden overflow-hidden lg:block">
        {/* Gradient background */}
        <div className="from-accent-9 via-accent-10 to-accent-11 absolute inset-0 bg-gradient-to-br" />

        {/* Disabled under prefers-reduced-motion. */}
        <div
          aria-hidden
          className="aurora-sweep absolute top-1/2 left-1/2 size-[180%] -translate-x-1/2 -translate-y-1/2 motion-safe:animate-[spin_60s_linear_infinite]"
        />

        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-white/15 blur-sm" />
        <div className="absolute -bottom-32 -left-32 size-[500px] rounded-full bg-white/8" />
        <div className="absolute top-1/3 left-1/4 size-64 rounded-full bg-white/8 blur-sm" />

        <div className="aurora-split-grid absolute inset-0 opacity-[0.05]" />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-12">
          <div className="flex flex-col items-center gap-6 text-center text-white">
            <div className="flex size-16 items-center justify-center rounded-2xl border border-white/20 bg-white/20 backdrop-blur-md">
              <BarChart3 className="size-8" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tight">
                Workspace CRM
              </h2>
              <p className="max-w-sm text-lg leading-relaxed text-white/80">
                Manage your customer relationships, track insights, and grow
                your business — all in one place.
              </p>
            </div>

            {/* Feature pills */}
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {["Analytics", "Contacts", "Automation", "Insights"].map(
                (feature) => (
                  <span
                    key={feature}
                    className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm"
                  >
                    {feature}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
