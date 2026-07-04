import { useState, type ComponentType, type ReactNode } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { ThemeModeSwitcher } from "@/components/ThemeModeSwitcher"
import {
  Accordion as BaseUiAccordion,
  AccordionContent as BaseUiAccordionContent,
  AccordionItem as BaseUiAccordionItem,
  AccordionTrigger as BaseUiAccordionTrigger,
} from "@workspace/base-ui/components/Accordion"
import {
  Avatar as BaseUiAvatar,
  AvatarFallback as BaseUiAvatarFallback,
  AvatarImage as BaseUiAvatarImage,
} from "@workspace/base-ui/components/Avatar"
import { Button as BaseUiButton } from "@workspace/base-ui/components/Button"
import { Checkbox as BaseUiCheckbox } from "@workspace/base-ui/components/Checkbox"
import {
  Collapsible as BaseUiCollapsible,
  CollapsibleContent as BaseUiCollapsibleContent,
  CollapsibleTrigger as BaseUiCollapsibleTrigger,
} from "@workspace/base-ui/components/Collapsible"
import {
  DialogClose as BaseUiDialogClose,
  DialogContent as BaseUiDialogContent,
  DialogDescription as BaseUiDialogDescription,
  DialogFooter as BaseUiDialogFooter,
  DialogHeader as BaseUiDialogHeader,
  DialogTitle as BaseUiDialogTitle,
  DialogTrigger as BaseUiDialogTrigger,
} from "@workspace/base-ui/components/Dialog"
import { Label as BaseUiLabel } from "@workspace/base-ui/components/Label"
import {
  Menu as BaseUiMenu,
  MenuItem as BaseUiMenuItem,
  MenuPopover as BaseUiMenuPopover,
  MenuSeparator as BaseUiMenuSeparator,
  MenuTrigger as BaseUiMenuTrigger,
} from "@workspace/base-ui/components/Menu"
import { Meter as BaseUiMeter } from "@workspace/base-ui/components/Meter"
import { NumberInput as BaseUiNumberInput } from "@workspace/base-ui/components/NumberInput"
import {
  Popover as BaseUiPopover,
  PopoverDialog as BaseUiPopoverDialog,
  PopoverTrigger as BaseUiPopoverTrigger,
} from "@workspace/base-ui/components/Popover"
import { Progress as BaseUiProgress } from "@workspace/base-ui/components/Progress"
import { RadioGroup as BaseUiRadioGroup } from "@workspace/base-ui/components/RadioGroup"
import { ScrollArea as BaseUiScrollArea } from "@workspace/base-ui/components/ScrollArea"
import { Separator as BaseUiSeparator } from "@workspace/base-ui/components/Separator"
import {
  SheetContent as BaseUiSheetContent,
  SheetDescription as BaseUiSheetDescription,
  SheetHeader as BaseUiSheetHeader,
  SheetTitle as BaseUiSheetTitle,
  SheetTrigger as BaseUiSheetTrigger,
} from "@workspace/base-ui/components/Sheet"
import { Slider as BaseUiSlider } from "@workspace/base-ui/components/Slider"
import { Switch as BaseUiSwitch } from "@workspace/base-ui/components/Switch"
import {
  Tab as BaseUiTab,
  TabList as BaseUiTabList,
  TabPanel as BaseUiTabPanel,
  Tabs as BaseUiTabs,
} from "@workspace/base-ui/components/Tabs"
import {
  Toggle as BaseUiToggle,
  ToggleGroup as BaseUiToggleGroup,
} from "@workspace/base-ui/components/Toggle"
import {
  Tooltip as BaseUiTooltip,
  TooltipTrigger as BaseUiTooltipTrigger,
} from "@workspace/base-ui/components/Tooltip"
import {
  Accordion as UiAccordion,
  AccordionContent as UiAccordionContent,
  AccordionItem as UiAccordionItem,
  AccordionTrigger as UiAccordionTrigger,
} from "@workspace/ui/components/Accordion"
import {
  Avatar as UiAvatar,
  AvatarFallback as UiAvatarFallback,
  AvatarImage as UiAvatarImage,
} from "@workspace/ui/components/Avatar"
import { Button as UiButton } from "@workspace/ui/components/Button"
import { Checkbox as UiCheckbox } from "@workspace/ui/components/Checkbox"
import {
  Collapsible as UiCollapsible,
  CollapsibleContent as UiCollapsibleContent,
  CollapsibleTrigger as UiCollapsibleTrigger,
} from "@workspace/ui/components/Collapsible"
import {
  DialogContent as UiDialogContent,
  DialogDescription as UiDialogDescription,
  DialogFooter as UiDialogFooter,
  DialogHeader as UiDialogHeader,
  DialogTitle as UiDialogTitle,
  DialogTrigger as UiDialogTrigger,
} from "@workspace/ui/components/Dialog"
import { Label as UiLabel } from "@workspace/ui/components/Label"
import {
  Menu as UiMenu,
  MenuItem as UiMenuItem,
  MenuPopover as UiMenuPopover,
  MenuSeparator as UiMenuSeparator,
  MenuTrigger as UiMenuTrigger,
} from "@workspace/ui/components/Menu"
import { Meter as UiMeter } from "@workspace/ui/components/Meter"
import { NumberInput as UiNumberInput } from "@workspace/ui/components/NumberInput"
import {
  Popover as UiPopover,
  PopoverDialog as UiPopoverDialog,
  PopoverTrigger as UiPopoverTrigger,
} from "@workspace/ui/components/Popover"
import { Progress as UiProgress } from "@workspace/ui/components/Progress"
import { RadioGroup as UiRadioGroup } from "@workspace/ui/components/RadioGroup"
import { ScrollArea as UiScrollArea } from "@workspace/ui/components/ScrollArea"
import { Separator as UiSeparator } from "@workspace/ui/components/Separator"
import {
  SheetContent as UiSheetContent,
  SheetDescription as UiSheetDescription,
  SheetHeader as UiSheetHeader,
  SheetTitle as UiSheetTitle,
  SheetTrigger as UiSheetTrigger,
} from "@workspace/ui/components/Sheet"
import { Slider as UiSlider } from "@workspace/ui/components/Slider"
import { Switch as UiSwitch } from "@workspace/ui/components/Switch"
import {
  Tab as UiTab,
  TabList as UiTabList,
  TabPanel as UiTabPanel,
  Tabs as UiTabs,
} from "@workspace/ui/components/Tabs"
import {
  Toggle as UiToggle,
  ToggleGroup as UiToggleGroup,
} from "@workspace/ui/components/Toggle"
import {
  Tooltip as UiTooltip,
  TooltipTrigger as UiTooltipTrigger,
} from "@workspace/ui/components/Tooltip"

