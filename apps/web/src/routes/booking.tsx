import { useState } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Badge } from "@workspace/liquid-ui/components/Badge"
import { GlassButton } from "@workspace/liquid-ui/components/Button"
import { Checkbox } from "@workspace/liquid-ui/components/Checkbox"
import { DatePicker } from "@workspace/liquid-ui/components/DatePicker"
import { GlassPanel } from "@workspace/liquid-ui/components/GlassPanel"
import { Input } from "@workspace/liquid-ui/components/Input"
import { SegmentedControl } from "@workspace/liquid-ui/components/SegmentedControl"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@workspace/liquid-ui/components/Select"
import { Separator } from "@workspace/liquid-ui/components/Separator"
import { cn } from "@workspace/liquid-ui/lib/utils"
import { ArrowRight, Check, Coffee, Luggage, Sparkles, Zap } from "lucide-react"

import {
  airlines,
  Monogram,
  RouteArc,
  SectionHeading,
  StepBar,
  type Airline,
} from "@/components/skyway"
import { ThemeModeSwitcher } from "@/components/ThemeModeSwitcher"

// Demo-only flight-booking review screen, composed entirely from @workspace/liquid-ui
// over the liquid aurora. Not wired to a backend and not i18n'd (same exemption as the
// catalog routes). The design language is "golden-hour boarding pass": flight legs are
// punched glass tickets, the price summary is a two-plate tear-off receipt, numerals
// speak Space Grotesk (font-num) and metadata speaks mono — the WDS type voices.
// The price summary reacts to the fare / seat / extras selections.

type FareId = "basic" | "standard" | "flex"

const fares: {
  id: FareId
  name: string
  price: number
  perks: string[]
  recommended?: boolean
}[] = [
  {
    id: "basic",
    name: "Basic",
    price: 118,
    perks: ["Carry-on only", "Seat at check-in"],
  },
  {
    id: "standard",
    name: "Standard",
    price: 127,
    perks: ["1 checked bag", "Seat selection", "Changes for a fee"],
    recommended: true,
  },
  {
    id: "flex",
    name: "Flex",
    price: 156,
    perks: ["2 checked bags", "Free changes", "Priority boarding"],
  },
]

const seatOptions = [
  { value: "window", label: "Window" },
  { value: "aisle", label: "Aisle" },
  { value: "any", label: "No preference" },
]

// Passed to Select's `items` too, so the closed trigger renders the label
// ("Portugal"), not the raw value ("pt").
const countries = [
  { value: "pt", label: "Portugal" },
  { value: "us", label: "United States" },
  { value: "gb", label: "United Kingdom" },
  { value: "es", label: "Spain" },
  { value: "fr", label: "France" },
]

// Recessed etched-glass treatment for form controls sitting on a GlassPanel —
// swaps the opaque bg-panel tray for the kit's .glass-inset well (utilities
// here out-rank the recipe layer, so bg/border/radius are overridden per-use).
// border-gray-a6, not the white --glass-rim: the rim disappears against the
// bright panel in light mode.
const glassField = "glass-inset h-11 rounded-xl border-gray-a6 bg-transparent"

function StubRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-gray-11 font-mono text-[10px] tracking-[0.18em] uppercase">
        {label}
      </dt>
      <dd className="font-num text-ui-sm text-gray-12 font-medium tabular-nums">
        {value}
      </dd>
    </div>
  )
}

