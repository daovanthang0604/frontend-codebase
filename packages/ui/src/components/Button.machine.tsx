import { assign, createMachine } from "xstate"

export const countdownMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QGMD2BXAdgFwqg7pgHQCSmAltuQIYA2AxAMoAqAggErMDaADALqJQAB1SxK5VJkEgAHogC0ARgBMADiIB2ACwBWVVoCcqnhoDMGsxoA0IAJ6JzGojoNrl7jTwBsXjaoC+-jZoWLgExADCGDjkmFD0MrDY1NhgRNQAZqkATgAUijyFAJT0ITh4hERRobFQvAJIICJiVJLScggGOkQGGnoGpl08Blq+qjb2CMqKTjOqGq5epvpGy4HB0WGV1TFxCUkpaZk5+YU8JWVbkZu1XIoNwqLibY0dWspEJu+K8zoTiDpFERvr9AkEQJhUBA4NJLhUpI1ms8EaAOvJTCoiKZTEtVKoCtpvF5-gh0V5Pn4VDp1iA4eFSBQqHRpEjWijZAplF4tFicct8V8iSTHM5XMYeNiTPyaXTtjc4iynmz2ogeMLVOTqeDZcQAGKxciwAAWkEVLQk7I6arsAOmYP8QA */
  types: {
    events: {} as { type: "START" },
    context: {} as { count: number; initialCount: number },
    input: {} as { initialCount: number },
  },
  id: "countdown",
  initial: "Initial",
  context: ({ input }) => ({
    count: input.initialCount,
    initialCount: input.initialCount,
  }),
  states: {
    Initial: {
      on: {
        START: {
          target: "Counting",
        },
      },
    },
    Counting: {
      after: {
        1000: [
          {
            guard: ({ context }) => context.count === 1,
            target: "Finished",
          },
          {
            actions: assign(({ context }) => ({
              count: context.count - 1,
            })),
            target: "Counting",
            reenter: true,
          },
        ],
      },
    },
    Finished: {
      always: {
        target: "Initial",
        actions: assign(({ context }) => ({
          count: context.initialCount,
        })),
      },
    },
  },
})
