/**
 * Format a number as Romanian RON currency.
 * Uses dot as thousand separator, no decimals for display.
 * Example: 45491 → "45.491 lei"
 */
export function formatRON(amount: number): string {
  const rounded = Math.round(amount);
  const formatted = new Intl.NumberFormat("ro-RO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rounded);
  return `${formatted} lei`;
}

/**
 * Format a number as RON with sign prefix.
 * Example: -2430 → "-2.430 lei", 55000 → "+55.000 lei"
 * Zero values return "-" instead of "+-0".
 */
export function formatRONSigned(amount: number): string {
  const rounded = Math.round(amount);
  if (rounded === 0) return "-";
  const sign = rounded > 0 ? "+" : "";
  const formatted = new Intl.NumberFormat("ro-RO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rounded);
  return `${sign}${formatted} lei`;
}

/**
 * Format a decimal rate as percentage.
 * Example: 0.25 → "25%"
 */
export function formatPercent(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

/**
 * Convert annual to monthly amount.
 */
export function toMonthly(annual: number): number {
  return annual / 12;
}

/**
 * Format number with dot thousand separator (Romanian style).
 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("ro-RO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}