// Dev/QA surface for the Base UI migration — intentionally NOT wrapped in
// <PageShell> and NOT i18n'd, same exemption as /design-system. Each migrated
// component adds a <Compare> section (base-ui left, @workspace/ui right).
function Compare({
  title,
  meta,
  baseui,
  ui,
}: {
  title: string
  meta?: string
  baseui: ReactNode
  ui: ReactNode
}) {
  return (
    <section className="border-gray-a4 border-t py-7">
      <header className="mb-4 flex items-baseline gap-2">
        <h2 className="text-gray-12 text-ui-lg font-semibold">{title}</h2>
        {meta ? <span className="text-gray-10 text-ui-sm">{meta}</span> : null}
      </header>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="text-gray-10 text-eyebrow mb-3 uppercase">base-ui</div>
          <div className="flex flex-wrap items-center gap-3">{baseui}</div>
        </div>
        <div>
          <div className="text-gray-10 text-eyebrow mb-3 uppercase">
            @workspace/ui
          </div>
          <div className="flex flex-wrap items-center gap-3">{ui}</div>
        </div>
      </div>
    </section>
  )
}

type SeparatorLike = ComponentType<{
  orientation?: "horizontal" | "vertical"
  className?: string
}>

function SeparatorDemo({ Separator }: { Separator: SeparatorLike }) {
  return (
    <div className="w-48">
      <div className="text-gray-11 text-ui-sm">Above the line</div>
      <Separator className="my-3" />
      <div className="text-gray-11 text-ui-sm">Below the line</div>
      <div className="text-gray-11 text-ui-sm mt-4 flex h-8 items-center gap-3">
        <span>Left</span>
        <Separator orientation="vertical" />
        <span>Right</span>
      </div>
    </div>
  )
}

