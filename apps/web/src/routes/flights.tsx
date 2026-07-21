import { useState } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Badge } from "@workspace/liquid-ui/components/Badge"
import { GlassButton } from "@workspace/liquid-ui/components/Button"
import { GlassPanel } from "@workspace/liquid-ui/components/GlassPanel"
import { SegmentedControl } from "@workspace/liquid-ui/components/SegmentedControl"
import { cn } from "@workspace/liquid-ui/lib/utils"
import { ArrowRight, Check, Sparkles } from "lucide-react"

import {
  airlines,
  Monogram,
  RouteArc,
  SectionHeading,
  StepBar,
  type Airline,
} from "@/components/skyway"
import { ThemeModeSwitcher } from "@/components/ThemeModeSwitcher"

// Demo-only flight-selection screen (the "Select" step ahead of /booking),
// composed entirely from @workspace/liquid-ui over the liquid aurora. Skyway is
// the booking platform; each option ticket carries its own carrier's identity
// (Vietnam Airlines / VietJet / Bamboo / Sun PhuQuoc on Hanoi → Phu Quoc).
// Not wired to a backend and not i18n'd (same exemption as the catalog routes).
// Sorting, cabin pricing, selection, and the running total are all live;
// "Continue to review" hands off to /booking.

type Leg = "outbound" | "return"
type SortId = "best" | "cheapest" | "fastest"
type CabinId = "economy" | "premium" | "business"

interface FlightOption {
  id: string
  airline: Airline
  flightNo: string
  aircraft: string
  depTime: string
  depCode: string
  arrTime: string
  arrCode: string
  nextDay?: boolean
  duration: string
  durationMin: number
  stops: 0 | 1
  stopCode?: string
  /** Economy base fare, per adult, one way. */
  price: number
  tag?: "Best" | "Cheapest" | "Fastest"
}

// Curated "best" order; the sort control re-orders copies of these. The two
// "Best" options double as the default selection (named so the selection state
// starts from a known, non-undefined object).
const bestOutbound: FlightOption = {
  id: "vn1273",
  airline: airlines.vn,
  flightNo: "VN 1273",
  aircraft: "Airbus A321",
  depTime: "09:15",
  depCode: "HAN",
  arrTime: "11:20",
  arrCode: "PQC",
  duration: "2h 05m",
  durationMin: 125,
  stops: 0,
  price: 78,
  tag: "Best",
}

const outboundOptions: FlightOption[] = [
  bestOutbound,
  {
    id: "sp1102",
    airline: airlines.sp,
    flightNo: "SP 1102",
    aircraft: "Airbus A321neo",
    depTime: "06:40",
    depCode: "HAN",
    arrTime: "08:40",
    arrCode: "PQC",
    duration: "2h 00m",
    durationMin: 120,
    stops: 0,
    price: 64,
    tag: "Fastest",
  },
  {
    id: "vj453",
    airline: airlines.vj,
    flightNo: "VJ 453",
    aircraft: "Airbus A321neo",
    depTime: "12:30",
    depCode: "HAN",
    arrTime: "14:40",
    arrCode: "PQC",
    duration: "2h 10m",
    durationMin: 130,
    stops: 0,
    price: 52,
    tag: "Cheapest",
  },
  {
    id: "qh1620",
    airline: airlines.qh,
    flightNo: "QH 1620",
    aircraft: "Airbus A320neo",
    depTime: "15:50",
    depCode: "HAN",
    arrTime: "20:25",
    arrCode: "PQC",
    duration: "4h 35m",
    durationMin: 275,
    stops: 1,
    stopCode: "SGN",
    price: 58,
  },
]

const bestReturn: FlightOption = {
  id: "vn1274",
  airline: airlines.vn,
  flightNo: "VN 1274",
  aircraft: "Airbus A321",
  depTime: "12:10",
  depCode: "PQC",
  arrTime: "14:15",
  arrCode: "HAN",
  duration: "2h 05m",
  durationMin: 125,
  stops: 0,
  price: 75,
  tag: "Best",
}

