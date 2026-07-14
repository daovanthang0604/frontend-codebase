import { useState, type ReactNode } from "react"
import { createFileRoute } from "@tanstack/react-router"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/liquid-ui/components/Accordion"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/liquid-ui/components/Alert"
import { Avatar, AvatarFallback } from "@workspace/liquid-ui/components/Avatar"
import { Badge } from "@workspace/liquid-ui/components/Badge"
import { Button, GlassButton } from "@workspace/liquid-ui/components/Button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/liquid-ui/components/Card"
import { Checkbox } from "@workspace/liquid-ui/components/Checkbox"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@workspace/liquid-ui/components/Command"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/liquid-ui/components/Dialog"
import { GlassPanel } from "@workspace/liquid-ui/components/GlassPanel"
import {
  Input,
  PasswordInput,
  SearchInput,
  TextArea,
} from "@workspace/liquid-ui/components/Input"
import { Kbd } from "@workspace/liquid-ui/components/Kbd"
import {
  Menu,
  MenuItem,
  MenuPopover,
  MenuSeparator,
  MenuTrigger,
} from "@workspace/liquid-ui/components/Menu"
import { NumberInput } from "@workspace/liquid-ui/components/NumberInput"
import {
  Popover,
  PopoverDialog,
  PopoverTrigger,
} from "@workspace/liquid-ui/components/Popover"
import {
  PreviewCard,
  PreviewCardArrow,
  PreviewCardContent,
  PreviewCardTrigger,
} from "@workspace/liquid-ui/components/PreviewCard"
import { Progress } from "@workspace/liquid-ui/components/Progress"
import { RadioGroup } from "@workspace/liquid-ui/components/RadioGroup"
import { SegmentedControl } from "@workspace/liquid-ui/components/SegmentedControl"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@workspace/liquid-ui/components/Select"
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/liquid-ui/components/Sheet"
import { Slider } from "@workspace/liquid-ui/components/Slider"
import { Switch } from "@workspace/liquid-ui/components/Switch"
import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@workspace/liquid-ui/components/Tabs"
import { toast, ToastProvider } from "@workspace/liquid-ui/components/Toast"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/liquid-ui/components/ToggleGroup"
import {
  Tooltip,
  TooltipTrigger,
} from "@workspace/liquid-ui/components/Tooltip"
import { Info, TriangleAlert } from "lucide-react"

import { ThemeModeSwitcher } from "@/components/ThemeModeSwitcher"

// Dev/QA surface for the @workspace/liquid-ui glass kit — the parallel to
// /design-system-baseui. Intentionally NOT wrapped in <PageShell> and NOT i18n'd
// (same exemption as the other catalog routes). The whole page is scoped to
// [data-theme="liquid"] over the .liquid-aurora sky. App light/dark mode
// (next-themes' .dark class) drives the compound theme selectors, so toggle the
// mode switch to verify BOTH modes on this one route. Sections grow one per
// component group as the kit lands (Phase 0 ships the GlassPanel surface).

function LiquidSection({
  title,
  meta,
  children,
}: {
  title: string
  meta?: string
  children: ReactNode
}) {
  return (
    <section className="border-gray-a5 border-t py-7">
      <header className="mb-4 flex flex-col gap-1">
        <h2 className="text-gray-12 text-ui-lg font-semibold">{title}</h2>
        {meta ? <span className="text-gray-11 text-ui-sm">{meta}</span> : null}
      </header>
      {children}
    </section>
  )
}

const radioOptions = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push" },
]

