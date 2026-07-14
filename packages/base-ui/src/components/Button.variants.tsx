import { cva, type VariantProps } from "class-variance-authority"

// Ported from @workspace/ui/components/Button.variants for the Base UI Button.
// Two idioms change vs the react-aria original: the press "settle 1px down" runs
// off native :active (Base UI has no data-pressed), and the loading styles key off
// data-pending which the Button sets itself when isLoading (Base UI has no
// isPending). The unused `unstyled` variant and `isMenuItem` modifier are dropped.
export const buttonVariants = cva(
  [
    "text-gray-12 relative inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md text-sm font-semibold whitespace-nowrap no-underline transition-[transform,background-color,box-shadow] duration-150 select-none",
    /* SVGs */
    "[&_svg]:pointer-events-none [&_svg]:size-[16px] [&_svg]:shrink-0 [&_svg]:stroke-2",
    /* Pressed — WDS press idiom: settle 1px down, no shrink (motion-safe only) */
    "motion-safe:active:transform-[translateY(1px)]",
    /* Disabled */
    "disabled:cursor-not-allowed disabled:opacity-55",
    /* Loading */
    "data-pending:text-transparent data-pending:[&>.spinner]:text-white",
    /* Focus Visible */
    "focus-visible:ring-2 focus-visible:outline-none",
    /* Resets */
    "focus-visible:outline-none",
  ],
  {
    variants: {
      mode: {
        default: "",
        icon: "",
      },
      size: {
        xs: [
          "h-7 gap-1 px-2 text-[12px] [&_svg]:size-[12px]",
          /* Optically align elements */
          "data-[has-left-element=true]:pl-1 data-[has-right-element=true]:pr-1.5",
        ],
        sm: [
          // WDS sm: 12px label, 16px side padding.
          "h-8 px-4 text-[12px]",
          /* Optically align elements */
          "data-[has-left-element=true]:pl-1.5 data-[has-right-element=true]:pr-1.5",
        ],
        md: [
          // WDS md: 13px label, 20px side padding.
          "h-10 px-5 text-[13px]",
          /* Optically align elements */
          "data-[has-left-element=true]:pl-3 data-[has-right-element=true]:pr-3",
        ],
        lg: [
          // WDS lg: 15px label, 24px side padding.
          "h-12 gap-2 px-6 text-[15px]",
          /* Optically align elements */
          "data-[has-left-element=true]:pl-4 data-[has-right-element=true]:pr-4",
        ],
      },
      intent: {
        primary: "ring-accent-7",
        secondary: "ring-gray-7",
        danger: "ring-error-7",
      },
      variant: {
        solid: "",
        outline: "",
        ghost: "",
        minimal: "",
        link: "p-0",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    compoundVariants: [
      /* Primary */
      {
        variant: "solid",
        intent: "primary",
        className: [
          // WDS brand button: flat dark-navy fill via --accent-solid (the dark
          // accent step in light mode, vivid step-9 in dark so white text stays
          // legible), with a subtle navy drop-glow at REST that fills out on hover.
          // White-label-aware; no gradient.
          // Rest + hover use the DS accent drop-glows (effects.css --shadow-accent-sm
          // / --shadow-accent), driven by the navy --accent-solid. Explicit lengths
          // so Tailwind treats the arbitrary value as a box-shadow, not a color.
          "bg-accent-solid text-accent-contrast shadow-[0_8px_18px_-8px_var(--accent-solid)]",
          "hover:not-disabled:brightness-105",
          "hover:not-disabled:shadow-[0_14px_30px_-12px_var(--accent-solid)]",
          "border border-black/5 dark:border-white/10",
        ],
      },
      {
        variant: "outline",
        intent: "primary",
        className: [
          "bg-accent-2 border-accent-7 text-accent-11 hover:not-disabled:bg-accent-3 border",
          "data-pending:[&>.spinner]:text-accent-11",
        ],
      },
      {
        variant: "ghost",
        intent: "primary",
        className: [
          "text-accent-11 hover:not-disabled:bg-accent-3",
          "data-pending:[&>.spinner]:text-accent-11 data-pending:bg-accent-3",
        ],
      },
      {
        variant: "minimal",
        intent: "primary",
        className: [
          "text-accent-11 bg-accent-3 hover:not-disabled:bg-accent-4",
          "data-pending:[&>.spinner]:text-accent-11",
        ],
      },
      {
        variant: "link",
        intent: "primary",
        className: [
          "text-accent-11 h-auto px-0 hover:not-disabled:underline",
          "data-pending:[&>.spinner]:text-accent-11 data-pending:bg-accent-3",
        ],
      },

      /* Secondary */
      {
        variant: "solid",
        intent: "secondary",
        className: [
          "bg-gray-3 border-gray-3 hover:not-disabled:bg-gray-4 hover:not-disabled:border-gray-4 border",
          "data-pending:[&>.spinner]:text-gray-11",
        ],
      },
      {
        variant: "outline",
        intent: "secondary",
        className: [
          "border-gray-7 hover:not-disabled:bg-gray-3 bg-gray-1 border",
          "data-pending:[&>.spinner]:text-gray-11",
        ],
      },
      {
        variant: "ghost",
        intent: "secondary",
        className: [
          "hover:not-disabled:bg-gray-4",
          "data-pending:[&>.spinner]:text-gray-11 data-pending:bg-gray-3",
        ],
      },
      {
        variant: "minimal",
        intent: "secondary",
        className: [
          "bg-gray-3 hover:not-disabled:bg-gray-4",
          "data-pending:[&>.spinner]:text-gray-11",
        ],
      },
      {
        variant: "link",
        intent: "secondary",
        className: [
          "text-gray-11 h-auto px-0 hover:not-disabled:underline",
          "data-pending:[&>.spinner]:text-gray-11 data-pending:bg-gray-3",
        ],
      },

      /* Danger */
      {
        variant: "solid",
        intent: "danger",
        className: [
          "bg-error-9 hover:not-disabled:bg-error-10 text-white",
          "border border-black/5 dark:border-white/10",
        ],
      },
      {
        variant: "outline",
        intent: "danger",
        className: [
          "bg-error-2 text-error-11 border-error-7 hover:not-disabled:bg-error-3 border",
          "data-pending:[&>.spinner]:text-error-11",
        ],
      },
      {
        variant: "ghost",
        intent: "danger",
        className: [
          "text-error-11 hover:not-disabled:bg-error-3",
          "data-pending:[&>.spinner]:text-error-11 data-pending:bg-error-3",
        ],
      },
      {
        variant: "minimal",
        intent: "danger",
        className: [
          "text-error-11 bg-error-3 hover:not-disabled:bg-error-4",
          "data-pending:[&>.spinner]:text-error-11",
        ],
      },
      {
        variant: "link",
        intent: "danger",
        className: [
          "text-error-11 h-auto px-0 hover:not-disabled:underline",
          "data-pending:[&>.spinner]:text-error-11 data-pending:bg-error-3",
        ],
      },

      /* Mode */
      {
        mode: "icon",
        size: "xs",
        className: ["size-7 [&_svg]:size-3"],
      },
      {
        mode: "icon",
        size: "sm",
        className: ["size-8 [&_svg]:size-4"],
      },
      {
        mode: "icon",
        size: "md",
        className: ["size-10 [&_svg]:size-4"],
      },
      {
        mode: "icon",
        size: "lg",
        className: ["size-12 [&_svg]:size-5"],
      },
    ],
    defaultVariants: {
      variant: "solid",
      intent: "primary",
      size: "md",
      mode: "default",
    },
  }
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>
