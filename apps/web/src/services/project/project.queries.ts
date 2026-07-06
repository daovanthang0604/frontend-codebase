import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import {
  createProjectApi,
  deleteProjectApi,
  getProjectApi,
  listProjectsApi,
  updateProjectApi,
} from "./project.api"
import type {
  CreateProjectParams,
  ListProjectsData,
  ListProjectsParams,
  ProjectDetail,
  UpdateProjectBody,
} from "./project.types"

// ─────────────────────────────────────────────────────────────────────────
// REFERENCE EXAMPLE — the "queries" file of a service domain.
//
// The React surface: TanStack Query hooks over the api functions. Components
// import ONLY from here (never call the api functions directly), so caching,
// query keys, and invalidation stay in one place. Typical usage:
//
//   const { data, isLoading } = useProjectListQuery({ status: "active" })
//   const create = useCreateProjectMutation()
//   create.mutate({ name: "New project" })
//
// (Requests hit `VITE_BASE_API` with the stub auth token — wire a real backend
// + auth before these resolve. See src/services/README.md.)
// ─────────────────────────────────────────────────────────────────────────

/**
 * Query-key factory. Every key derives from `all`, so a single
 * `invalidateQueries({ queryKey: projectQueryKeys.all })` clears the whole
 * domain. List keys embed their params so different filters cache separately.
 */
export const projectQueryKeys = {
  all: ["project"] as const,
  list: (params: ListProjectsParams) =>
    [...projectQueryKeys.all, "list", params] as const,
  detail: (id: number | null) =>
    [...projectQueryKeys.all, "detail", id] as const,
}

/**
 * GET /api/projects — list/table data. `keepPreviousData` holds the current
 * page on screen while the next page/filter loads (no flash to empty).
 */
export function useProjectListQuery(params: ListProjectsParams = {}) {
  return useQuery<ListProjectsData>({
    queryKey: projectQueryKeys.list(params),
    queryFn: () => listProjectsApi(params),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}

/**
 * GET /api/projects/:id — detail. `enabled` gates the fetch until an id
 * exists, which makes the non-null assertion in the queryFn safe.
 */
export function useProjectQuery(id: number | null) {
  return useQuery<ProjectDetail>({
    queryKey: projectQueryKeys.detail(id),
    queryFn: () => getProjectApi(id!),
    enabled: id != null,
    staleTime: 30 * 1000,
  })
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient()
  return useMutation<ProjectDetail, Error, CreateProjectParams>({
    mutationFn: createProjectApi,
    onSuccess: () => {
      // Refetch every list variant (any filter/pagination) after a create.
      void queryClient.invalidateQueries({
        queryKey: [...projectQueryKeys.all, "list"],
      })
    },
  })
}

export function useUpdateProjectMutation() {
  const queryClient = useQueryClient()
  return useMutation<
    ProjectDetail,
    Error,
    { id: number; body: UpdateProjectBody }
  >({
    mutationFn: ({ id, body }) => updateProjectApi(id, body),
    onSuccess: (updated) => {
      // Prime the detail cache with the server's canonical record, then
      // refetch the lists so the row reflects the change.
      queryClient.setQueryData(projectQueryKeys.detail(updated.id), updated)
      void queryClient.invalidateQueries({
        queryKey: [...projectQueryKeys.all, "list"],
      })
    },
  })
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient()
  return useMutation<{ id: number }, Error, number>({
    mutationFn: deleteProjectApi,
    onSuccess: ({ id }) => {
      queryClient.removeQueries({ queryKey: projectQueryKeys.detail(id) })
      void queryClient.invalidateQueries({
        queryKey: [...projectQueryKeys.all, "list"],
      })
    },
  })
}