// Phase 1 proof: the M2 re-skin. Every control below is imported from
// @workspace/liquid-ui but is base-ui's component re-exported unchanged. Under
// [data-theme="liquid"] the theme repoints --accent-*/--gray-*, so they render
// cyan-on-slate with zero per-component code. They sit ON a GlassPanel to show
// controls stay solid and legible over glass (glass material would hurt inputs).
function ThemedControlsSection() {
  const [search, setSearch] = useState("")
  const [subscribed, setSubscribed] = useState(true)
  const [notify, setNotify] = useState(false)
  const [volume, setVolume] = useState<number | number[]>(40)
  const [channel, setChannel] = useState(radioOptions[0])

  return (
    <LiquidSection
      title="Themed controls"
      meta="re-exported from base-ui unchanged; the liquid theme re-skins them (cyan accent, cool slate) with zero per-component code. Kept solid on purpose; glass hurts legibility on inputs."
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <GlassPanel elevation="float" className="space-y-4 p-5">
          <div className="text-gray-12 text-ui-sm font-medium">Text fields</div>
          <Input label="Email" placeholder="you@example.com" />
          <PasswordInput label="Password" placeholder="••••••••" />
          <TextArea label="Notes" placeholder="Write something…" />
          <SearchInput
            placeholder="Search…"
            value={search}
            onChange={setSearch}
          />
          <NumberInput
            label="Budget"
            placeholder="0"
            showStepper
            defaultValue={100}
          />
        </GlassPanel>

        <GlassPanel elevation="float" className="space-y-5 p-5">
          <div className="text-gray-12 text-ui-sm font-medium">
            Selection and feedback
          </div>
          <div className="flex items-center gap-6">
            <Checkbox
              isSelected={subscribed}
              onChange={setSubscribed}
              aria-label="Subscribe"
            />
            <Checkbox isIndeterminate aria-label="Indeterminate" />
            <Checkbox isSelected isDisabled aria-label="Disabled" />
            <Switch isSelected={notify} onChange={setNotify} />
          </div>
          <Slider
            value={volume}
            onChange={setVolume}
            minValue={0}
            maxValue={100}
            label="Volume"
          />
          <RadioGroup
            options={radioOptions}
            value={channel}
            onChange={(o) => o && setChannel(o)}
            label="Notifications"
          />
          <Progress value={40} label="Uploading" showValue />
        </GlassPanel>
      </div>

      <div className="mt-5">
        <Tabs defaultSelectedKey="overview" className="w-full">
          <TabList>
            <Tab id="overview">Overview</Tab>
            <Tab id="activity">Activity</Tab>
            <Tab id="settings">Settings</Tab>
          </TabList>
          <TabPanel id="overview">
            <p className="text-gray-11 text-ui-sm pt-3">
              Tabs re-exported from base-ui, re-skinned by the liquid theme.
            </p>
          </TabPanel>
          <TabPanel id="activity">
            <p className="text-gray-11 text-ui-sm pt-3">
              The active indicator picks up the cyan accent under the scope.
            </p>
          </TabPanel>
          <TabPanel id="settings">
            <p className="text-gray-11 text-ui-sm pt-3">
              No per-component code; the token re-point does the work.
            </p>
          </TabPanel>
        </Tabs>
      </div>
    </LiquidSection>
  )
}

// Phase 2.1: glass floating surfaces. Popover / Tooltip / PreviewCard rebuilt on
// the same Base UI primitives base-ui uses, but their surface is `glass-overlay`
// (frosted fill + rim + sheen) instead of the solid bg-panel recipe. These portal
// to document.body; glass-overlay reads light-dark() defaults so they stay frosted
// even outside the [data-theme="liquid"] scope. Triggers are base-ui Buttons
// (liquid Button lands in Phase 3).
function FloatingSurfacesSection() {
  return (
    <LiquidSection
      title="Floating surfaces"
      meta="Popover, Tooltip, and PreviewCard on the glass-overlay surface. Open each to check legibility and focus rings over the aurora; the caret arrows are translucent glass edges."
    >
      <div className="flex flex-wrap items-center gap-4">
        <PopoverTrigger>
          <Button>Open popover</Button>
          <Popover placement="bottom start">
            <PopoverDialog className="w-72">
              <div className="text-gray-12 text-ui-base font-medium">
                Fare alert
              </div>
              <p className="text-gray-11 text-ui-sm mt-1">
                We will watch this route and notify you when the price drops
                below your target.
              </p>
            </PopoverDialog>
          </Popover>
        </PopoverTrigger>

        <TooltipTrigger>
          <Button>Hover for a tooltip</Button>
          <Tooltip placement="top">Frosted glass, translucent caret</Tooltip>
        </TooltipTrigger>

        <PreviewCard>
          <PreviewCardTrigger>
            <a
              href="#"
              className="text-accent-11 text-ui-base underline decoration-dotted underline-offset-4"
            >
              @skyway
            </a>
          </PreviewCardTrigger>
          <PreviewCardContent placement="bottom start">
            <div className="flex items-center gap-3">
              <div className="bg-accent-9 text-gray-1 grid size-10 place-items-center rounded-full text-sm font-semibold">
                SW
              </div>
              <div>
                <div className="text-gray-12 text-ui-base font-medium">
                  Skyway Air
                </div>
                <div className="text-gray-11 text-ui-sm">
                  On time on 9 of the last 10 flights
                </div>
              </div>
            </div>
            <PreviewCardArrow />
          </PreviewCardContent>
        </PreviewCard>
      </div>
    </LiquidSection>
  )
}