/** A flight leg as a punched boarding pass: cabin pane + perforated stub. */
function BoardingPass({
  kind,
  airline,
  date,
  depTime,
  depCode,
  depCity,
  arrTime,
  arrCity,
  arrCode,
  nextDay,
  duration,
  flightNo,
  aircraft,
  gate,
  boarding,
}: {
  kind: string
  airline: Airline
  date: string
  depTime: string
  depCode: string
  depCity: string
  arrTime: string
  arrCity: string
  arrCode: string
  nextDay?: boolean
  duration: string
  flightNo: string
  aircraft: string
  gate: string
  boarding: string
}) {
  return (
    // No `interactive` pointer glow: the ticket is read-only, and a hover
    // highlight would read as a click affordance it doesn't have.
    <GlassPanel
      tint="tinted"
      elevation="float"
      className="ticket-punched overflow-hidden p-0"
    >
      {/* stub column width must match --ticket-stub-w (app.css) for the punch holes */}
      <div className="grid sm:grid-cols-[minmax(0,1fr)_11rem]">
        <div className="p-5 sm:p-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Monogram code={airline.code} color={airline.color} />
              <div>
                <div className="text-gray-12 text-ui-base font-medium">
                  {airline.name}
                </div>
                <div className="text-gray-11 text-ui-xs font-mono tracking-wide">
                  {flightNo} · {aircraft}
                </div>
              </div>
            </div>
            <Badge color="glass">{kind}</Badge>
          </div>

          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <div className="font-num text-display-lg text-gray-12 tracking-tight">
                {depCode}
              </div>
              <div className="font-num text-ui-lg text-gray-12 mt-0.5 leading-tight font-semibold tabular-nums">
                {depTime}
              </div>
              <div className="text-gray-11 text-ui-xs mt-0.5">{depCity}</div>
            </div>
            <RouteArc duration={duration} caption="Nonstop" />
            <div className="min-w-0 text-right">
              <div className="font-num text-display-lg text-gray-12 tracking-tight">
                {arrCode}
              </div>
              <div className="font-num text-ui-lg text-gray-12 mt-0.5 leading-tight font-semibold tabular-nums">
                {arrTime}
                {nextDay ? (
                  <sup className="text-accent-11 text-ui-xs ml-0.5 font-medium">
                    +1
                  </sup>
                ) : null}
              </div>
              <div className="text-gray-11 text-ui-xs mt-0.5">{arrCity}</div>
            </div>
          </div>
        </div>

        {/* the stub — mono metadata behind the perforation */}
        <div className="relative p-5 sm:p-6 sm:pl-7">
          <span
            aria-hidden
            className="ticket-perf-h absolute inset-x-5 top-0 sm:hidden"
          />
          <span
            aria-hidden
            className="ticket-perf absolute inset-y-4 left-0 hidden sm:block"
          />
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-1 sm:gap-y-4">
            <StubRow label="Date" value={date} />
            <StubRow label="Boarding" value={boarding} />
            <StubRow label="Gate" value={gate} />
            <StubRow label="Seat" value="—" />
          </dl>
        </div>
      </div>
    </GlassPanel>
  )
}

