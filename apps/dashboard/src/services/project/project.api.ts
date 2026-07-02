import { api } from "@/services/api"

import type {
  CreateProjectParams,
  CreateProjectResBody,
  DeleteProjectResBody,
  GetProjectResBody,
  ListProjectsData,
  ListProjectsParams,
  ListProjectsResBody,
  ProjectDetail,
  UpdateProjectBody,
  UpdateProjectResBody,
} from "./project.types"

// ─────────────────────────────────────────────────────────────────────────
// REFERENCE EXAMPLE — the "api" file of a service domain.
//
// Plain async functions (NO React) that wrap the shared axios instance
// (`@/services/api`). Each one types the response envelope and returns the
// unwrapped payload (`response.data.data`), so callers never touch the
// `{ message, data }` wrapper. Auth headers + the base URL are handled by the
// shared instance; the hooks in `project.queries.ts` call these functions.
// ─────────────────────────────────────────────────────────────────────────

export async function listProjectsApi(
  params: ListProjectsParams = {}
): Promise<ListProjectsData> {
  const { filters, ...rest } = params
  const response = await api.get<ListProjectsResBody>("/api/projects", {
    params: {
      ...rest,
      ...(filters && filters.length > 0
        ? { filters: JSON.stringify(filters) }
        : {}),
    },
  })
  return response.data.data
}

export async function getProjectApi(id: number): Promise<ProjectDetail> {
  const response = await api.get<GetProjectResBody>(`/api/projects/${id}`)
  return response.data.data
}

export async function createProjectApi(
  params: CreateProjectParams
): Promise<ProjectDetail> {
  const response = await api.post<CreateProjectResBody>("/api/projects", params)
  return response.data.data
}

export async function updateProjectApi(
  id: number,
  body: UpdateProjectBody
): Promise<ProjectDetail> {
  const response = await api.put<UpdateProjectResBody>(
    `/api/projects/${id}`,
    body
  )
  return response.data.data
}

export async function deleteProjectApi(id: number): Promise<{ id: number }> {
  const response = await api.delete<DeleteProjectResBody>(`/api/projects/${id}`)
  return response.data.data
}