// Phase 2.2-2.5: glass dropdowns, menus, and modals. Each is base-ui's component
// rebuilt with the glass-overlay surface (and glass-scrim backdrop for modals). The
// risk areas verified here: dense-list legibility over glass (Select, Command, Menu)
// and the modal/drawer scrim (Dialog, Sheet). Triggers are base-ui Buttons.
function OverlaysSection() {
  const [cabin, setCabin] = useState<string | null>("economy")
  const [cmdOpen, setCmdOpen] = useState(false)

  return (
    <LiquidSection
      title="Overlays"
      meta="Dropdowns, menus, and modals on glass. List rows stay legible via the semi-opaque plate under the frost; modals dim the page with a glass-scrim backdrop."
    >
      <div className="flex flex-wrap items-center gap-4">
        <div className="w-56">
          <Select value={cabin} onValueChange={setCabin}>
            <SelectTrigger placeholder="Cabin class" />
            <SelectContent>
              <SelectItem value="economy">Economy</SelectItem>
              <SelectItem value="premium">Premium Economy</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="first">First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <MenuTrigger>
          <Button>Trip actions</Button>
          <MenuPopover className="min-w-52">
            <Menu>
              <MenuItem>Share itinerary</MenuItem>
              <MenuItem>Add to calendar</MenuItem>
              <MenuSeparator />
              <MenuItem className="text-error-11">Cancel trip</MenuItem>
            </Menu>
          </MenuPopover>
        </MenuTrigger>

        <Button onClick={() => setCmdOpen(true)}>Command palette</Button>
        <CommandDialog open={cmdOpen} onOpenChange={setCmdOpen}>
          <CommandInput placeholder="Search actions..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Trips">
              <CommandItem value="new-trip" onSelect={() => setCmdOpen(false)}>
                New trip
                <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>
              <CommandItem
                value="find-flights"
                onSelect={() => setCmdOpen(false)}
              >
                Find flights
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>

        <DialogTrigger>
          <Button>Edit traveler</Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit traveler</DialogTitle>
              <DialogDescription>
                Update the passenger details for this booking.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </DialogTrigger>

        <SheetTrigger>
          <Button>Open filters</Button>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Filter flights</SheetTitle>
              <SheetDescription>
                Slides in on a glass panel; the glass-scrim dims the page behind
                it.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </SheetTrigger>

        <ToastProvider>
          <Button
            onClick={() =>
              toast.success("Fare locked", {
                description: "We held this price for 24 hours.",
              })
            }
          >
            Show toast
          </Button>
        </ToastProvider>
      </div>
    </LiquidSection>
  )
}

// Phase 3.1: glass surfaces. Card renders on GlassPanel (variant maps to tint /
// elevation, with a `solid` fallback); Accordion items and Alerts are frosted.
function GlassSurfacesSection() {
  return (
    <LiquidSection
      title="Surfaces"
      meta="Card is GlassPanel-backed (variant maps to tint/elevation; `solid` opts out of glass). Accordion items and Alerts are frosted; Alert keeps its severity via icon + accent bar."
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Boarding pass</CardTitle>
            <CardDescription>Gate B12, boards 14:05</CardDescription>
          </CardHeader>
          <CardContent className="text-gray-11 text-ui-sm">
            Frosted glass card, the default surface.
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Elevated</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-11 text-ui-sm">
            Lifted hero glass for a focal card.
          </CardContent>
        </Card>
        <Card variant="solid">
          <CardHeader>
            <CardTitle>Solid</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-11 text-ui-sm">
            The non-glass fallback, for dense or busy contexts.
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <Accordion defaultExpandedKeys={["baggage"]}>
          <AccordionItem id="baggage">
            <AccordionTrigger>Baggage allowance</AccordionTrigger>
            <AccordionContent>
              1 carry-on and 1 checked bag up to 23 kg.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="changes">
            <AccordionTrigger>Changes and refunds</AccordionTrigger>
            <AccordionContent>
              Free changes up to 24 hours before departure.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="space-y-3">
          <Alert variant="info" icon={<Info />}>
            <AlertTitle>Gate change</AlertTitle>
            <AlertDescription>
              Your flight now departs from gate B12.
            </AlertDescription>
          </Alert>
          <Alert variant="warning" icon={<TriangleAlert />}>
            <AlertTitle>Weather delay</AlertTitle>
            <AlertDescription>
              Departure may be delayed by about 30 minutes.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </LiquidSection>
  )
}

