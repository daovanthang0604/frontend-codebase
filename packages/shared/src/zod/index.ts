import { capitalize } from "lodash"
import { z } from "zod"

import { toNormalText } from "../utils/text"

declare module "zod" {
  interface ZodType {
    validateFn(): (value: any) => string | boolean
  }
}

z.ZodType.prototype.validateFn = function () {
  return (value: any): string | boolean => {
    const result = this.safeParse(value)
    return result.success || result.error?.format()._errors?.[0] || ""
  }
}

z.config({
  customError: (issue) => {
    const field = issue.path?.at(-1)?.toString() ?? "Field"
    const fieldName = capitalize(toNormalText(field))

    if (issue.code === "too_small") {
      if (issue.origin === "string") {
        if (issue.minimum === 1) {
          return "This field is required"
        }

        return `${fieldName} must contain at least ${issue.minimum} character(s)`
      }

      if (issue.origin === "number") {
        return `${fieldName} must be at least ${issue.minimum}`
      }

      if (issue.origin === "array") {
        if (issue.minimum === 1) {
          return `${fieldName} must contain at least one item`
        }

        return `${fieldName} must contain at least ${issue.minimum} item(s)`
      }
    }

    if (issue.code === "too_big") {
      if (issue.origin === "string") {
        return `${fieldName} must contain at most ${issue.maximum} character(s)`
      }

      if (issue.origin === "number") {
        return `${fieldName} must be at most ${issue.maximum}`
      }

      if (issue.origin === "array") {
        return `${fieldName} must contain at most ${issue.maximum} item(s)`
      }
    }

    if (issue.code === "invalid_type") {
      return "This field is required"
    }

    if (issue.code === "invalid_format") {
      if (issue.format === "email") {
        return "Please enter a valid email address"
      }
    }
  },
})

export { z }
