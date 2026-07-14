// liquid-ui re-exports base-ui's Calendar (a react-day-picker day grid). Calendar
// has no floating surface of its own -- it renders inside a glass container (the
// liquid DatePicker's glass Popover, or a `glass-overlay` wrapper), which supplies
// the frosted material. So no glass is added here; the liquid theme re-skins the
// grid under [data-theme="liquid"]. Re-exporting (vs reproducing) also keeps
// react-day-picker a base-ui dependency, resolved transitively.
export * from "@workspace/base-ui/components/Calendar"
