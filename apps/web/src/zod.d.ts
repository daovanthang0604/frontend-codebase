declare module "zod" {
  interface GlobalMeta {
    // add new fields here
    permissions?: unknown[]
  }
}

// forces TypeScript to consider the file a module
export {}
