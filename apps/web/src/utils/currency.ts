export function formatCurrency(
  amount: number,
  currency: string,
  locale = "en-US"
) {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amount)
  } catch {
    return `${amount} ${currency}`
  }
}
