import { getPageTitle } from "@/utils/page-title"
import { Badge } from "@workspace/base-ui/components/Badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/base-ui/components/Card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/base-ui/components/Chart"
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@workspace/base-ui/components/Timeline"
import { createFileRoute } from "@tanstack/react-router"
import { TrendingDown, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { PageShell } from "@/components/PageShell"

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [{ title: getPageTitle("Dashboard") }],
  }),
})

const STATS = [
  { label: "Revenue", value: "$48.2k", delta: 12.4, up: true },
  { label: "Active users", value: "2,318", delta: 8.1, up: true },
  { label: "Conversion", value: "3.4%", delta: 2.2, up: false },
  { label: "Avg. session", value: "4m 12s", delta: 5.6, up: true },
]

const REVENUE_CONFIG = {
  revenue: { label: "Revenue", color: "var(--accent-9)" },
} satisfies ChartConfig

const REVENUE_DATA = [
  { month: "Jan", revenue: 28 },
  { month: "Feb", revenue: 34 },
  { month: "Mar", revenue: 31 },
  { month: "Apr", revenue: 42 },
  { month: "May", revenue: 39 },
  { month: "Jun", revenue: 48 },
]

function DashboardPage() {
  return (
    <PageShell
      title="Dashboard"
      description="An example dashboard composed from @workspace/base-ui — swap the data for your own."
    >
      <div className="flex flex-col gap-4">
        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <CardDescription>{stat.label}</CardDescription>
                  <Badge color={stat.up ? "success" : "error"} size="sm">
                    {stat.up ? <TrendingUp /> : <TrendingDown />}
                    {stat.delta}%
                  </Badge>
                </div>
                <div className="text-gray-12 text-2xl font-semibold">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart + activity */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
              <CardDescription>Last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={REVENUE_CONFIG} className="aspect-[3/1]">
                <AreaChart
                  data={REVENUE_DATA}
                  margin={{ left: 4, right: 8, top: 8 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    dataKey="revenue"
                    type="natural"
                    stroke="var(--color-revenue)"
                    fill="var(--color-revenue)"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline>
                <TimelineItem status="done">
                  <TimelineDot />
                  <TimelineConnector />
                  <TimelineContent>
                    <TimelineTitle>New signup</TimelineTitle>
                    <TimelineTime>2m ago</TimelineTime>
                    <TimelineDescription>
                      acme.co upgraded to the Pro plan.
                    </TimelineDescription>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem status="done">
                  <TimelineDot />
                  <TimelineConnector />
                  <TimelineContent>
                    <TimelineTitle>Invoice paid</TimelineTitle>
                    <TimelineTime>1h ago</TimelineTime>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem status="current">
                  <TimelineDot />
                  <TimelineConnector />
                  <TimelineContent>
                    <TimelineTitle>Sync running</TimelineTitle>
                    <TimelineTime>Now</TimelineTime>
                    <TimelineDescription>
                      Importing 3 of 8 sources.
                    </TimelineDescription>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem status="pending">
                  <TimelineDot />
                  <TimelineConnector />
                  <TimelineContent>
                    <TimelineTitle>Weekly report</TimelineTitle>
                    <TimelineTime>Up next</TimelineTime>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}
