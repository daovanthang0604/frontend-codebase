import { describe, expect, it } from "vitest"
import { createActor } from "xstate"

import { countdownMachine } from "../components/Button.machine"

describe("countdownMachine", () => {
  it("starts in Initial state", () => {
    const actor = createActor(countdownMachine, {
      input: { initialCount: 3 },
    })
    actor.start()
    expect(actor.getSnapshot().value).toBe("Initial")
    expect(actor.getSnapshot().context.count).toBe(3)
    actor.stop()
  })

  it("transitions to Counting on START", () => {
    const actor = createActor(countdownMachine, {
      input: { initialCount: 3 },
    })
    actor.start()
    actor.send({ type: "START" })
    expect(actor.getSnapshot().value).toBe("Counting")
    actor.stop()
  })

  it("initializes context from input", () => {
    const actor = createActor(countdownMachine, {
      input: { initialCount: 5 },
    })
    actor.start()
    expect(actor.getSnapshot().context.count).toBe(5)
    expect(actor.getSnapshot().context.initialCount).toBe(5)
    actor.stop()
  })

  it("ignores START when already counting", () => {
    const actor = createActor(countdownMachine, {
      input: { initialCount: 3 },
    })
    actor.start()
    actor.send({ type: "START" })
    expect(actor.getSnapshot().value).toBe("Counting")
    // sending START again should not break anything
    actor.send({ type: "START" })
    expect(actor.getSnapshot().value).toBe("Counting")
    actor.stop()
  })
})
