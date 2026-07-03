import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

/**
 * Validated environment. `VITE_BASE_API` used to be read straight off
 * `import.meta.env` (typed `string | undefined`), so a missing or blank base URL
 * failed silently at request time. This validates it once at startup and throws
 * a clear error if it is absent or not a URL. Read env through this object,
 * never `import.meta.env`.
 */
export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_BASE_API: z.string().url(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})