// Phase 3.2: glass accents. A frosted GlassButton, a glass Badge chip, the glass
// SegmentedControl (its own sliding thumb), a glass ToggleGroup rail, plus a light
// glass Avatar ring and frosted Kbd caps.
function GlassAccentsSection() {
  const [tripType, setTripType] = useState("round-trip")

  return (
    <LiquidSection
      title="Accents"
      meta="Small glass touches: a frosted action, chip, segmented switch, toggle rail, avatar ring, and keycaps. Kept subtle so the accent reads without glass-on-everything noise."
    >
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="solid" intent="primary">
          Book now
        </Button>
        <GlassButton intent="primary">Hold this fare</GlassButton>
        <Badge color="success" dot>
          On time
        </Badge>
        <Badge color="glass">Nonstop</Badge>
        <Avatar>
          <AvatarFallback>SW</AvatarFallback>
        </Avatar>
        <div className="text-gray-11 flex items-center gap-1">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-6">
        <SegmentedControl
          value={tripType}
          onChange={setTripType}
          options={[
            { value: "round-trip", label: "Round trip" },
            { value: "one-way", label: "One way" },
            { value: "multi-city", label: "Multi-city" },
          ]}
        />
        <ToggleGroup defaultValue={["nonstop"]} aria-label="Flight filters">
          <ToggleGroupItem value="nonstop">Nonstop</ToggleGroupItem>
          <ToggleGroupItem value="wifi">Wi-Fi</ToggleGroupItem>
          <ToggleGroupItem value="power">Power</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </LiquidSection>
  )
}

function DesignSystemLiquidRoute() {
  return (
    <div data-theme="liquid" className="liquid-aurora text-gray-12 min-h-svh">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="text-gray-11 text-eyebrow uppercase">
              Liquid glass
            </div>
            <h1 className="text-gray-12 text-display-sm font-semibold">
              Liquid&nbsp;UI catalog
            </h1>
            <p className="text-gray-11 text-ui-base mt-2 max-w-2xl">
              The @workspace/liquid-ui kit rendered under the liquid theme, over
              a drifting aurora sky. Surfaces and overlays are authored glass;
              controls and composites are base-ui re-exports the theme re-skins.
              Toggle light/dark to confirm both modes; this route grows one
              section per component group as the kit lands.
            </p>
          </div>
          <ThemeModeSwitcher />
        </header>

        <LiquidSection
          title="GlassPanel"
          meta="the shared liquid-glass surface: tint (frost / tinted / clear), elevation (flush / float / hero), optional pointer sheen"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <GlassPanel elevation="float" className="p-5">
              <div className="text-gray-12 text-ui-base font-medium">
                Frost, float
              </div>
              <p className="text-gray-11 text-ui-sm mt-1">
                The neutral default surface for panels and cards.
              </p>
            </GlassPanel>
            <GlassPanel
              tint="tinted"
              elevation="hero"
              interactive
              className="p-5"
            >
              <div className="text-gray-12 text-ui-base font-medium">
                Tinted, hero
              </div>
              <p className="text-gray-11 text-ui-sm mt-1">
                Accent-tinted and lifted, with a sheen that tracks the pointer.
              </p>
            </GlassPanel>
            <GlassPanel tint="clear" elevation="flush" className="p-5">
              <div className="text-gray-12 text-ui-base font-medium">
                Clear, flush
              </div>
              <p className="text-gray-11 text-ui-sm mt-1">
                Barely-there chrome that lets the sky read straight through.
              </p>
            </GlassPanel>
          </div>
        </LiquidSection>

        <ThemedControlsSection />

        <FloatingSurfacesSection />

        <OverlaysSection />

        <GlassSurfacesSection />

        <GlassAccentsSection />
      </div>
    </div>
  )
}

export const Route = createFileRoute("/design-system-liquid")({
  component: DesignSystemLiquidRoute,
})