function FareCard({
  fare,
  selected,
  onSelect,
}: {
  fare: (typeof fares)[number]
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="group focus-visible:ring-accent-8 relative rounded-3xl text-left outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
    >
      {fare.recommended ? (
        <span className="bg-accent-9 text-accent-contrast absolute -top-2 left-4 z-[1] rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase shadow-sm">
          Recommended
        </span>
      ) : null}
      <GlassPanel
        tint={selected ? "tinted" : "frost"}
        elevation="float"
        interactive
        className={cn(
          "h-full p-4 transition-[transform,box-shadow] duration-200 group-hover:-translate-y-0.5",
          selected &&
            "ring-accent-8 shadow-[0_20px_44px_-18px_var(--accent-solid)] ring-2"
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-gray-12 text-ui-base font-medium">
            {fare.name}
          </span>
          <span
            className={cn(
              "grid size-5 place-items-center rounded-full border transition",
              selected
                ? "border-accent-8 bg-accent-9 text-accent-contrast"
                : "border-gray-a6 text-transparent"
            )}
          >
            <Check className="size-3" />
          </span>
        </div>
        <div className="font-num text-display-md text-gray-12 mt-1 tracking-tight tabular-nums">
          ${fare.price}
        </div>
        <div className="text-gray-11 text-ui-xs">round trip</div>
        <ul className="text-gray-11 text-ui-xs mt-3 space-y-1.5">
          {fare.perks.map((p) => (
            <li key={p} className="flex items-center gap-1.5">
              <Check className="text-accent-11 size-3 shrink-0" />
              {p}
            </li>
          ))}
        </ul>
      </GlassPanel>
    </button>
  )
}

function ExtraRow({
  icon: Icon,
  label,
  note,
  price,
  checked,
  onChange,
}: {
  icon: typeof Luggage
  label: string
  note: string
  price: number
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label
      className={cn(
        "-mx-2 flex cursor-pointer items-center gap-3 rounded-2xl px-2 py-2 transition-colors",
        "hover:bg-gray-a2"
      )}
    >
      <Checkbox isSelected={checked} onChange={onChange} aria-label={label} />
      <span
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-xl border transition-colors",
          checked
            ? "border-accent-a5 bg-accent-a3 text-accent-11"
            : "border-gray-a5 bg-gray-a2 text-gray-11"
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="text-gray-12 text-ui-sm block font-medium">
          {label}
        </span>
        <span className="text-gray-11 text-ui-xs">{note}</span>
      </span>
      <span className="font-num text-ui-sm text-gray-12 font-medium tabular-nums">
        +${price}
      </span>
    </label>
  )
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-11">{label}</span>
      <span className="font-num text-gray-12 tabular-nums">${value}</span>
    </div>
  )
}

// A fixed, believable code-128-ish strip — decorative, marked aria-hidden.
const BARCODE_BARS = [
  3, 1, 2, 1, 4, 1, 1, 2, 3, 1, 2, 4, 1, 1, 3, 2, 1, 2, 4, 1, 1, 3, 1, 2, 1, 1,
  3, 1, 2, 2,
]

function Barcode() {
  let x = 0
  const rects = BARCODE_BARS.map((w, i) => {
    const rect = <rect key={i} x={x} y={0} width={w} height={24} />
    x += w + 1.6
    return rect
  })
  return (
    <svg
      viewBox={`0 0 ${x - 1.6} 24`}
      preserveAspectRatio="none"
      className="h-6 w-full fill-current"
      aria-hidden
    >
      {rects}
    </svg>
  )
}

function BookingScreen() {
  const [fare, setFare] = useState<FareId>("standard")
  const [seat, setSeat] = useState("window")
  const [bag, setBag] = useState(true)
  const [priority, setPriority] = useState(false)
  const [meal, setMeal] = useState(false)
  const [nationality, setNationality] = useState<string | null>(null)
  const [dob, setDob] = useState<Date>()

  const farePrice = fares.find((f) => f.id === fare)?.price ?? 127
  const fareName = fares.find((f) => f.id === fare)?.name ?? "Standard"
  const taxes = 24
  const seatFee = 6
  const extras = (bag ? 14 : 0) + (priority ? 8 : 0) + (meal ? 9 : 0)
  const total = farePrice + taxes + seatFee + extras

  return (
    <div data-theme="liquid" className="liquid-aurora text-gray-12 min-h-svh">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        <header className="liquid-rise mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-6 sm:mb-14">
          <div>
            <div className="text-gray-11 text-ui-xs font-mono tracking-[0.2em] uppercase">
              Skyway · E-ticket SKW-8H24KF
            </div>
            <h1 className="text-gray-12 text-display-xl mt-3 font-serif tracking-tight text-balance">
              Review your journey
            </h1>
            <p className="text-gray-11 text-ui-base mt-2 tabular-nums">
              Hanoi → Phu Quoc · Round trip · 1 adult · 12–19 Aug
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <StepBar current={2} />
            </div>
            <ThemeModeSwitcher />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-10 lg:col-span-2">
            <section
              className="liquid-rise space-y-4"
              style={{ animationDelay: "60ms" }}
            >
              <SectionHeading
                index="01"
                title="Your flights"
                action={
                  <Link
                    to="/flights"
                    className="text-accent-11 font-mono text-[10px] tracking-[0.18em] uppercase hover:underline"
                  >
                    Change
                  </Link>
                }
              />
              <BoardingPass
                kind="Outbound"
                airline={airlines.vn}
                date="Fri 12 Aug"
                depTime="09:15"
                depCode="HAN"
                depCity="Hanoi"
                arrTime="11:20"
                arrCode="PQC"
                arrCity="Phu Quoc"
                duration="2h 05m"
                flightNo="VN 1273"
                aircraft="Airbus A321"
                gate="24"
                boarding="08:35"
              />
              <BoardingPass
                kind="Return"
                airline={airlines.vj}
                date="Fri 19 Aug"
                depTime="18:25"
                depCode="PQC"
                depCity="Phu Quoc"
                arrTime="20:35"
                arrCode="HAN"
                arrCity="Hanoi"
                duration="2h 10m"
                flightNo="VJ 458"
                aircraft="Airbus A321neo"
                gate="5"
                boarding="17:45"
              />
            </section>

            <section
              className="liquid-rise space-y-4"
              style={{ animationDelay: "120ms" }}
            >
              <SectionHeading index="02" title="Choose your fare" />
              <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
                {fares.map((f) => (
                  <FareCard
                    key={f.id}
                    fare={f}
                    selected={fare === f.id}
                    onSelect={() => setFare(f.id)}
                  />
                ))}
              </div>
            </section>

            <section
              className="liquid-rise space-y-4"
              style={{ animationDelay: "180ms" }}
            >
              <SectionHeading index="03" title="Lead passenger" />
              <GlassPanel elevation="float" className="space-y-4 p-5 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="First name"
                    placeholder="As on passport"
                    className={glassField}
                  />
                  <Input
                    label="Last name"
                    placeholder="As on passport"
                    className={glassField}
                  />
                  <Input
                    label="Email"
                    placeholder="you@example.com"
                    className={glassField}
                  />
                  <Input
                    label="Phone"
                    placeholder="+351 000 000 000"
                    className={glassField}
                  />
                  <div>
                    <div className="text-gray-11 text-ui-sm mb-1.5">
                      Date of birth
                    </div>
                    <DatePicker
                      value={dob}
                      onChange={setDob}
                      placeholder="Add date"
                      className={glassField}
                    />
                  </div>
                  <div>
                    <div className="text-gray-11 text-ui-sm mb-1.5">
                      Nationality
                    </div>
                    <Select
                      value={nationality}
                      onValueChange={setNationality}
                      items={countries}
                    >
                      <SelectTrigger
                        placeholder="Select country"
                        className={glassField}
                      />
                      <SelectContent>
                        {countries.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </GlassPanel>
            </section>

            <section
              className="liquid-rise space-y-4"
              style={{ animationDelay: "240ms" }}
            >
              <SectionHeading index="04" title="Seat and extras" />
              <GlassPanel elevation="float" className="space-y-5 p-5 sm:p-6">
                <div>
                  <div className="text-gray-11 text-ui-sm mb-2">
                    Seat preference
                  </div>
                  <SegmentedControl
                    value={seat}
                    onChange={setSeat}
                    options={seatOptions}
                  />
                </div>
                <Separator />
                <div className="space-y-1">
                  <ExtraRow
                    icon={Luggage}
                    label="Extra checked bag"
                    note="Up to 23 kg"
                    price={14}
                    checked={bag}
                    onChange={setBag}
                  />
                  <ExtraRow
                    icon={Zap}
                    label="Priority boarding"
                    note="Board first, settle in early"
                    price={8}
                    checked={priority}
                    onChange={setPriority}
                  />
                  <ExtraRow
                    icon={Coffee}
                    label="Onboard meal"
                    note="Chef-selected main plus a drink"
                    price={9}
                    checked={meal}
                    onChange={setMeal}
                  />
                </div>
              </GlassPanel>
            </section>
          </div>

          {/* Sticky tear-off receipt — two glass plates split at the tear line */}
          <div
            className="liquid-rise lg:col-span-1"
            style={{ animationDelay: "100ms" }}
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
                    Fare summary
                  </div>
                  <Badge color="glass">Held 24h</Badge>
                </div>

                <div className="text-ui-sm space-y-2.5">
                  <SummaryRow label={`${fareName} fare`} value={farePrice} />
                  <SummaryRow label="Taxes and fees" value={taxes} />
                  <SummaryRow label="Seat selection" value={seatFee} />
                  {bag ? <SummaryRow label="Extra bag" value={14} /> : null}
                  {priority ? (
                    <SummaryRow label="Priority boarding" value={8} />
                  ) : null}
                  {meal ? <SummaryRow label="Onboard meal" value={9} /> : null}
                </div>
              </GlassPanel>

              <GlassPanel
                tint="tinted"
                elevation="float"
                className="space-y-5 rounded-t-xl p-6"
              >
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-gray-11 font-mono text-[10px] tracking-[0.2em] uppercase">
                      Total
                    </div>
                    <div className="text-gray-11 text-ui-xs mt-1">
                      incl. taxes and fees
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
                  className="group w-full justify-between rounded-2xl pr-1.5 pl-5"
                >
                  <span>Confirm and pay</span>
                  <span className="flex items-center gap-2.5">
                    <span className="font-num tabular-nums">${total}</span>
                    <span className="grid size-9 place-items-center rounded-full bg-white/20 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5">
                      <ArrowRight className="size-4" />
                    </span>
                  </span>
                </GlassButton>

                <p className="text-gray-11 text-ui-xs flex items-center justify-center gap-1.5 text-center">
                  <Sparkles className="text-accent-11 size-3.5 shrink-0" />
                  Earn 320 points · Free cancellation within 24h
                </p>

                <div className="space-y-1.5 pt-1">
                  <div className="text-gray-a8 px-1">
                    <Barcode />
                  </div>
                  <div className="text-gray-9 text-center font-mono text-[10px] tracking-[0.24em] uppercase">
                    SKW · 8H24KF · HAN–PQC
                  </div>
                </div>
              </GlassPanel>
            </div>
          </div>
        </div>

        <footer className="liquid-rise mt-14 flex flex-wrap items-center justify-between gap-3">
          <span className="text-gray-9 font-mono text-[10px] tracking-[0.2em] uppercase">
            Skyway · Flight bookings
          </span>
          <span className="text-gray-11 text-ui-xs">
            All fares in USD · Ticket issued after payment
          </span>
        </footer>
      </div>
    </div>
  )
}

export const Route = createFileRoute("/booking")({
  component: BookingScreen,
})
