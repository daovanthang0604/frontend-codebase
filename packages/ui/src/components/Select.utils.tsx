import { useControllableState } from "@radix-ui/react-use-controllable-state"

interface UseAriaSelectProps {
  /**object or array of objects */
  value: any

  /**function that takes a value and returns void */
  onChange?: (value: any) => void

  /**object or array of objects */
  defaultValue: any

  /**single or multiple */
  selectionMode: "single" | "multiple"
}

// Because React Aria only supports string values, we need to convert the value and onChange to use strings.
// When the user selects a value, we need to convert the string back into an object.

export function useAriaSelectProps({
  value: controlledValue,
  onChange: controlledOnChange,
  defaultValue,
  selectionMode,
}: UseAriaSelectProps): any {
  const [internalValue, internalOnChange] = useControllableState({
    prop: controlledValue,
    defaultProp: defaultValue,
    onChange: controlledOnChange,
  })

  try {
    const getValue = () => {
      if (selectionMode === "single") {
        return internalValue ? JSON.stringify(internalValue) : null
      }

      return internalValue?.map((v: object) => JSON.stringify(v))
    }

    const onChange = (v: any) => {
      if (selectionMode === "single") {
        internalOnChange(v ? JSON.parse(v as string) : null)
      } else {
        internalOnChange(
          (v as string[])
            ?.map((v) => {
              try {
                return JSON.parse(v)
              } catch {
                return null
              }
            })
            .filter(Boolean)
        )
      }
    }

    return { value: getValue(), onChange }
  } catch (error) {
    console.error(error)
    return {}
  }
}