type SwitchLike = ComponentType<{
  isSelected?: boolean
  onChange?: (v: boolean) => void
  isDisabled?: boolean
}>

function SwitchDemo({ Switch }: { Switch: SwitchLike }) {
  const [on, setOn] = useState(true)
  return (
    <div className="flex items-center gap-5">
      <Switch isSelected={on} onChange={setOn} />
      <Switch isSelected={false} onChange={() => {}} />
      <Switch isSelected isDisabled />
      <Switch isDisabled />
    </div>
  )
}

type CheckboxLike = ComponentType<{
  isSelected?: boolean
  isIndeterminate?: boolean
  isDisabled?: boolean
  onChange?: (v: boolean) => void
  "aria-label"?: string
}>

function CheckboxDemo({ Checkbox }: { Checkbox: CheckboxLike }) {
  const [on, setOn] = useState(true)
  return (
    <div className="flex items-center gap-5">
      <Checkbox isSelected={on} onChange={setOn} aria-label="checked" />
      <Checkbox isSelected={false} onChange={() => {}} aria-label="unchecked" />
      <Checkbox isIndeterminate aria-label="indeterminate" />
      <Checkbox isSelected isDisabled aria-label="disabled" />
    </div>
  )
}

type SliderLike = ComponentType<{
  value?: number | number[]
  onChange?: (v: number | number[]) => void
  minValue?: number
  maxValue?: number
  label?: ReactNode
  className?: string
}>

function SliderDemo({ Slider }: { Slider: SliderLike }) {
  const [val, setVal] = useState<number | number[]>(40)
  return (
    <div className="w-64">
      <Slider
        value={val}
        onChange={setVal}
        minValue={0}
        maxValue={100}
        label="Volume"
      />
    </div>
  )
}

type LabelLike = ComponentType<{
  withAsterisk?: boolean
  className?: string
  children?: ReactNode
}>

function LabelDemo({ Label }: { Label: LabelLike }) {
  return (
    <div className="flex flex-col gap-3">
      <Label>Field label</Label>
      <Label withAsterisk>Required field</Label>
    </div>
  )
}

type RadioOpt = { value: string; label: string }
type RadioGroupLike = ComponentType<{
  options: RadioOpt[]
  value?: RadioOpt
  onChange?: (o: RadioOpt | undefined) => void
  label?: string
}>

const radioOptions: RadioOpt[] = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push" },
]

function RadioGroupDemo({ RadioGroup }: { RadioGroup: RadioGroupLike }) {
  const [val, setVal] = useState<RadioOpt>(radioOptions[0]!)
  return (
    <RadioGroup
      options={radioOptions}
      value={val}
      onChange={(o) => o && setVal(o)}
      label="Notifications"
    />
  )
}

type TooltipTriggerLike = ComponentType<{
  children: ReactNode
  delay?: number
  closeDelay?: number
}>
type TooltipLike = ComponentType<{
  children: ReactNode
  placement?: "top" | "bottom" | "left" | "right"
}>
type ButtonLike = ComponentType<{ children?: ReactNode }>

function TooltipDemo({
  TooltipTrigger,
  Tooltip,
  Button,
}: {
  TooltipTrigger: TooltipTriggerLike
  Tooltip: TooltipLike
  Button: ButtonLike
}) {
  // One trigger per side to exercise the caret arrow's per-placement rotation.
  return (
    <div className="flex flex-wrap items-center gap-3">
      {(["top", "bottom", "left", "right"] as const).map((side) => (
        <TooltipTrigger key={side}>
          <Button>{side}</Button>
          <Tooltip placement={side}>Tooltip on {side}</Tooltip>
        </TooltipTrigger>
      ))}
    </div>
  )
}

