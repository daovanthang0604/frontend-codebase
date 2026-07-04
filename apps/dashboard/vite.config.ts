import { fileURLToPath, URL } from "node:url"

import { devtools } from "@tanstack/devtools-vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    devtools({
      eventBusConfig: {
        // Env-overridable so multiple instances of this template (or another
        // TanStack devtools app) can run side by side without an EADDRINUSE
        // clash on the devtools event-bus port.
        port: Number(process.env.VITE_DEVTOOLS_BUS_PORT) || 42071,
      },
    }),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    // React Compiler (v1.0) — build-time auto-memoization. Pinned exact because
    // memoization output can shift across versions. NOTE: it does NOT auto-skip
    // incompatible components — TanStack Table's stable-ref/mutable-state pattern
    // breaks it, so the DataTable render fns opt out via "use no memo".
    viteReact({ babel: { plugins: ["babel-plugin-react-compiler"] } }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
