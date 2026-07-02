# `services/` — API & data-fetching layer

Each backend domain is a folder of **three files** plus a barrel. Nothing else
goes here (no business logic, no feature constants).

```
services/<name>/
├─ <name>.types.ts    # request / response shapes
├─ <name>.api.ts      # thin, typed axios wrappers (no React)
├─ <name>.queries.ts  # TanStack Query hooks (what components import)
└─ index.ts           # re-exports the three above
```

**`project/` is a complete reference example** — copy the folder, rename it to
your domain, and swap the shapes. It's a CRUD example (list + detail + create +
update + delete) and is wired into the `@/services` barrel.

## The three files

| File              | Responsibility                                                                                                                                                             |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`.types.ts`**   | Interfaces for params and responses. Response bodies mirror the backend envelope `{ message, data, ... }`; list filters use `AgGridFilter` from `@/types/shared.types`.    |
| **`.api.ts`**     | Plain `async` functions over the shared axios instance (`@/services/api`). Each types the response and returns the **unwrapped** payload (`response.data.data`). No React. |
| **`.queries.ts`** | `useQuery` / `useMutation` hooks + a `queryKeys` factory. Components import from here only — caching, keys, and invalidation live in one place.                            |

## Shared pieces (already in this folder)

- **`api.ts`** — the configured `axios` instance. Attaches the bearer token from
  the auth boundary and holds the base URL (`VITE_BASE_API`) + a 401-refresh seam.
- **`api-error.ts`** — `getApiErrorMessage(err)` / `getApiErrorStatus(err)` to read
  the backend's message/status off a raw `AxiosError`.
- **`auth/`** — the (stubbed) auth session. Real requests need a real backend +
  auth wired in; see the repo `README.md`.

## Consuming it

```tsx
import { useCreateProjectMutation, useProjectListQuery } from "@/services"

function Projects() {
  const { data, isLoading } = useProjectListQuery({ status: "active" })
  const create = useCreateProjectMutation()
  // create.mutate({ name: "New project" })
  return (
    <DataTable
      columns={columns}
      data={data?.rows ?? []}
      isLoading={isLoading}
    />
  )
}
```

Because the list endpoint returns `{ rows, total, limit, offset }`, it pairs
directly with `<DataTable>` in server mode — pass `dataSource="server"`,
`rowCount={data?.total}`, and drive `limit`/`offset` from the table's
`onStateChange`.
