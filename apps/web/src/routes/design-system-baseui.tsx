import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react"
import { createFileRoute } from "@tanstack/react-router"
import type { Column, ColumnDef } from "@tanstack/react-table"
import {
  Accordion as BaseUiAccordion,
  AccordionContent as BaseUiAccordionContent,
  AccordionItem as BaseUiAccordionItem,
  AccordionTrigger as BaseUiAccordionTrigger,
} from "@workspace/base-ui/components/Accordion"
import {
  Alert as BaseUiAlert,
  AlertDescription as BaseUiAlertDescription,
  AlertTitle as BaseUiAlertTitle,
} from "@workspace/base-ui/components/Alert"
import {
  AlertDialog as BaseUiAlertDialog,
  AlertDialogAction as BaseUiAlertDialogAction,
  AlertDialogCancel as BaseUiAlertDialogCancel,
  AlertDialogContent as BaseUiAlertDialogContent,
  AlertDialogDescription as BaseUiAlertDialogDescription,
  AlertDialogFooter as BaseUiAlertDialogFooter,
  AlertDialogHeader as BaseUiAlertDialogHeader,
  AlertDialogTitle as BaseUiAlertDialogTitle,
  AlertDialogTrigger as BaseUiAlertDialogTrigger,
} from "@workspace/base-ui/components/AlertDialog"
import { AspectRatio as BaseUiAspectRatio } from "@workspace/base-ui/components/AspectRatio"
import {
  Autocomplete as BaseUiAutocomplete,
  AutocompleteContent as BaseUiAutocompleteContent,
  AutocompleteInput as BaseUiAutocompleteInput,
  AutocompleteItem as BaseUiAutocompleteItem,
} from "@workspace/base-ui/components/Autocomplete"
import {
  Avatar as BaseUiAvatar,
  AvatarFallback as BaseUiAvatarFallback,
  AvatarImage as BaseUiAvatarImage,
} from "@workspace/base-ui/components/Avatar"
import { Badge as BaseUiBadge } from "@workspace/base-ui/components/Badge"
import {
  BreadcrumbEllipsis as BaseUiBreadcrumbEllipsis,
  BreadcrumbItem as BaseUiBreadcrumbItem,
  BreadcrumbLink as BaseUiBreadcrumbLink,
  BreadcrumbPage as BaseUiBreadcrumbPage,
  Breadcrumbs as BaseUiBreadcrumbs,
  BreadcrumbSeparator as BaseUiBreadcrumbSeparator,
} from "@workspace/base-ui/components/Breadcrumbs"
import { Button as BaseUiButton } from "@workspace/base-ui/components/Button"
import {
  Calendar as BaseUiCalendar,
  type DateRange as BaseUiDateRange,
} from "@workspace/base-ui/components/Calendar"
import {
  Card as BaseUiCard,
  CardContent as BaseUiCardContent,
  CardDescription as BaseUiCardDescription,
  CardHeader as BaseUiCardHeader,
  CardTitle as BaseUiCardTitle,
} from "@workspace/base-ui/components/Card"
import { Checkbox as BaseUiCheckbox } from "@workspace/base-ui/components/Checkbox"
import {
  CheckboxGroup as BaseUiCheckboxGroup,
  CheckboxGroupItem as BaseUiCheckboxGroupItem,
} from "@workspace/base-ui/components/CheckboxGroup"
import {
  Collapsible as BaseUiCollapsible,
  CollapsibleContent as BaseUiCollapsibleContent,
  CollapsibleTrigger as BaseUiCollapsibleTrigger,
} from "@workspace/base-ui/components/Collapsible"
import {
  Combobox as BaseUiCombobox,
  ComboboxContent as BaseUiComboboxContent,
  ComboboxItem as BaseUiComboboxItem,
  ComboboxTrigger as BaseUiComboboxTrigger,
  type ComboboxOption as BaseUiComboboxOption,
} from "@workspace/base-ui/components/Combobox"
import {
  ContextMenu as BaseUiContextMenu,
  ContextMenuCheckboxItem as BaseUiContextMenuCheckboxItem,
  ContextMenuContent as BaseUiContextMenuContent,
  ContextMenuItem as BaseUiContextMenuItem,
  ContextMenuSeparator as BaseUiContextMenuSeparator,
  ContextMenuShortcut as BaseUiContextMenuShortcut,
  ContextMenuSub as BaseUiContextMenuSub,
  ContextMenuSubContent as BaseUiContextMenuSubContent,
  ContextMenuSubTrigger as BaseUiContextMenuSubTrigger,
  ContextMenuTrigger as BaseUiContextMenuTrigger,
} from "@workspace/base-ui/components/ContextMenu"
import {
  DataTable as BaseUiDataTable,
  DataTableColumnHeader as BaseUiDataTableColumnHeader,
} from "@workspace/base-ui/components/DataTable"
import {
  DatePicker as BaseUiDatePicker,
  DateRangePicker as BaseUiDateRangePicker,
} from "@workspace/base-ui/components/DatePicker"
import {
  DialogClose as BaseUiDialogClose,
  DialogContent as BaseUiDialogContent,
  DialogDescription as BaseUiDialogDescription,
  DialogFooter as BaseUiDialogFooter,
  DialogHeader as BaseUiDialogHeader,
  DialogTitle as BaseUiDialogTitle,
  DialogTrigger as BaseUiDialogTrigger,
} from "@workspace/base-ui/components/Dialog"
import {
  DateModeRowValue as BaseUiDateModeRowValue,
  Filter as BaseUiFilter,
  FilterBar as BaseUiFilterBar,
  FilterDateMode as BaseUiFilterDateMode,
  FilterSelect as BaseUiFilterSelect,
  type FilterBuilderEntry as BaseUiFilterBuilderEntry,
  type FilterValue as BaseUiFilterValue,
} from "@workspace/base-ui/components/Filter"
import {
  Input as BaseUiInput,
  PasswordInput as BaseUiPasswordInput,
  SearchInput as BaseUiSearchInput,
  TextArea as BaseUiTextArea,
} from "@workspace/base-ui/components/Input"
import { Kbd as BaseUiKbd } from "@workspace/base-ui/components/Kbd"
import { Label as BaseUiLabel } from "@workspace/base-ui/components/Label"
import {
  Menu as BaseUiMenu,
  MenuCheckboxItem as BaseUiMenuCheckboxItem,
  MenuGroupLabel as BaseUiMenuGroupLabel,
  MenuItem as BaseUiMenuItem,
  MenuPopover as BaseUiMenuPopover,
  MenuRadioGroup as BaseUiMenuRadioGroup,
  MenuRadioItem as BaseUiMenuRadioItem,
  MenuSeparator as BaseUiMenuSeparator,
  MenuShortcut as BaseUiMenuShortcut,
  MenuSub as BaseUiMenuSub,
  MenuSubContent as BaseUiMenuSubContent,
  MenuSubTrigger as BaseUiMenuSubTrigger,
  MenuTrigger as BaseUiMenuTrigger,
} from "@workspace/base-ui/components/Menu"
import {
  Menubar as BaseUiMenubar,
  MenubarContent as BaseUiMenubarContent,
  MenubarItem as BaseUiMenubarItem,
  MenubarMenu as BaseUiMenubarMenu,
  MenubarSeparator as BaseUiMenubarSeparator,
  MenubarShortcut as BaseUiMenubarShortcut,
  MenubarSub as BaseUiMenubarSub,
  MenubarSubContent as BaseUiMenubarSubContent,
  MenubarSubTrigger as BaseUiMenubarSubTrigger,
  MenubarTrigger as BaseUiMenubarTrigger,
} from "@workspace/base-ui/components/Menubar"
import { Meter as BaseUiMeter } from "@workspace/base-ui/components/Meter"
import {
  NavigationMenu as BaseUiNavigationMenu,
  NavigationMenuContent as BaseUiNavigationMenuContent,
  NavigationMenuItem as BaseUiNavigationMenuItem,
  NavigationMenuLink as BaseUiNavigationMenuLink,
  NavigationMenuTrigger as BaseUiNavigationMenuTrigger,
  NavigationMenuViewport as BaseUiNavigationMenuViewport,
} from "@workspace/base-ui/components/NavigationMenu"
import { NumberInput as BaseUiNumberInput } from "@workspace/base-ui/components/NumberInput"
import {
  Pagination as BaseUiPagination,
  PaginationContent as BaseUiPaginationContent,
  PaginationEllipsis as BaseUiPaginationEllipsis,
  PaginationItem as BaseUiPaginationItem,
  PaginationLink as BaseUiPaginationLink,
  PaginationNext as BaseUiPaginationNext,
  PaginationPrevious as BaseUiPaginationPrevious,
} from "@workspace/base-ui/components/Pagination"
import {
  Popover as BaseUiPopover,
  PopoverDialog as BaseUiPopoverDialog,
  PopoverTrigger as BaseUiPopoverTrigger,
} from "@workspace/base-ui/components/Popover"
import {
  PreviewCard as BaseUiPreviewCard,
  PreviewCardContent as BaseUiPreviewCardContent,
  PreviewCardTrigger as BaseUiPreviewCardTrigger,
} from "@workspace/base-ui/components/PreviewCard"
import { Progress as BaseUiProgress } from "@workspace/base-ui/components/Progress"
import { RadioGroup as BaseUiRadioGroup } from "@workspace/base-ui/components/RadioGroup"
import { ScrollArea as BaseUiScrollArea } from "@workspace/base-ui/components/ScrollArea"
import { SegmentedControl as BaseUiSegmentedControl } from "@workspace/base-ui/components/SegmentedControl"
import {
  Select as BaseUiSelect,
  SelectContent as BaseUiSelectContent,
  SelectGroup as BaseUiSelectGroup,
  SelectGroupLabel as BaseUiSelectGroupLabel,
  SelectItem as BaseUiSelectItem,
  SelectSeparator as BaseUiSelectSeparator,
  SelectTrigger as BaseUiSelectTrigger,
} from "@workspace/base-ui/components/Select"
import { Separator as BaseUiSeparator } from "@workspace/base-ui/components/Separator"
import {
  SheetContent as BaseUiSheetContent,
  SheetDescription as BaseUiSheetDescription,
  SheetHeader as BaseUiSheetHeader,
  SheetTitle as BaseUiSheetTitle,
  SheetTrigger as BaseUiSheetTrigger,
} from "@workspace/base-ui/components/Sheet"
import {
  SidebarCollapseTrigger as BaseUiSidebarCollapseTrigger,
  SidebarNavTree as BaseUiSidebarNavTree,
  SidebarProvider as BaseUiSidebarProvider,
  SidebarViewport as BaseUiSidebarViewport,
  useSidebar as useBaseUiSidebar,
  type SidebarNavNode as BaseUiSidebarNavNode,
} from "@workspace/base-ui/components/Sidebar"
import { Skeleton as BaseUiSkeleton } from "@workspace/base-ui/components/Skeleton"
import { Slider as BaseUiSlider } from "@workspace/base-ui/components/Slider"
import { Switch as BaseUiSwitch } from "@workspace/base-ui/components/Switch"
import {
  Tab as BaseUiTab,
  TabList as BaseUiTabList,
  TabPanel as BaseUiTabPanel,
  Tabs as BaseUiTabs,
} from "@workspace/base-ui/components/Tabs"
import {
  toast as baseUiToast,
  ToastProvider as BaseUiToastProvider,
} from "@workspace/base-ui/components/Toast"
import { confirm as baseUiConfirm } from "@workspace/base-ui/components/ConfirmDialog"
import {
  Toggle as BaseUiToggle,
  ToggleGroup as BaseUiToggleGroup,
} from "@workspace/base-ui/components/Toggle"
import {
  ToggleGroupItem as BaseUiToggleGroupItem,
  ToggleGroup as BaseUiToggleGroupRoot,
} from "@workspace/base-ui/components/ToggleGroup"
import {
  Toolbar as BaseUiToolbar,
  ToolbarSeparator as BaseUiToolbarSeparator,
} from "@workspace/base-ui/components/Toolbar"
import {
  Tooltip as BaseUiTooltip,
  TooltipTrigger as BaseUiTooltipTrigger,
} from "@workspace/base-ui/components/Tooltip"
// AI / Chat kit
import {
  Conversation as BaseUiConversation,
  ConversationContent as BaseUiConversationContent,
  ConversationScrollButton as BaseUiConversationScrollButton,
} from "@workspace/base-ui/components/Conversation"
import { Loader as BaseUiLoader } from "@workspace/base-ui/components/Loader"
import {
  Message as BaseUiMessage,
  MessageAvatar as BaseUiMessageAvatar,
  MessageContent as BaseUiMessageContent,
} from "@workspace/base-ui/components/Message"
import {
  PromptInput as BaseUiPromptInput,
  PromptInputButton as BaseUiPromptInputButton,
  PromptInputSubmit as BaseUiPromptInputSubmit,
  PromptInputTextarea as BaseUiPromptInputTextarea,
  PromptInputToolbar as BaseUiPromptInputToolbar,
  PromptInputTools as BaseUiPromptInputTools,
} from "@workspace/base-ui/components/PromptInput"
import {
  Reasoning as BaseUiReasoning,
  ReasoningContent as BaseUiReasoningContent,
  ReasoningTrigger as BaseUiReasoningTrigger,
} from "@workspace/base-ui/components/Reasoning"
import { Response as BaseUiResponse } from "@workspace/base-ui/components/Response"
import {
  Suggestion as BaseUiSuggestion,
  Suggestions as BaseUiSuggestions,
} from "@workspace/base-ui/components/Suggestions"
import {
  Tool as BaseUiTool,
  ToolContent as BaseUiToolContent,
  ToolHeader as BaseUiToolHeader,
  ToolInput as BaseUiToolInput,
  ToolOutput as BaseUiToolOutput,
} from "@workspace/base-ui/components/Tool"
// group ④: data & advanced
import {
  ChartContainer as BaseUiChartContainer,
  ChartLegend as BaseUiChartLegend,
  ChartLegendContent as BaseUiChartLegendContent,
  ChartTooltip as BaseUiChartTooltip,
  ChartTooltipContent as BaseUiChartTooltipContent,
  type ChartConfig as BaseUiChartConfig,
} from "@workspace/base-ui/components/Chart"
import {
  CommandDialog as BaseUiCommandDialog,
  CommandEmpty as BaseUiCommandEmpty,
  CommandGroup as BaseUiCommandGroup,
  CommandInput as BaseUiCommandInput,
  CommandItem as BaseUiCommandItem,
  CommandList as BaseUiCommandList,
  CommandSeparator as BaseUiCommandSeparator,
  CommandShortcut as BaseUiCommandShortcut,
} from "@workspace/base-ui/components/Command"
import {
  FileUpload as BaseUiFileUpload,
  FileUploadItem as BaseUiFileUploadItem,
  FileUploadList as BaseUiFileUploadList,
} from "@workspace/base-ui/components/FileUpload"
import {
  Field as BaseUiField,
  FieldControl as BaseUiFieldControl,
  FieldDescription as BaseUiFieldDescription,
  FieldError as BaseUiFieldError,
  FieldLabel as BaseUiFieldLabel,
  Fieldset as BaseUiFieldset,
  FieldsetLegend as BaseUiFieldsetLegend,
  Form as BaseUiForm,
} from "@workspace/base-ui/components/Form"
import { InputOTP as BaseUiInputOTP } from "@workspace/base-ui/components/InputOTP"
import {
  KanbanBoard as BaseUiKanbanBoard,
  type KanbanColumnData as BaseUiKanbanColumnData,
} from "@workspace/base-ui/components/Kanban"
import {
  Timeline as BaseUiTimeline,
  TimelineConnector as BaseUiTimelineConnector,
  TimelineContent as BaseUiTimelineContent,
  TimelineDescription as BaseUiTimelineDescription,
  TimelineDot as BaseUiTimelineDot,
  TimelineItem as BaseUiTimelineItem,
  TimelineTime as BaseUiTimelineTime,
  TimelineTitle as BaseUiTimelineTitle,
} from "@workspace/base-ui/components/Timeline"
import {
  TreeView as BaseUiTreeView,
  type TreeNode as BaseUiTreeNode,
} from "@workspace/base-ui/components/Tree"
import { cn } from "@workspace/base-ui/lib/utils"
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
import { EgCalendar as UiEgCalendar } from "@workspace/ui/components/Calendar"
import { Checkbox as UiCheckbox } from "@workspace/ui/components/Checkbox"
import {
  Collapsible as UiCollapsible,
  CollapsibleContent as UiCollapsibleContent,
  CollapsibleTrigger as UiCollapsibleTrigger,
} from "@workspace/ui/components/Collapsible"
import {
  DataTable as UiDataTable,
  DataTableColumnHeader as UiDataTableColumnHeader,
} from "@workspace/ui/components/DataTable"
import {
  DialogContent as UiDialogContent,
  DialogDescription as UiDialogDescription,
  DialogFooter as UiDialogFooter,
  DialogHeader as UiDialogHeader,
  DialogTitle as UiDialogTitle,
  DialogTrigger as UiDialogTrigger,
} from "@workspace/ui/components/Dialog"
import {
  Input as UiInput,
  PasswordInput as UiPasswordInput,
  SearchInput as UiSearchInput,
  TextArea as UiTextArea,
} from "@workspace/ui/components/Input"
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
import { SegmentedControl as UiSegmentedControl } from "@workspace/ui/components/SegmentedControl"
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
  Toolbar as UiToolbar,
  ToolbarSeparator as UiToolbarSeparator,
} from "@workspace/ui/components/Toolbar"
import {
  Tooltip as UiTooltip,
  TooltipTrigger as UiTooltipTrigger,
} from "@workspace/ui/components/Tooltip"
import {
  AlertCircle,
  AlignCenter,
  AlignLeft,
  AlignRight,
  CalendarClock,
  ChartLine,
  CheckCircle2,
  CircleDashed,
  CreditCard,
  Info,
  LayoutDashboard,
  Megaphone,
  PanelLeft,
  Paperclip,
  Settings,
  Sparkles,
  UserRound,
} from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { ThemeModeSwitcher } from "@/components/ThemeModeSwitcher"

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
          <div className="text-gray-10 text-eyebrow mb-3 uppercase">
            base-ui
          </div>
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

