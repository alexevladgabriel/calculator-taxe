import type { YearConfig } from "./types";
import { config2022 } from "./configs/2022";
import { config2023 } from "./configs/2023";
import { config2024 } from "./configs/2024";
import { config2025 } from "./configs/2025";
import { config2026 } from "./configs/2026";

const registry: ReadonlyMap<number, YearConfig> = new Map([
  [2022, config2022],
  [2023, config2023],
  [2024, config2024],
  [2025, config2025],
  [2026, config2026],
]);

/**
 * Get the tax configuration for a specific year.
 * Throws if the year is not registered.
 */
export function getYearConfig(year: number): YearConfig {
  const config = registry.get(year);
  if (!config) {
    throw new Error(
      `Tax configuration for year ${year} is not available. ` +
        `Available years: ${getAvailableYears().join(", ")}`
    );
  }
  return config;
}

/**
 * Get all available years sorted ascending.
 */
export function getAvailableYears(): readonly number[] {
  return [...registry.keys()].sort((a, b) => a - b);
}

/**
 * Get the default (most recent) year.
 */
export function getDefaultYear(): number {
  const years = getAvailableYears();
  return years[years.length - 1];
}
