import { cn } from "@workspace/liquid-ui/lib/utils"

// Assistant "typing…" indicator for the AI kit: three dots bouncing in a
// staggered wave. Purely presentational. The global prefers-reduced-motion
// reset in the theme neutralizes animate-bounce, so no motion guard is needed here.
function Loader({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      role="status"
      aria-label="Assistant is typing"
    >
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="bg-gray-9 size-1.5 animate-bounce rounded-full"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  )
}

export { Loader }