// Full-width, base-ui-only showcase — for the 9ui-parity components that have no
// @workspace/ui counterpart. Mirrors the Filter / Sidebar section pattern.
function BaseUiSection({
  title,
  meta,
  children,
}: {
  title: string
  meta?: string
  children: ReactNode
}) {
  return (
    <section className="border-gray-a4 border-t py-7">
      <header className="mb-4 flex flex-col gap-1">
        <h2 className="text-gray-12 text-ui-lg font-semibold">{title}</h2>
        {meta ? <span className="text-gray-10 text-ui-sm">{meta}</span> : null}
      </header>
      <div>
        <div className="text-gray-10 text-eyebrow mb-3 uppercase">base-ui</div>
        {children}
      </div>
    </section>
  )
}

function BaseUiCalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [range, setRange] = useState<BaseUiDateRange | undefined>(undefined)
  return (
    <div className="flex flex-wrap gap-6">
      <div>
        <div className="text-gray-10 text-eyebrow mb-2 uppercase">single</div>
        <div className="border-gray-a4 bg-panel w-fit rounded-lg border shadow-sm">
          <BaseUiCalendar mode="single" selected={date} onSelect={setDate} />
        </div>
      </div>
      <div>
        <div className="text-gray-10 text-eyebrow mb-2 uppercase">range</div>
        <div className="border-gray-a4 bg-panel w-fit rounded-lg border shadow-sm">
          <BaseUiCalendar mode="range" selected={range} onSelect={setRange} />
        </div>
      </div>
    </div>
  )
}