type PopoverTriggerLike = ComponentType<{ children: ReactNode }>
type PopoverLike = ComponentType<{
  children: ReactNode
  placement?: "top" | "bottom" | "left" | "right"
}>
type PopoverDialogLike = ComponentType<{
  children?: ReactNode
  className?: string
}>

function PopoverDemo({
  PopoverTrigger,
  Popover,
  PopoverDialog,
  Button,
}: {
  PopoverTrigger: PopoverTriggerLike
  Popover: PopoverLike
  PopoverDialog: PopoverDialogLike
  Button: ButtonLike
}) {
  return (
    <PopoverTrigger>
      <Button>Open popover</Button>
      <Popover placement="bottom">
        <PopoverDialog className="w-64">
          <div className="text-gray-12 text-sm font-semibold">Dimensions</div>
          <p className="text-gray-11 mt-1 text-sm">
            Set the width and height of the layer. Click outside or press Esc to
            dismiss.
          </p>
        </PopoverDialog>
      </Popover>
    </PopoverTrigger>
  )
}

// Dialog gets per-kit demos (not the shared-component pattern) because the close
// APIs differ: Base UI uses <DialogClose>, react-aria uses a Button slot="close".
function BaseUiDialogDemo() {
  return (
    <BaseUiDialogTrigger>
      <BaseUiButton>Open dialog</BaseUiButton>
      <BaseUiDialogContent>
        <BaseUiDialogHeader>
          <BaseUiDialogTitle>Confirm action</BaseUiDialogTitle>
          <BaseUiDialogDescription>
            This is a sample dialog on a white panel.
          </BaseUiDialogDescription>
        </BaseUiDialogHeader>
        <BaseUiDialogFooter>
          <BaseUiDialogClose
            render={
              <BaseUiButton variant="ghost" intent="secondary">
                Cancel
              </BaseUiButton>
            }
          />
          <BaseUiButton>Confirm</BaseUiButton>
        </BaseUiDialogFooter>
      </BaseUiDialogContent>
    </BaseUiDialogTrigger>
  )
}

function UiDialogDemo() {
  return (
    <UiDialogTrigger>
      <UiButton>Open dialog</UiButton>
      <UiDialogContent>
        <UiDialogHeader>
          <UiDialogTitle>Confirm action</UiDialogTitle>
          <UiDialogDescription>
            This is a sample dialog on a white panel.
          </UiDialogDescription>
        </UiDialogHeader>
        <UiDialogFooter>
          <UiButton variant="ghost" intent="secondary" slot="close">
            Cancel
          </UiButton>
          <UiButton>Confirm</UiButton>
        </UiDialogFooter>
      </UiDialogContent>
    </UiDialogTrigger>
  )
}

function BaseUiSheetDemo() {
  return (
    <BaseUiSheetTrigger>
      <BaseUiButton variant="outline" intent="secondary">
        Open sheet
      </BaseUiButton>
      <BaseUiSheetContent side="right">
        <BaseUiSheetHeader>
          <BaseUiSheetTitle>Side sheet</BaseUiSheetTitle>
          <BaseUiSheetDescription>
            Slides in from the edge. Esc or the scrim dismisses it.
          </BaseUiSheetDescription>
        </BaseUiSheetHeader>
      </BaseUiSheetContent>
    </BaseUiSheetTrigger>
  )
}

function UiSheetDemo() {
  return (
    <UiSheetTrigger>
      <UiButton variant="outline" intent="secondary">
        Open sheet
      </UiButton>
      <UiSheetContent side="right">
        <UiSheetHeader>
          <UiSheetTitle>Side sheet</UiSheetTitle>
          <UiSheetDescription>
            Slides in from the edge. Esc or the scrim dismisses it.
          </UiSheetDescription>
        </UiSheetHeader>
      </UiSheetContent>
    </UiSheetTrigger>
  )
}

function BaseUiMenuDemo() {
  return (
    <BaseUiMenuTrigger>
      <BaseUiButton variant="outline" intent="secondary">
        Actions
      </BaseUiButton>
      <BaseUiMenuPopover>
        <BaseUiMenu>
          <BaseUiMenuItem onAction={() => {}}>Edit</BaseUiMenuItem>
          <BaseUiMenuItem onAction={() => {}}>Duplicate</BaseUiMenuItem>
          <BaseUiMenuSeparator />
          <BaseUiMenuItem onAction={() => {}}>Delete</BaseUiMenuItem>
        </BaseUiMenu>
      </BaseUiMenuPopover>
    </BaseUiMenuTrigger>
  )
}

