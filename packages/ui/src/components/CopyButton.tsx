import { Button, type IconButtonProps } from "@workspace/ui/components/Button"
import { useMachine } from "@xstate/react"
import { Check, Copy } from "lucide-react"
import { fromPromise, setup } from "xstate"

export const machine = setup({
  types: {
    events: {} as {
      type: "copy"
      text: string
    },
  },
  actors: {
    copy: fromPromise(
      async ({
        input,
      }: {
        input: {
          text: string
        }
      }) => {
        await navigator.clipboard.writeText(input.text)
      }
    ),
  },
}).createMachine({
  id: "Untitled",
  initial: "Initial",
  states: {
    Initial: {
      on: {
        copy: {
          target: "Copying",
        },
      },
    },
    Copying: {
      invoke: {
        src: "copy",
        input: ({ event }) => ({ text: event.text }),
        onDone: {
          target: "Copied",
        },
        onError: {
          target: "Initial",
        },
      },
    },
    Copied: {
      after: {
        "2000": {
          target: "Initial",
        },
      },
    },
  },
})
interface CopyButtonProps extends Omit<IconButtonProps, "mode"> {
  text: string
}
export function CopyButton({
  className,
  text = "test",
  ...props
}: CopyButtonProps) {
  const [state, send] = useMachine(machine)
  return (
    <Button
      mode={"icon"}
      aria-label="Copy"
      className={className}
      tooltip="Copy"
      variant={"ghost"}
      onClick={() => send({ type: "copy", text })}
      {...props}
    >
      {state.matches("Copied") ? (
        <Check className="text-success-9" />
      ) : (
        <Copy className="text-gray-11" />
      )}
    </Button>
  )
}