function UiCalendarDemo() {
  const [date, setDate] = useState<string | undefined>(undefined)
  return (
    <div>
      <div className="text-gray-10 text-eyebrow mb-2 uppercase">single</div>
      <UiEgCalendar value={date} onChange={setDate} />
    </div>
  )
}

const FILTER_STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Paused", value: "paused" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
]

const FILTER_OWNER_OPTIONS = [
  { label: "Alex Kim", value: "alex" },
  { label: "Sam Rivera", value: "sam" },
  { label: "Jordan Lee", value: "jordan" },
  { label: "Taylor Chen", value: "taylor" },
]

function BaseUiFilterDemo() {
  const [value, setValue] = useState<BaseUiFilterValue>({})
  const items = useMemo<BaseUiFilterBuilderEntry[]>(
    () => [
      {
        field: "status",
        label: "Status",
        icon: <CircleDashed className="size-4" />,
        multi: true,
        options: FILTER_STATUS_OPTIONS,
        render: () => <BaseUiFilterSelect />,
      },
      {
        field: "owner",
        label: "Owner",
        icon: <UserRound className="size-4" />,
        multi: false,
        options: FILTER_OWNER_OPTIONS,
        render: () => <BaseUiFilterSelect multi={false} />,
      },
      {
        field: "created",
        label: "Created",
        icon: <CalendarClock className="size-4" />,
        render: () => <BaseUiFilterDateMode />,
        renderRowValue: ({ value, field }) => (
          <BaseUiDateModeRowValue value={value} field={field} />
        ),
      },
    ],
    []
  )

  return (
    <BaseUiFilter value={value} onChange={setValue}>
      <BaseUiFilterBar items={items} />
    </BaseUiFilter>
  )
}

const SIDEBAR_NODES: BaseUiSidebarNavNode[] = [
  {
    type: "item",
    to: "/overview",
    label: "Overview",
    icon: <LayoutDashboard />,
  },
  { type: "item", to: "/analytics", label: "Analytics", icon: <ChartLine /> },
  {
    type: "folder",
    label: "Campaigns",
    icon: <Megaphone />,
    defaultOpen: true,
    items: [
      { type: "item", to: "/campaigns/active", label: "Active" },
      { type: "item", to: "/campaigns/drafts", label: "Drafts" },
      { type: "item", to: "/campaigns/archived", label: "Archived" },
    ],
  },
  { type: "item", to: "/settings", label: "Settings", icon: <Settings /> },
]

function BaseUiSidebarDemo() {
  const [pathname, setPathname] = useState("/campaigns/active")
  return (
    <BaseUiSidebarProvider pathname={pathname}>
      <SidebarFrame pathname={pathname} onNavigate={setPathname} />
    </BaseUiSidebarProvider>
  )
}