function UiMenuDemo() {
  return (
    <UiMenuTrigger>
      <UiButton variant="outline" intent="secondary">
        Actions
      </UiButton>
      <UiMenuPopover>
        <UiMenu>
          <UiMenuItem onAction={() => {}}>Edit</UiMenuItem>
          <UiMenuItem onAction={() => {}}>Duplicate</UiMenuItem>
          <UiMenuSeparator />
          <UiMenuItem onAction={() => {}}>Delete</UiMenuItem>
        </UiMenu>
      </UiMenuPopover>
    </UiMenuTrigger>
  )
}

function BaseUiCollapsibleDemo() {
  return (
    <BaseUiCollapsible defaultOpen className="w-full max-w-md">
      <BaseUiCollapsibleTrigger className="text-accent-11 text-sm font-semibold">
        Toggle details
      </BaseUiCollapsibleTrigger>
      <BaseUiCollapsibleContent>
        <p className="text-gray-11 max-w-prose pt-2 text-sm">
          Smoothly revealed content sits here.
        </p>
      </BaseUiCollapsibleContent>
    </BaseUiCollapsible>
  )
}

function UiCollapsibleDemo() {
  return (
    <UiCollapsible defaultOpen className="w-full max-w-md">
      <UiCollapsibleTrigger className="text-accent-11 text-sm font-semibold">
        Toggle details
      </UiCollapsibleTrigger>
      <UiCollapsibleContent>
        <p className="text-gray-11 max-w-prose pt-2 text-sm">
          Smoothly revealed content sits here.
        </p>
      </UiCollapsibleContent>
    </UiCollapsible>
  )
}

function BaseUiAccordionDemo() {
  return (
    <BaseUiAccordion defaultExpandedKeys={["a"]} className="w-full max-w-md">
      <BaseUiAccordionItem id="a">
        <BaseUiAccordionTrigger>What is this?</BaseUiAccordionTrigger>
        <BaseUiAccordionContent>
          A Base UI accordion styled to the kit.
        </BaseUiAccordionContent>
      </BaseUiAccordionItem>
      <BaseUiAccordionItem id="b">
        <BaseUiAccordionTrigger>How does it animate?</BaseUiAccordionTrigger>
        <BaseUiAccordionContent>
          Panels expand with a height transition (--accordion-panel-height).
        </BaseUiAccordionContent>
      </BaseUiAccordionItem>
    </BaseUiAccordion>
  )
}

function UiAccordionDemo() {
  return (
    <UiAccordion defaultExpandedKeys={["a"]} className="w-full max-w-md">
      <UiAccordionItem id="a">
        <UiAccordionTrigger>What is this?</UiAccordionTrigger>
        <UiAccordionContent>
          A react-aria disclosure group styled to the kit.
        </UiAccordionContent>
      </UiAccordionItem>
      <UiAccordionItem id="b">
        <UiAccordionTrigger>How does it animate?</UiAccordionTrigger>
        <UiAccordionContent>
          Panels expand with a CSS grid-rows height transition.
        </UiAccordionContent>
      </UiAccordionItem>
    </UiAccordion>
  )
}

function BaseUiTabsDemo() {
  return (
    <BaseUiTabs defaultSelectedKey="overview" className="w-full max-w-md">
      <BaseUiTabList>
        <BaseUiTab id="overview">Overview</BaseUiTab>
        <BaseUiTab id="activity">Activity</BaseUiTab>
        <BaseUiTab id="settings">Settings</BaseUiTab>
      </BaseUiTabList>
      <BaseUiTabPanel id="overview">Overview panel content.</BaseUiTabPanel>
      <BaseUiTabPanel id="activity">Activity panel content.</BaseUiTabPanel>
      <BaseUiTabPanel id="settings">Settings panel content.</BaseUiTabPanel>
    </BaseUiTabs>
  )
}