const returnOptions: FlightOption[] = [
  bestReturn,
  {
    id: "sp1103",
    airline: airlines.sp,
    flightNo: "SP 1103",
    aircraft: "Airbus A321neo",
    depTime: "09:30",
    depCode: "PQC",
    arrTime: "11:30",
    arrCode: "HAN",
    duration: "2h 00m",
    durationMin: 120,
    stops: 0,
    price: 61,
    tag: "Fastest",
  },
  {
    id: "vj458",
    airline: airlines.vj,
    flightNo: "VJ 458",
    aircraft: "Airbus A321neo",
    depTime: "18:25",
    depCode: "PQC",
    arrTime: "20:35",
    arrCode: "HAN",
    duration: "2h 10m",
    durationMin: 130,
    stops: 0,
    price: 49,
    tag: "Cheapest",
  },
  {
    id: "qh1621",
    airline: airlines.qh,
    flightNo: "QH 1621",
    aircraft: "Airbus A320neo",
    depTime: "13:35",
    depCode: "PQC",
    arrTime: "15:45",
    arrCode: "HAN",
    duration: "2h 10m",
    durationMin: 130,
    stops: 0,
    price: 66,
  },
]

const sortOptions = [
  { value: "best" as const, label: "Best" },
  { value: "cheapest" as const, label: "Cheapest" },
  { value: "fastest" as const, label: "Fastest" },
]

const cabinOptions = [
  { value: "economy" as const, label: "Economy" },
  { value: "premium" as const, label: "Premium" },
  { value: "business" as const, label: "Business" },
]

const cabinFactor: Record<CabinId, number> = {
  economy: 1,
  premium: 1.85,
  business: 3.1,
}

const cabinLabel: Record<CabinId, string> = {
  economy: "Economy",
  premium: "Premium",
  business: "Business",
}

function sortFlights(list: FlightOption[], sort: SortId) {
  const copy = [...list]
  if (sort === "cheapest") copy.sort((a, b) => a.price - b.price)
  if (sort === "fastest") copy.sort((a, b) => a.durationMin - b.durationMin)
  return copy // "best" keeps the curated order
}

