import type { AgGridFilter } from "@/types/shared.types"

// ─────────────────────────────────────────────────────────────────────────
// REFERENCE EXAMPLE — the "types" file of a service domain.
//
// Every service domain is three files:
//   • <name>.types.ts   — request / response shapes (this file)
//   • <name>.api.ts      — thin axios wrappers around the shared `api` instance
//   • <name>.queries.ts  — the TanStack Query hooks components actually use
//
// Copy this `project/` folder, rename it to your domain, and swap the shapes.
// See src/services/README.md for the full walkthrough.
//
// The backend wraps every response in a `{ message, data, ... }` envelope, so
// the *ResBody types below mirror that: the real payload lives at
// `response.data.data`, and the api layer unwraps it for callers.
// ─────────────────────────────────────────────────────────────────────────

export type ProjectStatus = "active" | "draft" | "archived"

/** Compact row shape returned by the list endpoint (the table view). */
export interface ProjectRow {
  id: number
  name: string
  status: ProjectStatus
  ownerName: string
  taskCount: number
  updatedAt: string | null
}

/** Full record returned by the detail / create / update endpoints. */
export interface ProjectDetail {
  id: number
  name: string
  description: string | null
  status: ProjectStatus
  ownerName: string
  createdAt: string
  updatedAt: string
}

// ── GET /api/projects ──────────────────────────────────────────────────────
export interface ListProjectsParams {
  search?: string
  status?: ProjectStatus
  /** AG-Grid-style column filters; the api layer serializes them to JSON. */
  filters?: AgGridFilter[]
  limit?: number
  offset?: number
}

export interface ListProjectsData {
  rows: ProjectRow[]
  total: number
  limit: number
  offset: number
}

export interface ListProjectsResBody {
  message: string
  data: ListProjectsData
  count: number
}

// ── GET /api/projects/:id ──────────────────────────────────────────────────
export interface GetProjectResBody {
  message: string
  data: ProjectDetail
}

// ── POST /api/projects ─────────────────────────────────────────────────────
export interface CreateProjectParams {
  name: string
  description?: string
  status?: ProjectStatus
}

export interface CreateProjectResBody {
  message: string
  data: ProjectDetail
}

// ── PUT /api/projects/:id ──────────────────────────────────────────────────
// Every field optional — callers send only what changed so unrelated columns
// are never overwritten.
export interface UpdateProjectBody {
  name?: string
  description?: string
  status?: ProjectStatus
}

export interface UpdateProjectResBody {
  message: string
  data: ProjectDetail
}

// ── DELETE /api/projects/:id ───────────────────────────────────────────────
export interface DeleteProjectResBody {
  message: string
  data: { id: number }
}