function UiTabsDemo() {
  return (
    <UiTabs defaultSelectedKey="overview" className="w-full max-w-md">
      <UiTabList>
        <UiTab id="overview">Overview</UiTab>
        <UiTab id="activity">Activity</UiTab>
        <UiTab id="settings">Settings</UiTab>
      </UiTabList>
      <UiTabPanel id="overview">Overview panel content.</UiTabPanel>
      <UiTabPanel id="activity">Activity panel content.</UiTabPanel>
      <UiTabPanel id="settings">Settings panel content.</UiTabPanel>
    </UiTabs>
  )
}

function BaseUiProgressDemo() {
  return (
    <div className="w-64 space-y-4">
      <BaseUiProgress value={40} label="Uploading" showValue />
      <BaseUiProgress value={78} label="Almost there" showValue />
    </div>
  )
}

function UiProgressDemo() {
  return (
    <div className="w-64 space-y-4">
      <UiProgress value={40} label="Uploading" showValue />
      <UiProgress value={78} label="Almost there" showValue />
    </div>
  )
}

function BaseUiMeterDemo() {
  return (
    <div className="w-64 space-y-4">
      <BaseUiMeter value={45} label="Disk — ok" />
      <BaseUiMeter value={72} label="Disk — warn" />
      <BaseUiMeter value={92} label="Disk — full" />
    </div>
  )
}

function UiMeterDemo() {
  return (
    <div className="w-64 space-y-4">
      <UiMeter value={45} label="Disk — ok" />
      <UiMeter value={72} label="Disk — warn" />
      <UiMeter value={92} label="Disk — full" />
    </div>
  )
}

function BaseUiAvatarDemo() {
  return (
    <div className="flex items-center gap-3">
      <BaseUiAvatar>
        <BaseUiAvatarImage src="https://i.pravatar.cc/64?img=5" alt="User" />
        <BaseUiAvatarFallback>JD</BaseUiAvatarFallback>
      </BaseUiAvatar>
      <BaseUiAvatar>
        <BaseUiAvatarFallback>AB</BaseUiAvatarFallback>
      </BaseUiAvatar>
      <BaseUiAvatar size="sm">
        <BaseUiAvatarFallback>S</BaseUiAvatarFallback>
      </BaseUiAvatar>
      <BaseUiAvatar size="lg">
        <BaseUiAvatarFallback>L</BaseUiAvatarFallback>
      </BaseUiAvatar>
    </div>
  )
}

function UiAvatarDemo() {
  return (
    <div className="flex items-center gap-3">
      <UiAvatar>
        <UiAvatarImage src="https://i.pravatar.cc/64?img=5" alt="User" />
        <UiAvatarFallback>JD</UiAvatarFallback>
      </UiAvatar>
      <UiAvatar>
        <UiAvatarFallback>AB</UiAvatarFallback>
      </UiAvatar>
      <UiAvatar size="sm">
        <UiAvatarFallback>S</UiAvatarFallback>
      </UiAvatar>
      <UiAvatar size="lg">
        <UiAvatarFallback>L</UiAvatarFallback>
      </UiAvatar>
    </div>
  )
}

function BaseUiScrollAreaDemo() {
  return (
    <BaseUiScrollArea className="border-gray-a5 h-40 w-64 rounded-lg border">
      <div className="text-gray-11 space-y-2 p-3 text-sm">
        {Array.from({ length: 18 }).map((_, i) => (
          <p key={i}>Scrollable line {i + 1}</p>
        ))}
      </div>
    </BaseUiScrollArea>
  )
}

function UiScrollAreaDemo() {
  return (
    <UiScrollArea className="border-gray-a5 h-40 w-64 rounded-lg border">
      <div className="text-gray-11 space-y-2 p-3 text-sm">
        {Array.from({ length: 18 }).map((_, i) => (
          <p key={i}>Scrollable line {i + 1}</p>
        ))}
      </div>
    </UiScrollArea>
  )
}