function FlightOptionCard({
  option,
  price,
  selected,
  onSelect,
}: {
  option: FlightOption
  price: number
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="group focus-visible:ring-accent-8 block w-full rounded-3xl text-left outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
    >
      <GlassPanel
        tint={selected ? "tinted" : "frost"}
        elevation="float"
        interactive
        className={cn(
          "p-4 transition-[transform,box-shadow] duration-200 group-hover:-translate-y-0.5 sm:p-5",
          selected &&
            "ring-accent-8 shadow-[0_20px_44px_-18px_var(--accent-solid)] ring-2"
        )}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <Monogram
              code={option.airline.code}
              color={option.airline.color}
              className="text-ui-xs size-8 rounded-xl"
            />
            <div className="min-w-0">
              <div className="text-gray-12 text-ui-sm truncate font-medium">
                {option.airline.name}
              </div>
              <div className="text-gray-11 font-mono text-[10px] tracking-wide">
                {option.flightNo} · {option.aircraft}
              </div>
            </div>
          </div>
          {option.tag === "Best" ? (
            <span className="bg-accent-9 text-accent-contrast rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
              Best
            </span>
          ) : option.tag ? (
            <Badge color="glass">{option.tag}</Badge>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-end">
            <div className="min-w-0">
              <div className="font-num text-display-sm text-gray-12 tracking-tight tabular-nums">
                {option.depTime}
              </div>
              <div className="text-gray-11 text-ui-xs mt-0.5">
                {option.depCode}
              </div>
            </div>
            <RouteArc
              duration={option.duration}
              caption={
                option.stops === 0 ? "Nonstop" : `1 stop · ${option.stopCode}`
              }
            />
            <div className="min-w-0 text-right">
              <div className="font-num text-display-sm text-gray-12 tracking-tight tabular-nums">
                {option.arrTime}
                {option.nextDay ? (
                  <sup className="text-accent-11 text-ui-xs ml-0.5 font-medium">
                    +1
                  </sup>
                ) : null}
              </div>
              <div className="text-gray-11 text-ui-xs mt-0.5">
                {option.arrCode}
              </div>
            </div>
          </div>

          <div className="border-gray-a5 flex items-center justify-between gap-4 border-t pt-3 sm:justify-end sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5">
            <div className="sm:text-right">
              <div className="font-num text-display-sm text-gray-12 tracking-tight tabular-nums">
                ${price}
              </div>
              <div className="text-gray-11 text-ui-xs">per adult</div>
            </div>
            <span
              className={cn(
                "grid size-5 shrink-0 place-items-center rounded-full border transition",
                selected
                  ? "border-accent-8 bg-accent-9 text-accent-contrast"
                  : "border-gray-a6 text-transparent"
              )}
            >
              <Check className="size-3" />
            </span>
          </div>
        </div>
      </GlassPanel>
    </button>
  )
}

function SelectionRow({
  label,
  flight,
  price,
}: {
  label: string
  flight: FlightOption
  price: number
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="text-gray-11 font-mono text-[10px] tracking-[0.18em] uppercase">
          {label}
        </div>
        <div className="text-gray-12 text-ui-sm mt-0.5 font-medium tabular-nums">
          {flight.depTime} – {flight.arrTime}
          {flight.nextDay ? <sup className="text-accent-11">+1</sup> : null}
          &nbsp;· {flight.flightNo}
        </div>
        <div className="text-gray-11 text-ui-xs">{flight.airline.name}</div>
      </div>
      <span className="font-num text-gray-12 text-ui-sm font-medium tabular-nums">
        ${price}
      </span>
    </div>
  )
}

function FlightsScreen() {
  const [sort, setSort] = useState<SortId>("best")
  const [cabin, setCabin] = useState<CabinId>("economy")
  const [selectedOutbound, setSelectedOutbound] = useState(bestOutbound)
  const [selectedReturn, setSelectedReturn] = useState(bestReturn)

  const fare = (option: FlightOption) =>
    Math.round(option.price * cabinFactor[cabin])

  const total = fare(selectedOutbound) + fare(selectedReturn)

  const legs: {
    key: Leg
    index: string
    title: string
    options: FlightOption[]
    selectedId: string
    onSelect: (option: FlightOption) => void
  }[] = [
    {
      key: "outbound",
      index: "01",
      title: "Outbound · Fri 12 Aug",
      options: sortFlights(outboundOptions, sort),
      selectedId: selectedOutbound.id,
      onSelect: setSelectedOutbound,
    },
    {
      key: "return",
      index: "02",
      title: "Return · Fri 19 Aug",
      options: sortFlights(returnOptions, sort),
      selectedId: selectedReturn.id,
      onSelect: setSelectedReturn,
    },
  ]

  return (
    <div data-theme="liquid" className="liquid-aurora text-gray-12 min-h-svh">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        <header className="liquid-rise mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-6 sm:mb-10">
          <div>
            <div className="text-gray-11 text-ui-xs font-mono tracking-[0.2em] uppercase">
              Skyway · Hanoi → Phu Quoc
            </div>
            <h1 className="text-gray-12 text-display-xl mt-3 font-serif tracking-tight text-balance">
              Choose your flights
            </h1>
            <p className="text-gray-11 text-ui-base mt-2 tabular-nums">
              Round trip · 1 adult · 12–19 Aug
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <StepBar current={1} />
            </div>
            <ThemeModeSwitcher />
          </div>
        </header>

        <div
          className="liquid-rise mb-10 flex flex-wrap items-end gap-x-8 gap-y-4"
          style={{ animationDelay: "40ms" }}
        >
          <div>
            <div className="text-gray-11 mb-2 font-mono text-[10px] tracking-[0.18em] uppercase">
              Sort by
            </div>
            <SegmentedControl
              value={sort}
              onChange={setSort}
              options={sortOptions}
            />
          </div>
          <div>
            <div className="text-gray-11 mb-2 font-mono text-[10px] tracking-[0.18em] uppercase">
              Cabin
            </div>
            <SegmentedControl
              value={cabin}
              onChange={setCabin}
              options={cabinOptions}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Flight options */}
          <div className="space-y-10 lg:col-span-2">
            {legs.map((leg, i) => (
              <section
                key={leg.key}
                className="liquid-rise space-y-4"
                style={{ animationDelay: `${80 + i * 60}ms` }}
              >
                <SectionHeading index={leg.index} title={leg.title} />
                <div className="space-y-3 pt-1">
                  {leg.options.map((option) => (
                    <FlightOptionCard
                      key={option.id}
                      option={option}
                      price={fare(option)}
                      selected={leg.selectedId === option.id}
                      onSelect={() => leg.onSelect(option)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Sticky tear-off selection summary */}
          <div
            className="liquid-rise lg:col-span-1"
            style={{ animationDelay: "120ms" }}
          >
            <div className="sticky top-6 space-y-2">
              <GlassPanel
                tint="tinted"
                elevation="hero"
                refraction
                className="space-y-5 rounded-b-xl p-6 shadow-[0_28px_64px_-34px_var(--accent-solid)]"
              >
                <div className="flex items-center justify-between">
                  <div className="text-gray-11 font-mono text-[10px] tracking-[0.2em] uppercase">
                    Your selection
                  </div>
                  <Monogram />
                </div>

                <div className="space-y-4">
                  <SelectionRow
                    label="Outbound · Fri 12 Aug"
                    flight={selectedOutbound}
                    price={fare(selectedOutbound)}
                  />
                  <SelectionRow
                    label="Return · Fri 19 Aug"
                    flight={selectedReturn}
                    price={fare(selectedReturn)}
                  />
                </div>

                <p className="text-gray-11 text-ui-xs">
                  {cabinLabel[cabin]} · 1 adult · taxes added at review
                </p>
              </GlassPanel>

              <GlassPanel
                tint="tinted"
                elevation="float"
                className="space-y-5 rounded-t-xl p-6"
              >
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-gray-11 font-mono text-[10px] tracking-[0.2em] uppercase">
                      Trip fare
                    </div>
                    <div className="text-gray-11 text-ui-xs mt-1">
                      per adult, before taxes
                    </div>
                  </div>
                  <div aria-live="polite">
                    <span
                      key={total}
                      className="total-tick font-num text-display-lg text-gray-12 inline-block tracking-tight tabular-nums"
                    >
                      ${total}
                    </span>
                  </div>
                </div>

                <GlassButton
                  prominent
                  intent="primary"
                  size="lg"
                  asChild
                  className="group w-full justify-between rounded-2xl pr-1.5 pl-5"
                >
                  <Link to="/booking">
                    <span>Continue to review</span>
                    <span className="grid size-9 place-items-center rounded-full bg-white/20 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5">
                      <ArrowRight className="size-4" />
                    </span>
                  </Link>
                </GlassButton>

                <p className="text-gray-11 text-ui-xs flex items-center justify-center gap-1.5 text-center">
                  <Sparkles className="text-accent-11 size-3.5 shrink-0" />
                  Fare held 24h at review · No card needed yet
                </p>
              </GlassPanel>
            </div>
          </div>
        </div>

        <footer className="liquid-rise mt-14 flex flex-wrap items-center justify-between gap-3">
          <span className="text-gray-9 font-mono text-[10px] tracking-[0.2em] uppercase">
            Skyway · Flight bookings
          </span>
          <span className="text-gray-11 text-ui-xs">
            All fares in USD · Prices per adult, one way
          </span>
        </footer>
      </div>
    </div>
  )
}

export const Route = createFileRoute("/flights")({
  component: FlightsScreen,
})
