import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Avatar, AvatarFallback } from "@workspace/liquid-ui/components/Avatar"
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
import { ArrowRight, Check, Coffee, Luggage, Plane, Zap } from "lucide-react"

import { ThemeModeSwitcher } from "@/components/ThemeModeSwitcher"

// Demo-only flight-booking review screen, composed entirely from @workspace/liquid-ui
// over the liquid aurora. Not wired to a backend and not i18n'd (same exemption as the
// catalog routes). The price summary reacts to the fare / seat / extras selections.

type FareId = "basic" | "standard" | "flex"

const fares: { id: FareId; name: string; price: number; perks: string[] }[] = [
  {
    id: "basic",
    name: "Basic",
    price: 802,
    perks: ["Carry-on only", "Seat at check-in"],
  },
  {
    id: "standard",
    name: "Standard",
    price: 842,
    perks: ["1 checked bag", "Seat selection", "Changes for a fee"],
  },
  {
    id: "flex",
    name: "Flex",
    price: 937,
    perks: ["2 checked bags", "Free changes", "Priority boarding"],
  },
]

const seatOptions = [
  { value: "window", label: "Window" },
  { value: "aisle", label: "Aisle" },
  { value: "any", label: "No preference" },
]

const steps = ["Search", "Select", "Review", "Payment"]