function BaseUiToggleDemo() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <BaseUiToggle aria-label="Bold" defaultSelected className="font-bold">
          B
        </BaseUiToggle>
        <BaseUiToggle aria-label="Italic" className="italic">
          I
        </BaseUiToggle>
      </div>
      <BaseUiToggleGroup selectionMode="single" defaultSelectedKeys={["left"]}>
        <BaseUiToggle id="left">Left</BaseUiToggle>
        <BaseUiToggle id="center">Center</BaseUiToggle>
        <BaseUiToggle id="right">Right</BaseUiToggle>
      </BaseUiToggleGroup>
    </div>
  )
}

function UiToggleDemo() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <UiToggle aria-label="Bold" defaultSelected className="font-bold">
          B
        </UiToggle>
        <UiToggle aria-label="Italic" className="italic">
          I
        </UiToggle>
      </div>
      <UiToggleGroup selectionMode="single" defaultSelectedKeys={["left"]}>
        <UiToggle id="left">Left</UiToggle>
        <UiToggle id="center">Center</UiToggle>
        <UiToggle id="right">Right</UiToggle>
      </UiToggleGroup>
    </div>
  )
}

function BaseUiNumberInputDemo() {
  return (
    <div className="w-48 space-y-3">
      <BaseUiNumberInput
        label="Budget"
        placeholder="0"
        showStepper
        defaultValue={100}
      />
      <BaseUiNumberInput label="Quantity" placeholder="0" />
    </div>
  )
}

function UiNumberInputDemo() {
  return (
    <div className="w-48 space-y-3">
      <UiNumberInput
        label="Budget"
        placeholder="0"
        showStepper
        defaultValue={100}
      />
      <UiNumberInput label="Quantity" placeholder="0" />
    </div>
  )
}

