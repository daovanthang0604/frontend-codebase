import { describe, expectTypeOf, it } from "vitest"

import { projectQueryKeys, useProjectListQuery } from "./project.queries"
import type {
  ListProjectsData,
  ListProjectsResBody,
  ProjectRow,
} from "./project.types"

// Type tests (run by `vitest --typecheck`). They pin the services-layer
// contract described in AGENTS.md: the api layer returns the *unwrapped* payload
// (`response.data.data`), so hooks and callers never see the `{ message, data,
// count }` envelope. A regression that leaked the envelope would fail here.
describe("project service types", () => {
  it("the response envelope wraps the unwrapped payload", () => {
    expectTypeOf<ListProjectsResBody["data"]>().toEqualTypeOf<ListProjectsData>()
    expectTypeOf<ListProjectsResBody>().toHaveProperty("message").toBeString()
    expectTypeOf<ListProjectsResBody>().toHaveProperty("count").toBeNumber()
  })

  it("the unwrapped payload is not the envelope", () => {
    expectTypeOf<ListProjectsData>()
      .toHaveProperty("rows")
      .toEqualTypeOf<ProjectRow[]>()
    expectTypeOf<ListProjectsData>().not.toHaveProperty("message")
    expectTypeOf<ListProjectsData>().not.toHaveProperty("count")
  })

  it("useProjectListQuery yields the unwrapped payload, not the envelope", () => {
    expectTypeOf<
      ReturnType<typeof useProjectListQuery>["data"]
    >().toEqualTypeOf<ListProjectsData | undefined>()
  })

  it("query keys derive from a single readonly 'all' tuple", () => {
    expectTypeOf(projectQueryKeys.all).toEqualTypeOf<readonly ["project"]>()
  })
})