function SidebarFrame({
  pathname,
  onNavigate,
}: {
  pathname: string
  onNavigate: (to: string) => void
}) {
  const { collapsed } = useBaseUiSidebar()
  return (
    <div
      className={cn(
        "bg-panel border-gray-a5 flex h-[440px] flex-col overflow-hidden rounded-lg border text-sm shadow-sm",
        "transition-[width] duration-200 ease-in-out motion-reduce:transition-none",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div
        className={cn(
          "border-gray-a5 flex h-12 items-center gap-2 border-b",
          collapsed ? "justify-center px-2" : "px-3"
        )}
      >
        {!collapsed && (
          <span className="text-gray-12 flex-1 font-semibold">Acme</span>
        )}
        <BaseUiSidebarCollapseTrigger>
          <PanelLeft className="size-4" />
        </BaseUiSidebarCollapseTrigger>
      </div>
      <BaseUiSidebarViewport>
        <BaseUiSidebarNavTree
          nodes={SIDEBAR_NODES}
          pathname={pathname}
          renderLink={(node) => (
            <button type="button" onClick={() => onNavigate(node.to)}>
              {node.label}
            </button>
          )}
        />
      </BaseUiSidebarViewport>
    </div>
  )
}

const CHAT_SUGGESTIONS = [
  "How do I stream responses?",
  "Show me a code example",
  "What is streamdown?",
]

const CHAT_REASONING =
  "The user wants a streaming setup. I'll outline the route handler, how tokens flow from the model, and how the kit renders them — then offer to expand any step."

const CHAT_ANSWER = `Here's a tight way to wire **streaming** responses:

1. Scaffold the route handler
2. Stream tokens from the model
3. Render them with \`<Response>\`

\`\`\`ts
export async function POST(req: Request) {
  const { messages } = await req.json()
  const result = streamText({ model, messages })
  return result.toTextStreamResponse()
}
\`\`\`

| Piece  | Owner   |
| ------ | ------- |
| Route  | you     |
| Render | the kit |

That's the gist — want me to expand any step?`

type ChatMsg = {
  id: number
  role: "user" | "assistant"
  content: string
  reasoning?: string
  reasoningStreaming?: boolean
  duration?: number
  tool?: boolean
}

function BaseUiChatDemo() {
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [status, setStatus] = useState<"ready" | "submitted" | "streaming">(
    "ready"
  )
  const idRef = useRef(0)
  const timers = useRef<number[]>([])

  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t))
    },
    []
  )

  const after = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  const send = (text: string) => {
    if (status !== "ready" || !text.trim()) return
    const userId = ++idRef.current
    const asstId = ++idRef.current
    setMessages((m) => [...m, { id: userId, role: "user", content: text }])
    setStatus("submitted")

    // Simulate: brief "typing", then a streaming reasoning + tool + answer.
    after(450, () => {
      setMessages((m) => [
        ...m,
        {
          id: asstId,
          role: "assistant",
          content: "",
          reasoning: CHAT_REASONING,
          reasoningStreaming: true,
          tool: true,
        },
      ])
      setStatus("streaming")

      after(750, () => {
        setMessages((m) =>
          m.map((msg) =>
            msg.id === asstId
              ? { ...msg, reasoningStreaming: false, duration: 1 }
              : msg
          )
        )
        let i = 0
        const step = () => {
          i = Math.min(i + 4, CHAT_ANSWER.length)
          const slice = CHAT_ANSWER.slice(0, i)
          setMessages((m) =>
            m.map((msg) =>
              msg.id === asstId ? { ...msg, content: slice } : msg
            )
          )
          if (i < CHAT_ANSWER.length) {
            after(16, step)
          } else {
            setStatus("ready")
          }
        }
        step()
      })
    })
  }

  return (
    <div className="border-gray-a5 bg-panel flex h-[600px] flex-col overflow-hidden rounded-xl border shadow-sm">
      <BaseUiConversation>
        <BaseUiConversationContent>
          {messages.length === 0 ? (
            <div className="flex min-h-[440px] flex-col items-center justify-center gap-5 text-center">
              <div className="max-w-sm space-y-1">
                <p className="text-gray-12 text-ui-lg font-semibold">
                  How can I help?
                </p>
                <p className="text-gray-11 text-sm">
                  Responses stream in as Markdown — code, tables, and lists
                  render live.
                </p>
              </div>
              <BaseUiSuggestions className="justify-center">
                {CHAT_SUGGESTIONS.map((s) => (
                  <BaseUiSuggestion key={s} suggestion={s} onClick={send} />
                ))}
              </BaseUiSuggestions>
            </div>
          ) : (
            messages.map((msg) => (
              <BaseUiMessage key={msg.id} from={msg.role}>
                {msg.role === "assistant" && <BaseUiMessageAvatar name="AI" />}
                <BaseUiMessageContent>
                  {msg.role === "assistant" ? (
                    <div className="space-y-3">
                      {msg.reasoning ? (
                        <BaseUiReasoning
                          isStreaming={msg.reasoningStreaming}
                          duration={msg.duration}
                          defaultOpen
                        >
                          <BaseUiReasoningTrigger />
                          <BaseUiReasoningContent>
                            {msg.reasoning}
                          </BaseUiReasoningContent>
                        </BaseUiReasoning>
                      ) : null}
                      {msg.tool ? (
                        <BaseUiTool>
                          <BaseUiToolHeader
                            type="web_search"
                            state="output-available"
                          />
                          <BaseUiToolContent>
                            <BaseUiToolInput
                              input={{ query: "streaming markdown react" }}
                            />
                            <BaseUiToolOutput output="3 results · streamdown · prompt-kit · ai-sdk" />
                          </BaseUiToolContent>
                        </BaseUiTool>
                      ) : null}
                      <BaseUiResponse>{msg.content}</BaseUiResponse>
                    </div>
                  ) : (
                    msg.content
                  )}
                </BaseUiMessageContent>
              </BaseUiMessage>
            ))
          )}
          {status === "submitted" ? (
            <BaseUiMessage from="assistant">
              <BaseUiMessageAvatar name="AI" />
              <BaseUiMessageContent>
                <BaseUiLoader />
              </BaseUiMessageContent>
            </BaseUiMessage>
          ) : null}
        </BaseUiConversationContent>
        <BaseUiConversationScrollButton />
      </BaseUiConversation>

      <div className="border-gray-a5 border-t p-3">
        <BaseUiPromptInput onSubmit={send}>
          <BaseUiPromptInputTextarea placeholder="Ask anything…" />
          <BaseUiPromptInputToolbar>
            <BaseUiPromptInputTools>
              <BaseUiPromptInputButton>
                <Paperclip />
              </BaseUiPromptInputButton>
            </BaseUiPromptInputTools>
            <BaseUiPromptInputSubmit status={status} />
          </BaseUiPromptInputToolbar>
        </BaseUiPromptInput>
      </div>
    </div>
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
  const [showGrid, setShowGrid] = useState(true)
  const [density, setDensity] = useState<unknown>("comfortable")
  return (
    <BaseUiMenuTrigger>
      <BaseUiButton variant="outline" intent="secondary">
        Actions
      </BaseUiButton>
      <BaseUiMenuPopover className="min-w-52">
        <BaseUiMenu>
          <BaseUiMenuGroupLabel>Edit</BaseUiMenuGroupLabel>
          <BaseUiMenuItem onAction={() => {}}>
            Undo
            <BaseUiMenuShortcut>⌘Z</BaseUiMenuShortcut>
          </BaseUiMenuItem>
          <BaseUiMenuItem onAction={() => {}}>
            Redo
            <BaseUiMenuShortcut>⇧⌘Z</BaseUiMenuShortcut>
          </BaseUiMenuItem>

          <BaseUiMenuSub>
            <BaseUiMenuSubTrigger>Share</BaseUiMenuSubTrigger>
            <BaseUiMenuSubContent>
              <BaseUiMenu>
                <BaseUiMenuItem onAction={() => {}}>Copy link</BaseUiMenuItem>
                <BaseUiMenuItem onAction={() => {}}>Email</BaseUiMenuItem>
                <BaseUiMenuItem onAction={() => {}}>Embed</BaseUiMenuItem>
              </BaseUiMenu>
            </BaseUiMenuSubContent>
          </BaseUiMenuSub>

          <BaseUiMenuSeparator />

          <BaseUiMenuCheckboxItem
            checked={showGrid}
            onCheckedChange={setShowGrid}
          >
            Show grid
          </BaseUiMenuCheckboxItem>

          <BaseUiMenuSeparator />

          <BaseUiMenuGroupLabel>Density</BaseUiMenuGroupLabel>
          <BaseUiMenuRadioGroup value={density} onValueChange={setDensity}>
            <BaseUiMenuRadioItem value="comfortable">
              Comfortable
            </BaseUiMenuRadioItem>
            <BaseUiMenuRadioItem value="compact">Compact</BaseUiMenuRadioItem>
          </BaseUiMenuRadioGroup>

          <BaseUiMenuSeparator />
          <BaseUiMenuItem onAction={() => {}} className="text-error-11">
            Delete
          </BaseUiMenuItem>
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

const segmentOptions = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
]

function BaseUiSegmentedControlDemo() {
  const [val, setVal] = useState("week")
  return (
    <BaseUiSegmentedControl
      options={segmentOptions}
      value={val}
      onChange={setVal}
    />
  )
}

function UiSegmentedControlDemo() {
  const [val, setVal] = useState("week")
  return (
    <UiSegmentedControl
      options={segmentOptions}
      value={val}
      onChange={setVal}
    />
  )
}

function BaseUiToolbarDemo() {
  return (
    <BaseUiToolbar aria-label="Formatting">
      <BaseUiButton size="sm" variant="ghost" intent="secondary">
        Undo
      </BaseUiButton>
      <BaseUiButton size="sm" variant="ghost" intent="secondary">
        Redo
      </BaseUiButton>
      <BaseUiToolbarSeparator />
      <BaseUiToggle size="sm" aria-label="Bold" className="font-bold">
        B
      </BaseUiToggle>
      <BaseUiToggle size="sm" aria-label="Italic" className="italic">
        I
      </BaseUiToggle>
    </BaseUiToolbar>
  )
}

function UiToolbarDemo() {
  return (
    <UiToolbar aria-label="Formatting">
      <UiButton size="sm" variant="ghost" intent="secondary">
        Undo
      </UiButton>
      <UiButton size="sm" variant="ghost" intent="secondary">
        Redo
      </UiButton>
      <UiToolbarSeparator />
      <UiToggle size="sm" aria-label="Bold" className="font-bold">
        B
      </UiToggle>
      <UiToggle size="sm" aria-label="Italic" className="italic">
        I
      </UiToggle>
    </UiToolbar>
  )
}

function BaseUiInputDemo() {
  const [search, setSearch] = useState("")
  return (
    <div className="w-64 space-y-3">
      <BaseUiInput label="Email" placeholder="you@example.com" />
      <BaseUiPasswordInput label="Password" placeholder="••••••••" />
      <BaseUiTextArea label="Notes" placeholder="Write something…" />
      <BaseUiSearchInput
        placeholder="Search…"
        value={search}
        onChange={setSearch}
      />
    </div>
  )
}

function UiInputDemo() {
  const [search, setSearch] = useState("")
  return (
    <div className="w-64 space-y-3">
      <UiInput label="Email" placeholder="you@example.com" />
      <UiPasswordInput label="Password" placeholder="••••••••" />
      <UiTextArea label="Notes" placeholder="Write something…" />
      <UiSearchInput
        placeholder="Search…"
        value={search}
        onChange={setSearch}
      />
    </div>
  )
}

// Sample data for the DataTable showcase — a handful of campaigns, enough to
// exercise row selection, sortable headers, pagination, and column display
// settings without a lot of scaffolding.
interface DtRow {
  id: string
  campaign: string
  channel: string
  status: "active" | "pending" | "draft"
  reach: number
  updated: string
}

const dtStatus: Record<DtRow["status"], { label: string; className: string }> =
  {
    active: { label: "Active", className: "bg-success-a3 text-success-11" },
    pending: { label: "Pending", className: "bg-warning-a3 text-warning-11" },
    draft: { label: "Draft", className: "bg-gray-a3 text-gray-11" },
  }

const dtRows: DtRow[] = [
  { id: "1", campaign: "Spring Harvest Gala", channel: "Email · Social", status: "active", reach: 182_400, updated: "2h ago" }, // prettier-ignore
  { id: "2", campaign: "Clean Water Initiative", channel: "Display · Search", status: "active", reach: 96_210, updated: "5h ago" }, // prettier-ignore
  { id: "3", campaign: "Youth Mentorship Drive", channel: "Social", status: "pending", reach: 41_870, updated: "Yesterday" }, // prettier-ignore
  { id: "4", campaign: "Winter Coat Collection", channel: "Email", status: "draft", reach: 0, updated: "3d ago" }, // prettier-ignore
  { id: "5", campaign: "Community Garden Launch", channel: "Display", status: "active", reach: 58_330, updated: "1w ago" }, // prettier-ignore
]

// DataTableColumnHeader binds to its own package's table context, so each kit
// builds its columns with its OWN header component — hence a factory rather than
// a shared column array.
function makeDtColumns(
  ColumnHeader: ComponentType<{ column: Column<DtRow, unknown>; title: string }>
): ColumnDef<DtRow>[] {
  return [
    {
      accessorKey: "campaign",
      header: ({ column }) => <ColumnHeader column={column} title="Campaign" />,
      size: 260,
      minSize: 200,
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
      size: 130,
      cell: ({ row }) => {
        const s = dtStatus[row.original.status]
        return (
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${s.className}`}
          >
            {s.label}
          </span>
        )
      },
    },
    {
      accessorKey: "reach",
      header: ({ column }) => <ColumnHeader column={column} title="Reach" />,
      size: 120,
      cell: ({ row }) => (
        <span className="text-gray-12 text-sm font-semibold tabular-nums">
          {row.original.reach.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "updated",
      header: "Updated",
      size: 120,
      cell: ({ row }) => (
        <span className="text-gray-11 text-sm">{row.original.updated}</span>
      ),
    },
  ]
}

const baseUiDtColumns = makeDtColumns(BaseUiDataTableColumnHeader)
const uiDtColumns = makeDtColumns(UiDataTableColumnHeader)

// ── 9ui-parity component demos (no @workspace/ui counterpart; full-width) ──

function BaseUiBadgeDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <BaseUiBadge color="success" dot>
        Active
      </BaseUiBadge>
      <BaseUiBadge color="warning" dot>
        Pending
      </BaseUiBadge>
      <BaseUiBadge color="error" dot>
        Failed
      </BaseUiBadge>
      <BaseUiBadge color="info">Info</BaseUiBadge>
      <BaseUiBadge color="accent">Accent</BaseUiBadge>
      <BaseUiBadge color="gray">Neutral</BaseUiBadge>
      <BaseUiBadge color="success" size="sm">
        sm
      </BaseUiBadge>
      <BaseUiBadge color="success" size="lg">
        lg
      </BaseUiBadge>
    </div>
  )
}

function BaseUiCardDemo() {
  return (
    <BaseUiCard className="w-80">
      <BaseUiCardHeader>
        <BaseUiCardTitle>Monthly report</BaseUiCardTitle>
        <BaseUiCardDescription>
          Performance across every active campaign.
        </BaseUiCardDescription>
      </BaseUiCardHeader>
      <BaseUiCardContent>
        <p className="text-gray-11 text-sm">
          Reach is up 12% week over week, with email driving the largest share
          of new signups.
        </p>
      </BaseUiCardContent>
    </BaseUiCard>
  )
}

function BaseUiAlertDemo() {
  return (
    <div className="w-full max-w-lg space-y-3">
      <BaseUiAlert variant="info" icon={<Info />}>
        <BaseUiAlertTitle>Heads up</BaseUiAlertTitle>
        <BaseUiAlertDescription>
          A new billing cycle starts on the 1st.
        </BaseUiAlertDescription>
      </BaseUiAlert>
      <BaseUiAlert variant="success" icon={<CheckCircle2 />}>
        <BaseUiAlertTitle>Saved</BaseUiAlertTitle>
        <BaseUiAlertDescription>
          Your changes have been published.
        </BaseUiAlertDescription>
      </BaseUiAlert>
      <BaseUiAlert variant="error" icon={<AlertCircle />}>
        <BaseUiAlertTitle>Payment failed</BaseUiAlertTitle>
        <BaseUiAlertDescription>
          We couldn&apos;t charge your card. Update it to continue.
        </BaseUiAlertDescription>
      </BaseUiAlert>
    </div>
  )
}

function BaseUiKbdDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <span className="flex items-center gap-1">
        <BaseUiKbd>⌘</BaseUiKbd>
        <BaseUiKbd>K</BaseUiKbd>
      </span>
      <span className="flex items-center gap-1">
        <BaseUiKbd>⇧</BaseUiKbd>
        <BaseUiKbd>⌘</BaseUiKbd>
        <BaseUiKbd>P</BaseUiKbd>
      </span>
      <BaseUiKbd>Esc</BaseUiKbd>
    </div>
  )
}

function BaseUiSkeletonDemo() {
  return (
    <div className="flex w-72 items-center gap-3">
      <BaseUiSkeleton className="size-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <BaseUiSkeleton className="h-4 w-3/4" />
        <BaseUiSkeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}

function BaseUiAspectRatioDemo() {
  return (
    <div className="w-72">
      <BaseUiAspectRatio ratio={16 / 9} className="rounded-lg">
        <div className="from-accent-9 to-accent-11 flex h-full w-full items-center justify-center bg-gradient-to-br text-sm font-semibold text-white">
          16 / 9
        </div>
      </BaseUiAspectRatio>
    </div>
  )
}

const selectFruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "grape", label: "Grape" },
]

function BaseUiSelectDemo() {
  // Base UI Select emits string | null (null when cleared), so widen the state.
  const [value, setValue] = useState<string | null>("apple")
  return (
    <div className="w-64">
      <BaseUiSelect value={value} onValueChange={setValue}>
        <BaseUiSelectTrigger placeholder="Pick a fruit" />
        <BaseUiSelectContent>
          <BaseUiSelectGroup>
            <BaseUiSelectGroupLabel>Fruit</BaseUiSelectGroupLabel>
            {selectFruits.map((f) => (
              <BaseUiSelectItem key={f.value} value={f.value}>
                {f.label}
              </BaseUiSelectItem>
            ))}
          </BaseUiSelectGroup>
          <BaseUiSelectSeparator />
          <BaseUiSelectItem value="none">No preference</BaseUiSelectItem>
        </BaseUiSelectContent>
      </BaseUiSelect>
    </div>
  )
}

const comboFrameworks: BaseUiComboboxOption[] = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "nuxt", label: "Nuxt" },
  { value: "svelte", label: "SvelteKit" },
]

function BaseUiComboboxDemo() {
  const [value, setValue] = useState<BaseUiComboboxOption | null>(null)
  return (
    <div className="w-64">
      <BaseUiCombobox
        items={comboFrameworks}
        value={value}
        onValueChange={setValue}
        placeholder="Pick a framework"
      >
        <BaseUiComboboxTrigger />
        <BaseUiComboboxContent
          searchPlaceholder="Search frameworks…"
          emptyMessage="No frameworks"
        >
          {(item) => <BaseUiComboboxItem key={item.value} item={item} />}
        </BaseUiComboboxContent>
      </BaseUiCombobox>
    </div>
  )
}

const autoFruits = [
  "Apple",
  "Apricot",
  "Banana",
  "Blueberry",
  "Cherry",
  "Grape",
  "Mango",
  "Orange",
]

function BaseUiAutocompleteDemo() {
  const [value, setValue] = useState("")
  return (
    <div className="w-64">
      <BaseUiAutocomplete
        items={autoFruits}
        value={value}
        onValueChange={setValue}
      >
        <BaseUiAutocompleteInput placeholder="Search fruit…" />
        <BaseUiAutocompleteContent emptyMessage="No matches">
          {(item) => <BaseUiAutocompleteItem key={item} value={item} />}
        </BaseUiAutocompleteContent>
      </BaseUiAutocomplete>
    </div>
  )
}

function BaseUiToggleGroupDemo() {
  const [align, setAlign] = useState<string[]>(["left"])
  return (
    <BaseUiToggleGroupRoot value={align} onValueChange={setAlign}>
      <BaseUiToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft />
      </BaseUiToggleGroupItem>
      <BaseUiToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter />
      </BaseUiToggleGroupItem>
      <BaseUiToggleGroupItem value="right" aria-label="Align right">
        <AlignRight />
      </BaseUiToggleGroupItem>
    </BaseUiToggleGroupRoot>
  )
}

function BaseUiCheckboxGroupDemo() {
  const [value, setValue] = useState<string[]>(["read"])
  return (
    <BaseUiCheckboxGroup
      value={value}
      onValueChange={setValue}
      label="Permissions"
      description="Choose what this role can do."
    >
      <BaseUiCheckboxGroupItem value="read">Read</BaseUiCheckboxGroupItem>
      <BaseUiCheckboxGroupItem value="write">Write</BaseUiCheckboxGroupItem>
      <BaseUiCheckboxGroupItem value="delete">Delete</BaseUiCheckboxGroupItem>
    </BaseUiCheckboxGroup>
  )
}

function BaseUiAlertDialogDemo() {
  return (
    <BaseUiAlertDialog>
      <BaseUiAlertDialogTrigger>
        <BaseUiButton variant="outline" intent="danger">
          Delete project
        </BaseUiButton>
      </BaseUiAlertDialogTrigger>
      <BaseUiAlertDialogContent>
        <BaseUiAlertDialogHeader>
          <BaseUiAlertDialogTitle>Delete project?</BaseUiAlertDialogTitle>
          <BaseUiAlertDialogDescription>
            This permanently removes the project and all of its campaigns. This
            action cannot be undone.
          </BaseUiAlertDialogDescription>
        </BaseUiAlertDialogHeader>
        <BaseUiAlertDialogFooter>
          <BaseUiAlertDialogCancel>Cancel</BaseUiAlertDialogCancel>
          <BaseUiAlertDialogAction intent="danger">
            Delete
          </BaseUiAlertDialogAction>
        </BaseUiAlertDialogFooter>
      </BaseUiAlertDialogContent>
    </BaseUiAlertDialog>
  )
}

function BaseUiPreviewCardDemo() {
  return (
    <p className="text-gray-11 text-sm">
      Created by&nbsp;
      <BaseUiPreviewCard>
        <BaseUiPreviewCardTrigger>
          <a
            href="#"
            className="text-accent-11 font-medium underline-offset-2 hover:underline"
          >
            @ada
          </a>
        </BaseUiPreviewCardTrigger>
        <BaseUiPreviewCardContent>
          <div className="flex items-center gap-3">
            <BaseUiAvatar>
              <BaseUiAvatarFallback>AL</BaseUiAvatarFallback>
            </BaseUiAvatar>
            <div>
              <div className="text-gray-12 text-sm font-semibold">
                Ada Lovelace
              </div>
              <div className="text-gray-10 text-xs">@ada · Engineering</div>
            </div>
          </div>
          <p className="text-gray-11 mt-3 text-sm">
            Building the analytics pipeline. The card reveals on hover after a
            short delay.
          </p>
        </BaseUiPreviewCardContent>
      </BaseUiPreviewCard>
    </p>
  )
}

function BaseUiContextMenuDemo() {
  const [bookmarks, setBookmarks] = useState(true)
  return (
    <BaseUiContextMenu>
      <BaseUiContextMenuTrigger className="border-gray-a5 text-gray-11 flex h-28 w-full max-w-md items-center justify-center rounded-lg border border-dashed text-sm select-none">
        Right-click anywhere in this box
      </BaseUiContextMenuTrigger>
      <BaseUiContextMenuContent>
        <BaseUiContextMenuItem onAction={() => {}}>
          Back
          <BaseUiContextMenuShortcut>⌘[</BaseUiContextMenuShortcut>
        </BaseUiContextMenuItem>
        <BaseUiContextMenuItem onAction={() => {}}>
          Forward
          <BaseUiContextMenuShortcut>⌘]</BaseUiContextMenuShortcut>
        </BaseUiContextMenuItem>
        <BaseUiContextMenuSeparator />
        <BaseUiContextMenuCheckboxItem
          checked={bookmarks}
          onCheckedChange={setBookmarks}
        >
          Show bookmarks bar
        </BaseUiContextMenuCheckboxItem>
        <BaseUiContextMenuSeparator />
        <BaseUiContextMenuSub>
          <BaseUiContextMenuSubTrigger>More tools</BaseUiContextMenuSubTrigger>
          <BaseUiContextMenuSubContent>
            <BaseUiContextMenuItem onAction={() => {}}>
              Save page as…
            </BaseUiContextMenuItem>
            <BaseUiContextMenuItem onAction={() => {}}>
              Developer tools
            </BaseUiContextMenuItem>
          </BaseUiContextMenuSubContent>
        </BaseUiContextMenuSub>
      </BaseUiContextMenuContent>
    </BaseUiContextMenu>
  )
}

function BaseUiMenubarDemo() {
  return (
    <BaseUiMenubar>
      <BaseUiMenubarMenu>
        <BaseUiMenubarTrigger>File</BaseUiMenubarTrigger>
        <BaseUiMenubarContent>
          <BaseUiMenubarItem>
            New Tab
            <BaseUiMenubarShortcut>⌘T</BaseUiMenubarShortcut>
          </BaseUiMenubarItem>
          <BaseUiMenubarItem>
            New Window
            <BaseUiMenubarShortcut>⌘N</BaseUiMenubarShortcut>
          </BaseUiMenubarItem>
          <BaseUiMenubarSeparator />
          <BaseUiMenubarSub>
            <BaseUiMenubarSubTrigger>Share</BaseUiMenubarSubTrigger>
            <BaseUiMenubarSubContent>
              <BaseUiMenubarItem>Email link</BaseUiMenubarItem>
              <BaseUiMenubarItem>Copy link</BaseUiMenubarItem>
            </BaseUiMenubarSubContent>
          </BaseUiMenubarSub>
          <BaseUiMenubarSeparator />
          <BaseUiMenubarItem>
            Print…
            <BaseUiMenubarShortcut>⌘P</BaseUiMenubarShortcut>
          </BaseUiMenubarItem>
        </BaseUiMenubarContent>
      </BaseUiMenubarMenu>
      <BaseUiMenubarMenu>
        <BaseUiMenubarTrigger>Edit</BaseUiMenubarTrigger>
        <BaseUiMenubarContent>
          <BaseUiMenubarItem>Undo</BaseUiMenubarItem>
          <BaseUiMenubarItem>Redo</BaseUiMenubarItem>
          <BaseUiMenubarSeparator />
          <BaseUiMenubarItem>Cut</BaseUiMenubarItem>
          <BaseUiMenubarItem>Copy</BaseUiMenubarItem>
          <BaseUiMenubarItem>Paste</BaseUiMenubarItem>
        </BaseUiMenubarContent>
      </BaseUiMenubarMenu>
      <BaseUiMenubarMenu>
        <BaseUiMenubarTrigger>View</BaseUiMenubarTrigger>
        <BaseUiMenubarContent>
          <BaseUiMenubarItem>Zoom in</BaseUiMenubarItem>
          <BaseUiMenubarItem>Zoom out</BaseUiMenubarItem>
          <BaseUiMenubarSeparator />
          <BaseUiMenubarItem>Reload</BaseUiMenubarItem>
        </BaseUiMenubarContent>
      </BaseUiMenubarMenu>
    </BaseUiMenubar>
  )
}

function BaseUiNavigationMenuDemo() {
  return (
    <BaseUiNavigationMenu>
      <BaseUiNavigationMenuItem>
        <BaseUiNavigationMenuTrigger>Products</BaseUiNavigationMenuTrigger>
        <BaseUiNavigationMenuContent>
          <div className="grid w-64 gap-1">
            <BaseUiNavigationMenuLink
              href="#"
              title="Analytics"
              description="Track reach and conversions in real time."
            />
            <BaseUiNavigationMenuLink
              href="#"
              title="Campaigns"
              description="Plan and schedule multi-channel sends."
            />
            <BaseUiNavigationMenuLink
              href="#"
              title="Audiences"
              description="Segment contacts by behavior."
            />
          </div>
        </BaseUiNavigationMenuContent>
      </BaseUiNavigationMenuItem>
      <BaseUiNavigationMenuItem>
        <BaseUiNavigationMenuTrigger>Resources</BaseUiNavigationMenuTrigger>
        <BaseUiNavigationMenuContent>
          <div className="grid w-56 gap-1">
            <BaseUiNavigationMenuLink
              href="#"
              title="Docs"
              description="Guides and API reference."
            />
            <BaseUiNavigationMenuLink
              href="#"
              title="Blog"
              description="Product news and tips."
            />
            <BaseUiNavigationMenuLink
              href="#"
              title="Support"
              description="Reach the team directly."
            />
          </div>
        </BaseUiNavigationMenuContent>
      </BaseUiNavigationMenuItem>
      <BaseUiNavigationMenuViewport />
    </BaseUiNavigationMenu>
  )
}

function BaseUiToastDemo() {
  return (
    <BaseUiToastProvider>
      <BaseUiButton
        variant="outline"
        intent="secondary"
        onClick={() =>
          baseUiToast.success("Saved", {
            description: "Your changes have been saved.",
          })
        }
      >
        Show toast
      </BaseUiButton>
    </BaseUiToastProvider>
  )
}

function BaseUiConfirmDialogDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <BaseUiButton
        variant="outline"
        intent="secondary"
        onClick={() =>
          baseUiConfirm({
            title: "Publish changes?",
            description: "This will make your edits visible to everyone.",
            continueText: "Publish",
          })
        }
      >
        Confirm
      </BaseUiButton>
      <BaseUiButton
        variant="outline"
        intent="danger"
        onClick={() =>
          baseUiConfirm({
            title: "Delete project?",
            description: "This action cannot be undone.",
            continueText: "Delete",
            intent: "danger",
          })
        }
      >
        Danger
      </BaseUiButton>
      <BaseUiButton
        variant="outline"
        intent="secondary"
        onClick={() =>
          baseUiConfirm({
            title: "Save changes?",
            description: "We'll sync your work to the server before closing.",
            continueText: "Save",
            onContinue: async () => {
              await new Promise((resolve) => setTimeout(resolve, 1200))
            },
          })
        }
      >
        Async
      </BaseUiButton>
    </div>
  )
}

function BaseUiBreadcrumbsDemo() {
  return (
    <BaseUiBreadcrumbs>
      <BaseUiBreadcrumbItem>
        <BaseUiBreadcrumbLink href="#">Home</BaseUiBreadcrumbLink>
      </BaseUiBreadcrumbItem>
      <BaseUiBreadcrumbSeparator />
      <BaseUiBreadcrumbItem>
        <BaseUiBreadcrumbEllipsis />
      </BaseUiBreadcrumbItem>
      <BaseUiBreadcrumbSeparator />
      <BaseUiBreadcrumbItem>
        <BaseUiBreadcrumbLink href="#">Projects</BaseUiBreadcrumbLink>
      </BaseUiBreadcrumbItem>
      <BaseUiBreadcrumbSeparator />
      <BaseUiBreadcrumbItem>
        <BaseUiBreadcrumbPage>Settings</BaseUiBreadcrumbPage>
      </BaseUiBreadcrumbItem>
    </BaseUiBreadcrumbs>
  )
}

function BaseUiPaginationDemo() {
  return (
    <BaseUiPagination>
      <BaseUiPaginationContent>
        <BaseUiPaginationItem>
          <BaseUiPaginationPrevious href="#" />
        </BaseUiPaginationItem>
        <BaseUiPaginationItem>
          <BaseUiPaginationLink href="#">1</BaseUiPaginationLink>
        </BaseUiPaginationItem>
        <BaseUiPaginationItem>
          <BaseUiPaginationLink href="#" isActive>
            2
          </BaseUiPaginationLink>
        </BaseUiPaginationItem>
        <BaseUiPaginationItem>
          <BaseUiPaginationLink href="#">3</BaseUiPaginationLink>
        </BaseUiPaginationItem>
        <BaseUiPaginationItem>
          <BaseUiPaginationEllipsis />
        </BaseUiPaginationItem>
        <BaseUiPaginationItem>
          <BaseUiPaginationLink href="#">10</BaseUiPaginationLink>
        </BaseUiPaginationItem>
        <BaseUiPaginationItem>
          <BaseUiPaginationNext href="#" />
        </BaseUiPaginationItem>
      </BaseUiPaginationContent>
    </BaseUiPagination>
  )
}

function BaseUiDatePickerDemo() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [range, setRange] = useState<BaseUiDateRange | undefined>(undefined)
  return (
    <div className="flex flex-wrap gap-3">
      <div className="w-56">
        <BaseUiDatePicker value={date} onChange={setDate} />
      </div>
      <div className="w-64">
        <BaseUiDateRangePicker value={range} onChange={setRange} />
      </div>
    </div>
  )
}

// ── group ④: data & advanced ──

// Command — a ⌘K palette (Base UI Dialog + Combobox). Grouped actions filter as
// you type; ⌘K toggles it open, the familiar command-menu shortcut.
function BaseUiCommandDemo() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  const dismiss = () => setOpen(false)

  return (
    <>
      <BaseUiButton
        variant="outline"
        intent="secondary"
        onClick={() => setOpen(true)}
      >
        Open command menu
        <BaseUiKbd className="ml-2">⌘K</BaseUiKbd>
      </BaseUiButton>
      <BaseUiCommandDialog open={open} onOpenChange={setOpen}>
        <BaseUiCommandInput placeholder="Type a command or search…" />
        <BaseUiCommandList>
          <BaseUiCommandEmpty>No results found.</BaseUiCommandEmpty>
          <BaseUiCommandGroup heading="Suggestions">
            <BaseUiCommandItem value="Create campaign" onSelect={dismiss}>
              <Megaphone />
              Create campaign
              <BaseUiCommandShortcut>⌘N</BaseUiCommandShortcut>
            </BaseUiCommandItem>
            <BaseUiCommandItem value="View analytics" onSelect={dismiss}>
              <ChartLine />
              View analytics
            </BaseUiCommandItem>
            <BaseUiCommandItem value="Invite teammate" onSelect={dismiss}>
              <UserRound />
              Invite teammate
            </BaseUiCommandItem>
          </BaseUiCommandGroup>
          <BaseUiCommandSeparator />
          <BaseUiCommandGroup heading="Settings">
            <BaseUiCommandItem value="Billing" onSelect={dismiss}>
              <CreditCard />
              Billing
            </BaseUiCommandItem>
            <BaseUiCommandItem value="Preferences" onSelect={dismiss}>
              <Settings />
              Preferences
              <BaseUiCommandShortcut>⌘,</BaseUiCommandShortcut>
            </BaseUiCommandItem>
          </BaseUiCommandGroup>
        </BaseUiCommandList>
      </BaseUiCommandDialog>
    </>
  )
}

// Chart — recharts themed to WDS. `config` names each series and feeds the
// per-series --color-* vars the Area strokes/fills reference.
const CHART_DATA = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 173, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 264, mobile: 140 },
]

const CHART_CONFIG: BaseUiChartConfig = {
  desktop: { label: "Desktop", color: "var(--accent-9)" },
  mobile: { label: "Mobile", color: "var(--grass-9)" },
}

function BaseUiChartDemo() {
  return (
    <div className="border-gray-a5 bg-panel max-w-xl rounded-xl border p-4 shadow-sm">
      <div className="mb-2 px-1">
        <div className="text-gray-12 text-sm font-semibold">Visitors</div>
        <div className="text-gray-10 text-xs">
          Desktop vs. mobile · last 6 months
        </div>
      </div>
      <BaseUiChartContainer config={CHART_CONFIG}>
        <AreaChart data={CHART_DATA} margin={{ left: 4, right: 8, top: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <BaseUiChartTooltip content={<BaseUiChartTooltipContent />} />
          <BaseUiChartLegend content={<BaseUiChartLegendContent />} />
          <Area
            dataKey="mobile"
            type="natural"
            stackId="a"
            stroke="var(--color-mobile)"
            fill="var(--color-mobile)"
            fillOpacity={0.4}
          />
          <Area
            dataKey="desktop"
            type="natural"
            stackId="a"
            stroke="var(--color-desktop)"
            fill="var(--color-desktop)"
            fillOpacity={0.4}
          />
        </AreaChart>
      </BaseUiChartContainer>
    </div>
  )
}

// Kanban — dnd-kit board, fully controlled: onColumnsChange hands back the next
// columns array on every drag, so persisting it to state makes the move stick.
const INITIAL_KANBAN: BaseUiKanbanColumnData[] = [
  {
    id: "backlog",
    title: "Backlog",
    cards: [
      { id: "k1", title: "Draft Q3 campaign brief" },
      { id: "k2", title: "Audit landing-page copy" },
      { id: "k3", title: "Collect customer testimonials" },
    ],
  },
  {
    id: "in-progress",
    title: "In progress",
    cards: [
      { id: "k4", title: "Design email templates" },
      { id: "k5", title: "Wire up analytics events" },
    ],
  },
  {
    id: "done",
    title: "Done",
    cards: [{ id: "k6", title: "Finalize the media budget" }],
  },
]

function BaseUiKanbanDemo() {
  const [columns, setColumns] =
    useState<BaseUiKanbanColumnData[]>(INITIAL_KANBAN)
  return <BaseUiKanbanBoard columns={columns} onColumnsChange={setColumns} />
}

// Tree — data-driven file tree. Folders are Base UI Collapsibles; leaves are
// selectable rows with controlled selection.
const TREE_DATA: BaseUiTreeNode[] = [
  {
    id: "src",
    label: "src",
    children: [
      {
        id: "components",
        label: "components",
        children: [
          { id: "button", label: "Button.tsx" },
          { id: "input", label: "Input.tsx" },
          { id: "card", label: "Card.tsx" },
        ],
      },
      { id: "app", label: "App.tsx" },
      { id: "main", label: "main.tsx" },
    ],
  },
  { id: "package", label: "package.json" },
  { id: "readme", label: "README.md" },
]

function BaseUiTreeDemo() {
  const [selectedId, setSelectedId] = useState("button")
  return (
    <BaseUiTreeView
      data={TREE_DATA}
      selectedId={selectedId}
      onSelect={(node) => setSelectedId(node.id)}
      defaultExpandedIds={["src", "components"]}
      className="border-gray-a5 bg-panel w-64 rounded-lg border p-2"
    />
  )
}

// Timeline — activity feed. `status` on each item tints its dot; the connector
// draws the rail between them.
function BaseUiTimelineDemo() {
  return (
    <BaseUiTimeline className="max-w-md">
      <BaseUiTimelineItem status="done">
        <BaseUiTimelineDot />
        <BaseUiTimelineConnector />
        <BaseUiTimelineContent>
          <BaseUiTimelineTitle>Account created</BaseUiTimelineTitle>
          <BaseUiTimelineTime>Mon · 9:14 AM</BaseUiTimelineTime>
          <BaseUiTimelineDescription>
            Workspace provisioned and the team invites went out.
          </BaseUiTimelineDescription>
        </BaseUiTimelineContent>
      </BaseUiTimelineItem>
      <BaseUiTimelineItem status="done">
        <BaseUiTimelineDot />
        <BaseUiTimelineConnector />
        <BaseUiTimelineContent>
          <BaseUiTimelineTitle>Email verified</BaseUiTimelineTitle>
          <BaseUiTimelineTime>Mon · 9:20 AM</BaseUiTimelineTime>
        </BaseUiTimelineContent>
      </BaseUiTimelineItem>
      <BaseUiTimelineItem status="current">
        <BaseUiTimelineDot />
        <BaseUiTimelineConnector />
        <BaseUiTimelineContent>
          <BaseUiTimelineTitle>Uploading assets</BaseUiTimelineTitle>
          <BaseUiTimelineTime>Now</BaseUiTimelineTime>
          <BaseUiTimelineDescription>
            3 of 8 files transferred to the media library.
          </BaseUiTimelineDescription>
        </BaseUiTimelineContent>
      </BaseUiTimelineItem>
      <BaseUiTimelineItem status="pending">
        <BaseUiTimelineDot />
        <BaseUiTimelineConnector />
        <BaseUiTimelineContent>
          <BaseUiTimelineTitle>Review &amp; publish</BaseUiTimelineTitle>
          <BaseUiTimelineTime>Up next</BaseUiTimelineTime>
        </BaseUiTimelineContent>
      </BaseUiTimelineItem>
    </BaseUiTimeline>
  )
}

// InputOTP — one-time-code field on input-otp; a controlled 6-digit value.
function BaseUiInputOTPDemo() {
  const [otp, setOtp] = useState("")
  return (
    <div className="space-y-2">
      <BaseUiInputOTP maxLength={6} value={otp} onChange={setOtp} />
      <p className="text-gray-10 text-xs">
        Entered:&nbsp;
        <span className="text-gray-12 tabular-nums">{otp || "—"}</span>
      </p>
    </div>
  )
}

// FileUpload — a dropzone that hands picked files back through onFiles; the
// caller owns the list (here, appended to state and removable).
function BaseUiFileUploadDemo() {
  const [files, setFiles] = useState<File[]>([])
  return (
    <div className="max-w-md">
      <BaseUiFileUpload
        multiple
        onFiles={(picked) => setFiles((prev) => [...prev, ...picked])}
      />
      {files.length > 0 ? (
        <BaseUiFileUploadList>
          {files.map((file, index) => (
            <BaseUiFileUploadItem
              key={`${file.name}-${index}`}
              name={file.name}
              size={file.size}
              onRemove={() =>
                setFiles((prev) => prev.filter((_, i) => i !== index))
              }
            />
          ))}
        </BaseUiFileUploadList>
      ) : null}
    </div>
  )
}

// Form — Base UI Form / Fieldset / Field. The control wires to its label,
// description, and error; Base UI v1.2.0 has no Form.Root, so <Form> is the form
// element and submission runs through native onSubmit.
function BaseUiFormDemo() {
  return (
    <BaseUiForm className="max-w-sm" onSubmit={(event) => event.preventDefault()}>
      <BaseUiFieldset>
        <BaseUiFieldsetLegend>Newsletter</BaseUiFieldsetLegend>
        <BaseUiField name="email">
          <BaseUiFieldLabel>Email</BaseUiFieldLabel>
          <BaseUiFieldControl
            type="email"
            required
            placeholder="you@example.com"
          />
          <BaseUiFieldDescription>
            We&apos;ll send a confirmation to this address.
          </BaseUiFieldDescription>
          <BaseUiFieldError />
        </BaseUiField>
      </BaseUiFieldset>
      <BaseUiButton type="submit">Subscribe</BaseUiButton>
    </BaseUiForm>
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
          title="Input"
          meta="Base UI Field Root/Label/Control · text / password / textarea / search"
          baseui={<BaseUiInputDemo />}
          ui={<UiInputDemo />}
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
          title="SegmentedControl"
          meta="Base UI ToggleGroup (single-select) · pick-one pill switcher · arrow-key nav"
          baseui={<BaseUiSegmentedControlDemo />}
          ui={<UiSegmentedControlDemo />}
        />

        <Compare
          title="Toolbar"
          meta="Base UI Toolbar Root/Separator · control tray · roving arrow-key focus"
          baseui={<BaseUiToolbarDemo />}
          ui={<UiToolbarDemo />}
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
          meta="Base UI menu · full anatomy: submenu · checkbox · radio group · group label · shortcut · arrow-key nav (ui side is the drop-in core)"
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

        <Compare
          title="Calendar"
          meta="react-day-picker · single + range · month/year dropdowns · WDS skin (accent selection, accent-4 range) · ui kit ships a single-date EgCalendar only"
          baseui={<BaseUiCalendarDemo />}
          ui={<UiCalendarDemo />}
        />

        {/* Sidebar / DashboardLayout — framed so the docked rail (collapse) and
            folder tree show without the full-page layout taking over. */}
        <section className="border-gray-a4 border-t py-7">
          <header className="mb-4 flex flex-col gap-1">
            <h2 className="text-gray-12 text-ui-lg font-semibold">
              Sidebar &amp; DashboardLayout
            </h2>
            <span className="text-gray-10 text-ui-sm">
              Collapsible folders + ScrollArea + Button-tooltip rail · collapses
              to a 64px icon rail (click the panel button) · plain &lt;a&gt;
              links, routing via renderLink/asChild · DashboardLayout composes
              this full-page
            </span>
          </header>
          <div>
            <div className="text-gray-10 text-eyebrow mb-3 uppercase">
              base-ui
            </div>
            <BaseUiSidebarDemo />
          </div>
        </section>

        {/* ── group ④: data & advanced ── */}
        {/* Newly-added Base UI data/advanced components with no @workspace/ui
            counterpart, so each is shown full-width on the base-ui kit only. */}

        <BaseUiSection
          title="Command"
          meta="Base UI Dialog + Combobox · ⌘K palette · grouped actions filter as you type · shortcuts"
        >
          <BaseUiCommandDemo />
        </BaseUiSection>

        <BaseUiSection
          title="Chart"
          meta="recharts themed to WDS · per-series config drives the --color-* vars · stacked AreaChart + grid + tooltip + legend"
        >
          <BaseUiChartDemo />
        </BaseUiSection>

        <BaseUiSection
          title="Kanban"
          meta="dnd-kit board · drag cards within and across columns · fully controlled via onColumnsChange"
        >
          <BaseUiKanbanDemo />
        </BaseUiSection>

        <BaseUiSection
          title="Tree"
          meta="data-driven file tree · Collapsible folders + selectable leaves · controlled selection"
        >
          <BaseUiTreeDemo />
        </BaseUiSection>

        <BaseUiSection
          title="Timeline"
          meta="activity feed · status dots (done / current / pending) on a hairline rail"
        >
          <BaseUiTimelineDemo />
        </BaseUiSection>

        <BaseUiSection
          title="InputOTP"
          meta="one-time-code field on input-otp · 6 boxed cells with a blinking caret"
        >
          <BaseUiInputOTPDemo />
        </BaseUiSection>

        <BaseUiSection
          title="FileUpload"
          meta="dashed dropzone · drag-and-drop or click to browse · picked files listed with remove"
        >
          <BaseUiFileUploadDemo />
        </BaseUiSection>

        <BaseUiSection
          title="Form"
          meta="Base UI Form / Fieldset / Field · label + control + description + native validation error"
        >
          <BaseUiFormDemo />
        </BaseUiSection>

        {/* ── AI / Chat kit ── */}
        <section className="border-gray-a4 border-t py-7">
          <header className="mb-4 flex flex-col gap-1">
            <h2 className="text-gray-12 text-ui-lg flex items-center gap-2 font-semibold">
              <Sparkles className="text-accent-11 size-4" /> AI / Chat kit
            </h2>
            <span className="text-gray-10 text-ui-sm">
              streamdown Response (streaming Markdown + shiki code) ·
              Conversation (stick-to-bottom) · Message · PromptInput · Reasoning
              · Tool · Suggestions · Loader — send a message to watch it stream
            </span>
          </header>
          <div>
            <div className="text-gray-10 text-eyebrow mb-3 uppercase">
              base-ui
            </div>
            <div className="mx-auto max-w-2xl">
              <BaseUiChatDemo />
            </div>
          </div>
        </section>

        {/* ── 9ui-parity components ── */}
        {/* Newly-added Base UI components with no @workspace/ui counterpart, so
            each is shown full-width on the base-ui kit only. */}

        <BaseUiSection
          title="Badge"
          meta="styled span · status colors + optional leading dot · sm / md / lg"
        >
          <BaseUiBadgeDemo />
        </BaseUiSection>

        <BaseUiSection
          title="Card"
          meta="Card / Header / Title / Description / Content · white paper surface"
        >
          <BaseUiCardDemo />
        </BaseUiSection>

        <BaseUiSection
          title="Alert"
          meta="inline callout · info / success / error variants with a leading icon"
        >
          <BaseUiAlertDemo />
        </BaseUiSection>

        <BaseUiSection
          title="Kbd"
          meta="keyboard cap · string several together for a shortcut"
        >
          <BaseUiKbdDemo />
        </BaseUiSection>

        <BaseUiSection
          title="Skeleton"
          meta="pulsing loading placeholder · size with width/height utilities"
        >
          <BaseUiSkeletonDemo />
        </BaseUiSection>

        <BaseUiSection
          title="AspectRatio"
          meta="native CSS aspect-ratio · 16 / 9 box"
        >
          <BaseUiAspectRatioDemo />
        </BaseUiSection>

        <BaseUiSection
          title="Select"
          meta="Base UI Select · Trigger / Content / Item / Group / GroupLabel / Separator · single-select"
        >
          <BaseUiSelectDemo />
        </BaseUiSection>

        <BaseUiSection
          title="Combobox"
          meta="Base UI Combobox · trigger + in-popup search · object items matched by value"
        >
          <BaseUiComboboxDemo />
        </BaseUiSection>

        <BaseUiSection
          title="Autocomplete"
          meta="Base UI Autocomplete · free-text input + suggestions · value is the typed string"
        >
          <BaseUiAutocompleteDemo />
        </BaseUiSection>

        <BaseUiSection
          title="ToggleGroup"
          meta="Base UI ToggleGroup + Toggle · single-select icon row · data-pressed"
        >
          <BaseUiToggleGroupDemo />
        </BaseUiSection>

        <BaseUiSection
          title="CheckboxGroup"
          meta="Base UI checkbox-group · shared array value · label + description"
        >
          <BaseUiCheckboxGroupDemo />
        </BaseUiSection>

        <BaseUiSection
          title="AlertDialog"
          meta="Base UI alert-dialog · modal confirm · no outside-click / Esc dismissal · Cancel / Action"
        >
          <BaseUiAlertDialogDemo />
        </BaseUiSection>

        <BaseUiSection
          title="PreviewCard"
          meta="Base UI preview-card · hover a link to reveal a floating card after a short delay"
        >
          <BaseUiPreviewCardDemo />
        </BaseUiSection>

        <BaseUiSection
          title="ContextMenu"
          meta="Base UI context-menu · right-click target · checkbox item + submenu + shortcut"
        >
          <BaseUiContextMenuDemo />
        </BaseUiSection>

        <BaseUiSection
          title="Menubar"
          meta="Base UI Menubar + Menu · File / Edit / View · dropdowns, submenu, shortcuts"
        >
          <BaseUiMenubarDemo />
        </BaseUiSection>

        <BaseUiSection
          title="NavigationMenu"
          meta="Base UI navigation-menu · dropdown link panels moved into one shared Viewport"
        >
          <BaseUiNavigationMenuDemo />
        </BaseUiSection>

        <BaseUiSection
          title="Toast"
          meta="Base UI toast · ToastProvider + global toast helper · fires a status card top-right"
        >
          <BaseUiToastDemo />
        </BaseUiSection>

        <BaseUiSection
          title="ConfirmDialog"
          meta="imperative confirm() · primary / danger intent · async keeps a pending spinner · non-dismissable by default"
        >
          <BaseUiConfirmDialogDemo />
        </BaseUiSection>

        <BaseUiSection
          title="Breadcrumbs"
          meta="semantic nav > ol · link / ellipsis / current page · chevron separators"
        >
          <BaseUiBreadcrumbsDemo />
        </BaseUiSection>

        <BaseUiSection
          title="Pagination"
          meta="semantic nav > ul on buttonVariants · prev / numbers / active / ellipsis / next"
        >
          <BaseUiPaginationDemo />
        </BaseUiSection>

        <BaseUiSection
          title="DatePicker"
          meta="Popover + Calendar · single date (commits on click) + range (drafts, commits on Apply)"
        >
          <BaseUiDatePickerDemo />
        </BaseUiSection>

        {/* Filter is a composite with no ui-side demo, so it's shown full-width
            on the base-ui kit only. */}
        <section className="border-gray-a4 border-t py-7">
          <header className="mb-4 flex flex-col gap-1">
            <h2 className="text-gray-12 text-ui-lg font-semibold">Filter</h2>
            <span className="text-gray-10 text-ui-sm">
              Base UI Menu submenu picker + Combobox (search / multi-select) +
              Popover + the new Calendar · add filters from the funnel, then
              edit or remove the row chips
            </span>
          </header>
          <div>
            <div className="text-gray-10 text-eyebrow mb-3 uppercase">
              base-ui
            </div>
            <BaseUiFilterDemo />
          </div>
        </section>

        {/* DataTable is a wide composite, so it's stacked full-width (base-ui
            above ui) rather than squeezed into the two-column Compare grid. */}
        <section className="border-gray-a4 border-t py-7">
          <header className="mb-4 flex flex-col gap-1">
            <h2 className="text-gray-12 text-ui-lg font-semibold">DataTable</h2>
            <span className="text-gray-10 text-ui-sm">
              TanStack Table · selection / sortable headers / pagination /
              column display-settings · base-ui primitives (Checkbox, Button,
              Popover, Switch, ScrollArea, NumberInput, Separator)
            </span>
          </header>
          <div className="space-y-8">
            <div>
              <div className="text-gray-10 text-eyebrow mb-3 uppercase">
                base-ui
              </div>
              <BaseUiDataTable
                columns={baseUiDtColumns}
                data={dtRows}
                dataSource="client"
                storageKey="baseui-ds-table"
                emptyStateTitle="No campaigns yet"
                enableRowSelection
                estimatedRowHeight={53}
              />
            </div>
            <div>
              <div className="text-gray-10 text-eyebrow mb-3 uppercase">
                @workspace/ui
              </div>
              <UiDataTable
                columns={uiDtColumns}
                data={dtRows}
                dataSource="client"
                storageKey="ui-ds-table"
                emptyStateTitle="No campaigns yet"
                enableRowSelection
                estimatedRowHeight={53}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export const Route = createFileRoute("/design-system-baseui")({
  component: DesignSystemBaseUiRoute,
})