function DesignSystemBaseUiRoute() {
  return (
    <div className="bg-gray-1 min-h-svh">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="text-gray-10 text-eyebrow uppercase">Migration</div>
            <h1 className="text-gray-12 text-display-sm font-semibold">
              Base&nbsp;UI catalog
            </h1>
            <p className="text-gray-11 text-ui-base mt-2 max-w-2xl">
              Each component rebuilt on Base&nbsp;UI (left) beside its
              @workspace/ui counterpart (right) for visual parity. This route
              grows one section per migrated component.
            </p>
          </div>
          <ThemeModeSwitcher />
        </header>

        <Compare
          title="Button"
          meta="facade → ui (Base UI ships no Button; Tier B)"
          baseui={<BaseUiButton>Base&nbsp;UI Button</BaseUiButton>}
          ui={<UiButton>UI Button</UiButton>}
        />

        <Compare
          title="Separator"
          meta="Base UI Separator · data-orientation dimensions"
          baseui={<SeparatorDemo Separator={BaseUiSeparator} />}
          ui={<SeparatorDemo Separator={UiSeparator} />}
        />

        <Compare
          title="Switch"
          meta="Base UI Switch.Root/Thumb · react-aria props mapped · on/off/disabled"
          baseui={<SwitchDemo Switch={BaseUiSwitch} />}
          ui={<SwitchDemo Switch={UiSwitch} />}
        />

        <Compare
          title="Checkbox"
          meta="Base UI Checkbox.Root/Indicator · checked/unchecked/indeterminate/disabled"
          baseui={<CheckboxDemo Checkbox={BaseUiCheckbox} />}
          ui={<CheckboxDemo Checkbox={UiCheckbox} />}
        />

        <Compare
          title="Slider"
          meta="Base UI Slider.Root/Control/Track/Indicator/Thumb · react-aria props mapped"
          baseui={<SliderDemo Slider={BaseUiSlider} />}
          ui={<SliderDemo Slider={UiSlider} />}
        />

        <Compare
          title="RadioGroup"
          meta="Base UI RadioGroup + Radio.Root/Indicator · default variant"
          baseui={<RadioGroupDemo RadioGroup={BaseUiRadioGroup} />}
          ui={<RadioGroupDemo RadioGroup={UiRadioGroup} />}
        />

        <Compare
          title="Label"
          meta="styled native label · withAsterisk (tooltip variant deferred)"
          baseui={<LabelDemo Label={BaseUiLabel} />}
          ui={<LabelDemo Label={UiLabel} />}
        />

        <Compare
          title="Toggle"
          meta="Base UI Toggle + ToggleGroup · two-state button · data-pressed · single-select group"
          baseui={<BaseUiToggleDemo />}
          ui={<UiToggleDemo />}
        />

        <Compare
          title="NumberInput"
          meta="Base UI NumberField Root/Group/Input/Increment/Decrement · stepper + type"
          baseui={<BaseUiNumberInputDemo />}
          ui={<UiNumberInputDemo />}
        />

        <Compare
          title="Tooltip"
          meta="Base UI Portal/Positioner/Popup/Arrow · hover a trigger · 4 placements"
          baseui={
            <TooltipDemo
              TooltipTrigger={BaseUiTooltipTrigger}
              Tooltip={BaseUiTooltip}
              Button={BaseUiButton}
            />
          }
          ui={
            <TooltipDemo
              TooltipTrigger={UiTooltipTrigger}
              Tooltip={UiTooltip}
              Button={UiButton}
            />
          }
        />

        <Compare
          title="Popover"
          meta="Base UI Portal/Positioner/Popup · click to open · Esc / outside-click to dismiss"
          baseui={
            <PopoverDemo
              PopoverTrigger={BaseUiPopoverTrigger}
              Popover={BaseUiPopover}
              PopoverDialog={BaseUiPopoverDialog}
              Button={BaseUiButton}
            />
          }
          ui={
            <PopoverDemo
              PopoverTrigger={UiPopoverTrigger}
              Popover={UiPopover}
              PopoverDialog={UiPopoverDialog}
              Button={UiButton}
            />
          }
        />

        <Compare
          title="Dialog"
          meta="Base UI Root/Backdrop/Popup · modal · focus trap + Esc + scrim-click"
          baseui={<BaseUiDialogDemo />}
          ui={<UiDialogDemo />}
        />

        <Compare
          title="Sheet"
          meta="Base UI dialog anchored to an edge · slides in from the right"
          baseui={<BaseUiSheetDemo />}
          ui={<UiSheetDemo />}
        />

        <Compare
          title="Menu"
          meta="Base UI Root/Trigger/Popup/Item · dropdown · click / arrow-key nav (collection API deferred)"
          baseui={<BaseUiMenuDemo />}
          ui={<UiMenuDemo />}
        />

        <Compare
          title="Collapsible"
          meta="Base UI Root/Trigger/Panel · height transition via --collapsible-panel-height"
          baseui={<BaseUiCollapsibleDemo />}
          ui={<UiCollapsibleDemo />}
        />

        <Compare
          title="Accordion"
          meta="Base UI Root/Item/Header/Trigger/Panel · single-open · chevron rotates · height transition"
          baseui={<BaseUiAccordionDemo />}
          ui={<UiAccordionDemo />}
        />

        <Compare
          title="Tabs"
          meta="Base UI Root/List/Tab/Panel · underline (data-active) · arrow-key nav"
          baseui={<BaseUiTabsDemo />}
          ui={<UiTabsDemo />}
        />

        <Compare
          title="Progress"
          meta="Base UI Root/Track/Indicator/Value/Label · determinate bar (accent-9, see note)"
          baseui={<BaseUiProgressDemo />}
          ui={<UiProgressDemo />}
        />

        <Compare
          title="Meter"
          meta="Base UI Root/Track/Indicator · level tints green→amber→red"
          baseui={<BaseUiMeterDemo />}
          ui={<UiMeterDemo />}
        />

        <Compare
          title="Avatar"
          meta="Base UI Root/Image/Fallback (was Radix) · image with initials fallback · sizes"
          baseui={<BaseUiAvatarDemo />}
          ui={<UiAvatarDemo />}
        />

        <Compare
          title="ScrollArea"
          meta="Base UI Root/Viewport/Scrollbar/Thumb (was Radix) · overlay scrollbar on scroll/hover"
          baseui={<BaseUiScrollAreaDemo />}
          ui={<UiScrollAreaDemo />}
        />
      </div>
    </div>
  )
}

export const Route = createFileRoute("/design-system-baseui")({
  component: DesignSystemBaseUiRoute,
})