function StepBar({ current }: { current: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-2">
      {steps.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "text-ui-xs grid size-6 place-items-center rounded-full font-medium",
                done && "bg-accent-9 text-gray-1",
                active && "border-accent-8 text-accent-11 border",
                !done && !active && "border-gray-a6 text-gray-10 border"
              )}
            >
              {done ? <Check className="size-3.5" /> : i + 1}
            </span>
            <span
              className={cn(
                "text-ui-sm",
                active ? "text-gray-12 font-medium" : "text-gray-11"
              )}
            >
              {label}
            </span>
            {i < steps.length - 1 ? (
              <span className="bg-gray-a5 mx-1 h-px w-6" />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}

function FlightLeg({
  kind,
  depTime,
  depCode,
  depCity,
  arrTime,
  arrCity,
  arrCode,
  duration,
  flightNo,
  aircraft,
}: {
  kind: string
  depTime: string
  depCode: string
  depCity: string
  arrTime: string
  arrCity: string
  arrCode: string
  duration: string
  flightNo: string
  aircraft: string
}) {
  return (
    <GlassPanel elevation="float" className="p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>SW</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-gray-12 text-ui-base font-medium">
              Skyway Air
            </div>
            <div className="text-gray-11 text-ui-xs">
              {flightNo} · {aircraft}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-11 text-ui-xs uppercase">{kind}</span>
          <Badge color="glass">Nonstop</Badge>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div>
          <div className="text-gray-12 text-display-sm font-serif">
            {depTime}
          </div>
          <div className="text-gray-11 text-ui-sm">
            {depCode} {depCity}
          </div>
        </div>
        <div className="text-gray-11 flex flex-1 flex-col items-center gap-1">
          <span className="text-ui-xs">{duration}</span>
          <span className="flex w-full items-center gap-1">
            <span className="bg-gray-a6 h-px flex-1" />
            <Plane className="text-accent-11 size-3.5 shrink-0" />
            <span className="bg-gray-a6 h-px flex-1" />
          </span>
          <span className="text-ui-xs">Nonstop</span>
        </div>
        <div className="text-right">
          <div className="text-gray-12 text-display-sm font-serif">
            {arrTime}
          </div>
          <div className="text-gray-11 text-ui-sm">
            {arrCode} {arrCity}
          </div>
        </div>
      </div>
    </GlassPanel>
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
    <label className="flex cursor-pointer items-center gap-3">
      <Checkbox isSelected={checked} onChange={onChange} aria-label={label} />
      <Icon className="text-gray-11 size-4 shrink-0" />
      <span className="min-w-0 flex-1">
        <span className="text-gray-12 text-ui-sm block font-medium">
          {label}
        </span>
        <span className="text-gray-11 text-ui-xs">{note}</span>
      </span>
      <span className="text-gray-12 text-ui-sm font-medium">+${price}</span>
    </label>
  )
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-11">{label}</span>
      <span className="text-gray-12">${value}</span>
    </div>
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

  const farePrice = fares.find((f) => f.id === fare)?.price ?? 842
  const fareName = fares.find((f) => f.id === fare)?.name ?? "Standard"
  const taxes = 128
  const seatFee = 12
  const extras = (bag ? 45 : 0) + (priority ? 20 : 0) + (meal ? 18 : 0)
  const total = farePrice + taxes + seatFee + extras

  return (
    <div data-theme="liquid" className="liquid-aurora text-gray-12 min-h-svh">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-gray-11 text-eyebrow uppercase">
              Skyway Air
            </div>
            <h1 className="text-gray-12 text-display-md font-serif">
              Review and book
            </h1>
            <p className="text-gray-11 text-ui-sm mt-2">
              Lisbon to New York · Round trip · 1 adult · 12-19 Aug
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <StepBar current={2} />
            </div>
            <ThemeModeSwitcher />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-6 lg:col-span-2">
            <section className="space-y-3">
              <h2 className="text-gray-12 text-ui-lg font-semibold">
                Your flights
              </h2>
              <FlightLeg
                kind="Outbound · Fri 12 Aug"
                depTime="10:15"
                depCode="LIS"
                depCity="Lisbon"
                arrTime="13:40"
                arrCode="JFK"
                arrCity="New York"
                duration="8h 25m"
                flightNo="SW 482"
                aircraft="Airbus A330"
              />
              <FlightLeg
                kind="Return · Fri 19 Aug"
                depTime="18:30"
                depCode="JFK"
                depCity="New York"
                arrTime="07:05"
                arrCode="LIS"
                arrCity="Lisbon"
                duration="6h 35m"
                flightNo="SW 617"
                aircraft="Airbus A330"
              />
            </section>

            <section className="space-y-3">
              <h2 className="text-gray-12 text-ui-lg font-semibold">
                Choose your fare
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {fares.map((f) => {
                  const selected = fare === f.id
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFare(f.id)}
                      className="rounded-3xl text-left outline-none"
                    >
                      <GlassPanel
                        tint={selected ? "tinted" : "frost"}
                        elevation="float"
                        className={cn(
                          "h-full p-4 transition-shadow",
                          selected && "ring-accent-8 ring-2"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-12 text-ui-base font-medium">
                            {f.name}
                          </span>
                          {selected ? (
                            <Check className="text-accent-11 size-4" />
                          ) : null}
                        </div>
                        <div className="text-gray-12 text-display-sm mt-1 font-serif">
                          ${f.price}
                        </div>
                        <ul className="text-gray-11 text-ui-xs mt-3 space-y-1.5">
                          {f.perks.map((p) => (
                            <li key={p} className="flex items-center gap-1.5">
                              <Check className="text-accent-11 size-3 shrink-0" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </GlassPanel>
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-gray-12 text-ui-lg font-semibold">
                Lead passenger
              </h2>
              <GlassPanel elevation="float" className="space-y-4 p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="First name" placeholder="As on passport" />
                  <Input label="Last name" placeholder="As on passport" />
                  <Input label="Email" placeholder="you@example.com" />
                  <Input label="Phone" placeholder="+351 000 000 000" />
                  <div>
                    <div className="text-gray-11 text-ui-sm mb-1.5">
                      Date of birth
                    </div>
                    <DatePicker
                      value={dob}
                      onChange={setDob}
                      placeholder="Add date"
                    />
                  </div>
                  <div>
                    <div className="text-gray-11 text-ui-sm mb-1.5">
                      Nationality
                    </div>
                    <Select value={nationality} onValueChange={setNationality}>
                      <SelectTrigger placeholder="Select country" />
                      <SelectContent>
                        <SelectItem value="pt">Portugal</SelectItem>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="gb">United Kingdom</SelectItem>
                        <SelectItem value="es">Spain</SelectItem>
                        <SelectItem value="fr">France</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </GlassPanel>
            </section>

            <section className="space-y-3">
              <h2 className="text-gray-12 text-ui-lg font-semibold">
                Seat and extras
              </h2>
              <GlassPanel elevation="float" className="space-y-5 p-5">
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
                <div className="space-y-4">
                  <ExtraRow
                    icon={Luggage}
                    label="Extra checked bag"
                    note="Up to 23 kg"
                    price={45}
                    checked={bag}
                    onChange={setBag}
                  />
                  <ExtraRow
                    icon={Zap}
                    label="Priority boarding"
                    note="Board first, settle in early"
                    price={20}
                    checked={priority}
                    onChange={setPriority}
                  />
                  <ExtraRow
                    icon={Coffee}
                    label="Onboard meal"
                    note="Chef-selected main plus a drink"
                    price={18}
                    checked={meal}
                    onChange={setMeal}
                  />
                </div>
              </GlassPanel>
            </section>
          </div>

          {/* Sticky summary sidebar */}
          <div className="lg:col-span-1">
            <GlassPanel
              tint="tinted"
              elevation="hero"
              interactive
              className="sticky top-6 space-y-4 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="text-gray-11 text-eyebrow uppercase">
                  Price summary
                </div>
                <Badge color="glass">Held 24h</Badge>
              </div>

              <div className="text-ui-sm space-y-2">
                <SummaryRow label={`${fareName} fare`} value={farePrice} />
                <SummaryRow label="Taxes and fees" value={taxes} />
                <SummaryRow label="Seat selection" value={seatFee} />
                {bag ? <SummaryRow label="Extra bag" value={45} /> : null}
                {priority ? (
                  <SummaryRow label="Priority boarding" value={20} />
                ) : null}
                {meal ? <SummaryRow label="Onboard meal" value={18} /> : null}
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-gray-12 text-ui-base font-medium">
                  Total
                </span>
                <span className="text-gray-12 text-display-sm font-serif">
                  ${total}
                </span>
              </div>

              <GlassButton intent="primary" className="w-full">
                Confirm and pay
                <ArrowRight className="size-4" />
              </GlassButton>

              <p className="text-gray-11 text-ui-xs text-center">
                Earn 1,240 Skyway points on this trip. Free cancellation within
                24 hours.
              </p>
            </GlassPanel>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute("/booking")({
  component: BookingScreen,
})
