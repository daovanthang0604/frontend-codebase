import { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/Accordion"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/Alert"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@workspace/ui/components/Attachment"
import { Kbd } from "@workspace/ui/components/Kbd"
import { AspectRatio } from "@workspace/ui/components/AspectRatio"
import { Meter } from "@workspace/ui/components/Meter"
import { Pagination } from "@workspace/ui/components/Pagination"
import { Toolbar, ToolbarSeparator } from "@workspace/ui/components/Toolbar"
import { Progress } from "@workspace/ui/components/Progress"
import { Slider } from "@workspace/ui/components/Slider"
import { Tab, TabList, TabPanel, Tabs } from "@workspace/ui/components/Tabs"
import { Toggle, ToggleGroup } from "@workspace/ui/components/Toggle"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/Avatar"
import { Badge } from "@workspace/ui/components/Badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/Breadcrumb"
import { Button } from "@workspace/ui/components/Button"
import { ButtonGroup } from "@workspace/ui/components/ButtonGroup"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/Card"
import { Checkbox, CheckboxGroup } from "@workspace/ui/components/Checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/Collapsible"
import {
  DataTable,
  DataTableColumnHeader,
} from "@workspace/ui/components/DataTable"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/Dialog"
import { EmptyState } from "@workspace/ui/components/EmptyState"
import { Eyebrow } from "@workspace/ui/components/Eyebrow"
import {
  Input,
  PasswordInput,
  SearchInput,
  TextArea,
} from "@workspace/ui/components/Input"
import { KpiStatTile } from "@workspace/ui/components/KpiStatTile"
import {
  Menu,
  MenuItem,
  MenuPopover,
  MenuSeparator,
  MenuTrigger,
} from "@workspace/ui/components/Menu"
import { Metric } from "@workspace/ui/components/Metric"
import { MetricRow } from "@workspace/ui/components/MetricRow"
import { NumberInput } from "@workspace/ui/components/NumberInput"
import {
  Popover,
  PopoverDialog,
  PopoverTrigger,
} from "@workspace/ui/components/Popover"
import { RadioGroup } from "@workspace/ui/components/RadioGroup"
import { Section } from "@workspace/ui/components/Section"
import { SegmentedControl } from "@workspace/ui/components/SegmentedControl"
import { Select } from "@workspace/ui/components/Select"
import { Separator } from "@workspace/ui/components/Separator"
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/Sheet"
import { Sparkline } from "@workspace/ui/components/Sparkline"
import { Spinner } from "@workspace/ui/components/Spinner"
import { StatCard } from "@workspace/ui/components/StatCard"
import { Switch } from "@workspace/ui/components/Switch"
import { Tooltip, TooltipTrigger } from "@workspace/ui/components/Tooltip"
import { createFileRoute } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import {
  Bell,
  BookOpen,
  FileText,
  X,
  CircleAlert,
  CircleCheck,
  Info,
  TriangleAlert,
  Inbox,
  Mail,
  MoreHorizontal,
  Pencil,
  Plus,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react"

// Internal design-system showcase. Renders every @workspace/ui primitive so the
// re-skin can be eyeballed against the WDS reference gallery (localhost:8755).
// Intentionally NOT wrapped in <PageShell> and NOT i18n'd — it is a dev/QA
// surface, not a product page (PageShell/i18n rules exempt status & dev pages).
// DataTable / Filter are added in the data-table phase.

function Subsection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <Eyebrow tone="faint">{title}</Eyebrow>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

function Swatch({ token, label }: { token: string; label: string }) {
  return (
    <div className="flex w-16 flex-col gap-1">
      <div
        className="border-gray-a4 h-12 rounded-md border"
        style={{ background: `var(${token})` }}
      />
      <span className="text-gray-10 font-mono text-[10px] lowercase">
        {label}
      </span>
    </div>
  )
}

// Sample data for the DataTable showcase — eight campaigns.
interface DemoRow {
  id: string
  campaign: string
  channel: string
  status: "active" | "pending" | "draft"
  reach: number
  updated: string
}

const DEMO_STATUS: Record<
  DemoRow["status"],
  { color: "success" | "warning" | "gray"; label: string }
> = {
  active: { color: "success", label: "Active" },
  pending: { color: "warning", label: "Pending" },
  draft: { color: "gray", label: "Draft" },
}

const demoRows: DemoRow[] = [
  {
    id: "1",
    campaign: "Spring Harvest Gala",
    channel: "Email · Social",
    status: "active",
    reach: 182_400,
    updated: "2h ago",
  },
  {
    id: "2",
    campaign: "Clean Water Initiative",
    channel: "Display · Search",
    status: "active",
    reach: 96_210,
    updated: "5h ago",
  },
  {
    id: "3",
    campaign: "Youth Mentorship Drive",
    channel: "Social",
    status: "pending",
    reach: 41_870,
    updated: "Yesterday",
  },
  {
    id: "4",
    campaign: "Winter Coat Collection",
    channel: "Email",
    status: "draft",
    reach: 0,
    updated: "3d ago",
  },
  {
    id: "5",
    campaign: "Community Garden Launch",
    channel: "Display",
    status: "active",
    reach: 58_330,
    updated: "1w ago",
  },
  {
    id: "6",
    campaign: "Annual Donor Report",
    channel: "Email · Print",
    status: "pending",
    reach: 12_540,
    updated: "1w ago",
  },
  {
    id: "7",
    campaign: "Scholarship Spotlight",
    channel: "Social · Video",
    status: "active",
    reach: 73_900,
    updated: "2w ago",
  },
  {
    id: "8",
    campaign: "Holiday Giving Match",
    channel: "Email · Social",
    status: "draft",
    reach: 0,
    updated: "3w ago",
  },
]

const demoColumns: ColumnDef<DemoRow>[] = [
  {
    accessorKey: "campaign",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Campaign" />
    ),
    size: 260,
    minSize: 220,
    cell: ({ row }) => (
      <div className="flex flex-col leading-tight">
        <span className="text-gray-12 text-sm font-semibold">
          {row.original.campaign}
        </span>
        <span className="text-gray-10 text-xs">{row.original.channel}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 140,
    cell: ({ row }) => {
      const status = DEMO_STATUS[row.original.status]
      return (
        <Badge color={status.color} dot>
          {status.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: "reach",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reach" />
    ),
    size: 130,
    cell: ({ row }) => (
      <span className="font-num text-gray-12 text-sm font-semibold tabular-nums">
        {row.original.reach.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "updated",
    header: "Updated",
    size: 130,
    cell: ({ row }) => (
      <span className="text-gray-11 text-sm">{row.original.updated}</span>
    ),
  },
]

function DesignSystemRoute() {
  const [dark, setDark] = useState(false)
  const [collapsed, setCollapsed] = useState(true)
  const [seg, setSeg] = useState("overview")
  const [page, setPage] = useState(2)

  // Select / RadioGroup / CheckboxGroup take the full option OBJECT as
  // value/defaultValue (not the primitive), so define the option lists once.
  const countryOptions = [
    { id: "us", value: "us", label: "United States" },
    { id: "vn", value: "vn", label: "Vietnam" },
    { id: "jp", value: "jp", label: "Japan" },
  ]
  const [country, setCountry] = useState<(typeof countryOptions)[number]>(
    countryOptions[0]!
  )
  const planOptions = [
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro" },
    { value: "team", label: "Team" },
  ]
  const channelOptions = [
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "push", label: "Push" },
  ]

  const toggleDark = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle("dark", next)
  }

  return (
    <div className="bg-gray-1 min-h-screen w-full">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-12 px-8 py-10">
        {/* Header */}
        <header className="border-gray-a6 flex items-end justify-between border-b pb-6">
          <div className="flex flex-col gap-2">
            <Eyebrow tone="accent" icon={<Sparkles />}>
              workspace design system
            </Eyebrow>
            <h1 className="text-gray-12 text-display-xl m-0 font-serif">
              Component gallery
            </h1>
            <p className="text-gray-11 text-ui-base max-w-prose">
              Every @workspace/ui primitive, re-skinned to the WDS language.
              Compare side by side with the reference gallery.
            </p>
          </div>
          <Button variant="outline" intent="secondary" onClick={toggleDark}>
            {dark ? "Light mode" : "Dark mode"}
          </Button>
        </header>

        {/* Typography */}
        <Section title="Typography" eyebrow="Foundations">
          <div className="flex flex-col gap-4">
            <div className="text-gray-12 text-display-xl font-serif">
              Display XL — Lora 44
            </div>
            <div className="text-gray-12 text-display-lg font-serif">
              Display LG — Lora 33
            </div>
            <div className="text-gray-12 text-display-md font-serif">
              Display MD — Lora 24
            </div>
            <div className="text-gray-12 text-display-sm font-serif">
              Display SM — Lora 18
            </div>
            <Separator />
            <div className="text-gray-12 text-ui-lg">
              UI LG — Public Sans 17
            </div>
            <div className="text-gray-12 text-ui-base">
              UI Base — Public Sans 15 (body default)
            </div>
            <div className="text-gray-11 text-ui-sm">
              UI SM — Public Sans 13
            </div>
            <div className="text-eyebrow text-gray-10 uppercase">
              Eyebrow — Public Sans 11 / 0.1em
            </div>
            <div className="font-num text-gray-12 text-[28px] font-bold tabular-nums">
              1,234,567.89 — Space Grotesk numerals
            </div>
            <div className="text-gray-11 font-mono text-sm">
              JetBrains Mono — AD-300x250 · ID#4821
            </div>
          </div>
        </Section>

        {/* Color */}
        <Section title="Color" eyebrow="Foundations">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-gray-11 text-ui-sm mb-2">Gray (warm) ramp</p>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 12 }, (_, i) => (
                  <Swatch
                    key={i}
                    token={`--gray-${i + 1}`}
                    label={`gray-${i + 1}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-gray-11 text-ui-sm mb-2">Accent (navy) ramp</p>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 12 }, (_, i) => (
                  <Swatch
                    key={i}
                    token={`--accent-${i + 1}`}
                    label={`accent-${i + 1}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-gray-11 text-ui-sm mb-2">Semantic (step 9)</p>
              <div className="flex flex-wrap gap-2">
                <Swatch token="--success-9" label="success" />
                <Swatch token="--warning-9" label="warning" />
                <Swatch token="--red-9" label="error" />
                <Swatch token="--cyan-9" label="info" />
                <Swatch token="--accent-solid" label="solid" />
                <Swatch token="--panel" label="panel" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="bg-success-3 text-success-11 text-ui-sm rounded-full px-3 py-1 font-semibold">
                  Success
                </span>
                <span className="bg-warning-3 text-warning-11 text-ui-sm rounded-full px-3 py-1 font-semibold">
                  Warning
                </span>
                <span className="bg-error-3 text-error-11 text-ui-sm rounded-full px-3 py-1 font-semibold">
                  Error
                </span>
                <span className="bg-info-3 text-info-11 text-ui-sm rounded-full px-3 py-1 font-semibold">
                  Info
                </span>
              </div>
            </div>
          </div>
        </Section>

        {/* Buttons */}
        <Section title="Buttons" eyebrow="Core">
          <div className="flex flex-col gap-6">
            <Subsection title="Variants">
              <Button variant="solid" intent="primary">
                Solid
              </Button>
              <Button variant="outline" intent="secondary">
                Outline
              </Button>
              <Button variant="ghost" intent="secondary">
                Ghost
              </Button>
              <Button variant="minimal" intent="secondary">
                Minimal
              </Button>
              <Button variant="link" intent="primary">
                Link
              </Button>
              <Button variant="solid" intent="danger">
                Danger
              </Button>
            </Subsection>
            <Subsection title="Sizes">
              <Button size="xs">Extra small</Button>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </Subsection>
            <Subsection title="States & icons">
              <Button leftIcon={<Plus />}>New story</Button>
              <Button
                rightIcon={<TrendingUp />}
                intent="secondary"
                variant="outline"
              >
                Trending
              </Button>
              <Button isLoading>Saving</Button>
              <Button isDisabled>Disabled</Button>
              <Button mode="icon" variant="ghost" tooltip="Edit">
                <Pencil />
              </Button>
              <ButtonGroup>
                <Button variant="outline" intent="secondary">
                  Day
                </Button>
                <Button variant="outline" intent="secondary">
                  Week
                </Button>
                <Button variant="outline" intent="secondary">
                  Month
                </Button>
              </ButtonGroup>
            </Subsection>
          </div>
        </Section>

        {/* Badges */}
        <Section title="Badges" eyebrow="Core">
          <div className="flex flex-wrap gap-2">
            <Badge color="accent">Accent</Badge>
            <Badge color="gray">Neutral</Badge>
            <Badge color="grass">Active</Badge>
            <Badge color="amber">Pending</Badge>
            <Badge color="red">Rejected</Badge>
            <Badge color="blue">Info</Badge>
            <Badge color="grass" size="sm">
              Small
            </Badge>
            <Badge color="accent" size="lg">
              Large
            </Badge>
          </div>
          {/* Semantic status pills with a leading dot (the DS Data-table look) */}
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge color="success" dot>
              Active
            </Badge>
            <Badge color="error" dot>
              Suspended
            </Badge>
            <Badge color="warning" dot>
              Invited
            </Badge>
            <Badge color="info" dot>
              Submitted
            </Badge>
            <Badge color="gray" dot>
              Draft
            </Badge>
          </div>
        </Section>

        {/* Cards & stats */}
        <Section title="Cards & stats" eyebrow="Core">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Default card</CardTitle>
                  <CardDescription>
                    White paper lifting off the cream page.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-11 text-ui-sm">
                    Hairline border + soft warm shadow.
                  </p>
                </CardContent>
              </Card>
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Elevated</CardTitle>
                  <CardDescription>A touch more lift.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-11 text-ui-sm">For hover / active.</p>
                </CardContent>
              </Card>
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>Glass</CardTitle>
                  <CardDescription>Frosted panel.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-11 text-ui-sm">Backdrop blur.</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard
                label="Total stories"
                value="3.1M"
                icon={<BookOpen />}
                trend={<Sparkline data={[8, 12, 9, 14, 18, 16, 22]} />}
              />
              <StatCard label="Approved" value="92%" color="grass" />
              <StatCard label="Story value" value="$45K" color="amber" />
              <StatCard label="Loading" value="—" isLoading />
            </div>
            <div className="flex flex-wrap gap-4">
              <KpiStatTile
                label="Active"
                value="42"
                secondary="10 new"
                selected
                onSelect={() => {}}
              />
              <KpiStatTile
                label="Draft"
                value="8"
                secondary="2 today"
                onSelect={() => {}}
              />
              <KpiStatTile label="Archived" value="120" onSelect={() => {}} />
            </div>
          </div>
        </Section>

        {/* Layout primitives */}
        <Section
          title="Layout rhythm"
          eyebrow="Layout"
          meta="Section · Metric · MetricRow"
        >
          <MetricRow dividers>
            <Metric
              value="3.1M"
              label="Impressions"
              delta="+8.4%"
              trend="up"
              spark={[5, 8, 6, 9, 12, 11, 14]}
            />
            <Metric
              value="92"
              label="Story score"
              delta="+3"
              trend="up"
              emphasis
            />
            <Metric value="$182K" label="Revenue" delta="-2.1%" trend="down" />
            <Metric
              value="48"
              label="Live campaigns"
              delta="flat"
              trend="flat"
            />
          </MetricRow>
        </Section>

        {/* Forms */}
        <Section title="Form controls" eyebrow="Forms">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="Email"
              placeholder="you@example.com"
              leftIcon={<Mail />}
            />
            <PasswordInput label="Password" placeholder="••••••••" />
            <SearchInput placeholder="Search stories…" />
            <NumberInput label="Budget" placeholder="0" showStepper />
            <Select
              label="Country"
              options={countryOptions}
              value={country}
              onChange={(o) => setCountry(o)}
              isSearchable
            />
            <div className="sm:col-span-2">
              <TextArea label="Summary" placeholder="Write a short summary…" />
            </div>
            <RadioGroup
              label="Plan"
              options={planOptions}
              defaultValue={planOptions[1]}
            />
            <CheckboxGroup
              label="Channels"
              options={channelOptions}
              defaultValue={[channelOptions[0]!]}
            />
            <div className="flex flex-col gap-3">
              <Switch defaultSelected>Notifications</Switch>
              <Checkbox>Accept terms</Checkbox>
            </div>
          </div>
        </Section>

        {/* Feedback & misc */}
        <Section title="Feedback & navigation" eyebrow="Misc">
          <div className="flex flex-col gap-6">
            <Subsection title="Avatars, spinner, sparkline">
              <Avatar size="lg">
                <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="User" />
                <AvatarFallback>TD</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <Spinner className="text-accent-11 size-6" />
              <Sparkline
                data={[3, 6, 4, 8, 7, 11, 9, 14]}
                width={120}
                tooltip
              />
            </Subsection>

            <Subsection title="Tooltip, breadcrumb">
              <TooltipTrigger>
                <Button variant="outline" intent="secondary">
                  Hover me
                </Button>
                <Tooltip placement="top">Helpful hint</Tooltip>
              </TooltipTrigger>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Campaigns</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Overview</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </Subsection>

            <Subsection title="Tabs (segmented control)">
              <SegmentedControl
                options={[
                  { value: "overview", label: "Overview" },
                  { value: "audience", label: "Audience" },
                  { value: "summary", label: "Summary" },
                ]}
                value={seg}
                onChange={setSeg}
              />
            </Subsection>

            <Subsection title="Collapsible">
              <Collapsible
                open={!collapsed}
                onOpenChange={(o) => setCollapsed(!o)}
              >
                <CollapsibleTrigger className="text-accent-11 text-ui-sm inline-flex items-center gap-1.5 font-semibold">
                  <Star className="size-3.5" />
                  {collapsed ? "Show details" : "Hide details"}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <p className="text-gray-11 text-ui-sm max-w-prose pt-2">
                    Smoothly revealed content sits here.
                  </p>
                </CollapsibleContent>
              </Collapsible>
            </Subsection>

            <Subsection title="Overlays">
              <DialogTrigger>
                <Button>Open dialog</Button>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm action</DialogTitle>
                    <DialogDescription>
                      This is a sample dialog on a white panel.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="ghost" intent="secondary" slot="close">
                      Cancel
                    </Button>
                    <Button>Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </DialogTrigger>

              <SheetTrigger>
                <Button variant="outline" intent="secondary">
                  Open sheet
                </Button>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Side sheet</SheetTitle>
                    <SheetDescription>
                      Slides in from the edge.
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </SheetTrigger>

              <PopoverTrigger>
                <Button
                  variant="outline"
                  intent="secondary"
                  rightIcon={<Bell />}
                >
                  Popover
                </Button>
                <Popover placement="bottom">
                  <PopoverDialog>
                    <p className="text-gray-11 text-ui-sm">A small popover.</p>
                  </PopoverDialog>
                </Popover>
              </PopoverTrigger>

              <MenuTrigger>
                <Button mode="icon" variant="ghost" aria-label="More actions">
                  <MoreHorizontal />
                </Button>
                <MenuPopover>
                  <Menu>
                    <MenuItem onAction={() => {}}>Edit</MenuItem>
                    <MenuItem onAction={() => {}}>Duplicate</MenuItem>
                    <MenuSeparator />
                    <MenuItem onAction={() => {}}>Delete</MenuItem>
                  </Menu>
                </MenuPopover>
              </MenuTrigger>
            </Subsection>

            <Subsection title="Empty state">
              <div className="w-full max-w-md">
                <EmptyState
                  icon={<Inbox />}
                  title="No stories yet"
                  description="Create your first story to see it here."
                  action={<Button leftIcon={<Plus />}>New story</Button>}
                />
              </div>
            </Subsection>
          </div>
        </Section>

        {/* Table */}
        <Section
          title="Tabs · Toggle · Slider · Progress · Accordion"
          eyebrow="Controls"
          meta="react-aria"
        >
          <div className="flex w-full flex-col gap-8">
            <Subsection title="Tabs">
              <Tabs defaultSelectedKey="overview" className="w-full max-w-md">
                <TabList>
                  <Tab id="overview">Overview</Tab>
                  <Tab id="activity">Activity</Tab>
                  <Tab id="settings">Settings</Tab>
                </TabList>
                <TabPanel id="overview">Overview panel content.</TabPanel>
                <TabPanel id="activity">Activity panel content.</TabPanel>
                <TabPanel id="settings">Settings panel content.</TabPanel>
              </Tabs>
            </Subsection>

            <Subsection title="Toggle">
              <Toggle aria-label="Favorite" defaultSelected>
                <Star />
              </Toggle>
              <ToggleGroup selectionMode="single" defaultSelectedKeys={["left"]}>
                <Toggle id="left">Left</Toggle>
                <Toggle id="center">Center</Toggle>
                <Toggle id="right">Right</Toggle>
              </ToggleGroup>
            </Subsection>

            <Subsection title="Slider">
              <Slider label="Volume" defaultValue={60} className="max-w-xs" />
              <Slider
                label="Range"
                defaultValue={[20, 80]}
                className="max-w-xs"
              />
            </Subsection>

            <Subsection title="Progress">
              <Progress
                label="Uploading"
                value={64}
                showValue
                className="max-w-xs"
              />
            </Subsection>

            <Subsection title="Accordion">
              <Accordion defaultExpandedKeys={["a"]} className="w-full max-w-md">
                <AccordionItem id="a">
                  <AccordionTrigger>What is this?</AccordionTrigger>
                  <AccordionContent>
                    A react-aria disclosure group styled to the kit.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem id="b">
                  <AccordionTrigger>How does it animate?</AccordionTrigger>
                  <AccordionContent>
                    Panels expand with a CSS grid-rows height transition.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Subsection>
          </div>
        </Section>

        <Section title="Alert · Kbd" eyebrow="Feedback" meta="react-aria">
          <div className="flex w-full flex-col gap-8">
            <Subsection title="Alert">
              <div className="flex w-full max-w-lg flex-col gap-3">
                <Alert variant="info" icon={<Info />}>
                  <AlertTitle>Heads up</AlertTitle>
                  <AlertDescription>
                    This is an informational alert.
                  </AlertDescription>
                </Alert>
                <Alert variant="success" icon={<CircleCheck />}>
                  <AlertTitle>Saved</AlertTitle>
                  <AlertDescription>Your changes were saved.</AlertDescription>
                </Alert>
                <Alert variant="warning" icon={<TriangleAlert />}>
                  <AlertTitle>Careful</AlertTitle>
                  <AlertDescription>
                    This action can’t be undone.
                  </AlertDescription>
                </Alert>
                <Alert variant="error" icon={<CircleAlert />}>
                  <AlertTitle>Something went wrong</AlertTitle>
                  <AlertDescription>Please try again.</AlertDescription>
                </Alert>
              </div>
            </Subsection>

            <Subsection title="Kbd">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
              <Kbd>Esc</Kbd>
              <Kbd>Enter</Kbd>
            </Subsection>
          </div>
        </Section>

        <Section
          title="Meter · Toolbar · Aspect Ratio · Pagination"
          eyebrow="Data & Layout"
          meta="react-aria"
        >
          <div className="flex w-full flex-col gap-8">
            <Subsection title="Meter">
              <div className="flex w-full max-w-xs flex-col gap-4">
                <Meter label="CPU" value={38} />
                <Meter label="Memory" value={72} />
                <Meter label="Disk" value={91} />
              </div>
            </Subsection>

            <Subsection title="Toolbar">
              <Toolbar aria-label="Formatting">
                <Toggle aria-label="Bold" className="font-bold">
                  B
                </Toggle>
                <Toggle aria-label="Italic" className="italic">
                  I
                </Toggle>
                <ToolbarSeparator />
                <Button size="sm" variant="ghost" intent="secondary">
                  Reset
                </Button>
              </Toolbar>
            </Subsection>

            <Subsection title="Aspect Ratio">
              <AspectRatio
                ratio={16 / 9}
                className="bg-gray-3 text-gray-11 flex max-w-xs items-center justify-center rounded-lg text-sm"
              >
                16 / 9
              </AspectRatio>
            </Subsection>

            <Subsection title="Pagination">
              <Pagination page={page} totalPages={10} onPageChange={setPage} />
            </Subsection>
          </div>
        </Section>

        <Section title="Attachment" eyebrow="Chat / Files" meta="shadcn">
          <div className="flex w-full flex-col gap-6">
            <Subsection title="States">
              <div className="flex w-full max-w-md flex-col gap-2">
                <Attachment state="done">
                  <AttachmentMedia>
                    <FileText />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>
                    <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
                  </AttachmentContent>
                  <AttachmentActions>
                    <AttachmentAction aria-label="Remove file">
                      <X />
                    </AttachmentAction>
                  </AttachmentActions>
                </Attachment>
                <Attachment state="uploading">
                  <AttachmentMedia>
                    <FileText />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>quarterly-report.docx</AttachmentTitle>
                    <AttachmentDescription>Uploading…</AttachmentDescription>
                  </AttachmentContent>
                </Attachment>
                <Attachment state="error">
                  <AttachmentMedia>
                    <FileText />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>archive.zip</AttachmentTitle>
                    <AttachmentDescription>Upload failed</AttachmentDescription>
                  </AttachmentContent>
                  <AttachmentActions>
                    <AttachmentAction aria-label="Retry">
                      <X />
                    </AttachmentAction>
                  </AttachmentActions>
                </Attachment>
              </div>
            </Subsection>

            <Subsection title="Group (scrollable)">
              <AttachmentGroup className="max-w-md">
                {["alpha", "bravo", "charlie", "delta", "echo"].map((n, i) => (
                  <Attachment key={n} size="sm" className="w-52">
                    <AttachmentMedia>
                      <FileText />
                    </AttachmentMedia>
                    <AttachmentContent>
                      <AttachmentTitle>{n}.png</AttachmentTitle>
                      <AttachmentDescription>
                        PNG · {(i + 1) * 120} KB
                      </AttachmentDescription>
                    </AttachmentContent>
                  </Attachment>
                ))}
              </AttachmentGroup>
            </Subsection>
          </div>
        </Section>

        <Section title="Table" eyebrow="Data" meta="DataTable">
          <DataTable
            columns={demoColumns}
            data={demoRows}
            dataSource="client"
            storageKey="design-system-table"
            emptyStateTitle="No campaigns yet"
            enableRowSelection
            estimatedRowHeight={53}
          />
        </Section>
      </div>
    </div>
  )
}

export const Route = createFileRoute("/design-system")({
  component: DesignSystemRoute,
})
