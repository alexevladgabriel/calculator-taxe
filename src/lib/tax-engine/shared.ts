import type { YearConfig, PersonalStatus } from "./types";

/**
 * Get the personal deduction for an employee based on gross salary.
 * The deduction is used to reduce the taxable base.
 */
export function getPersonalDeduction(
  grossMonthlySalary: number,
  config: YearConfig
): number {
  for (const bracket of config.personalDeductionTable) {
    if (grossMonthlySalary <= bracket.maxGross) {
      return bracket.deduction;
    }
  }
  return 0;
}

/**
 * Calculate CAS (pension contribution) for PFA.
 * CAS is due if annual net income >= pfaCasThresholdMonths × minimum wage.
 * The base is capped between 12 × min wage and 24 × min wage.
 */
export function calculatePfaCAS(
  annualNetIncome: number,
  config: YearConfig,
  status: PersonalStatus
): number {
  // If employed elsewhere, CAS is already paid through employment
  if (status.isEmployedElsewhere) return 0;
  // Pensioners don't pay CAS
  if (status.isPensioner) return 0;

  const threshold = config.pfaCasThresholdMonths * config.minimumGrossWage;
  if (annualNetIncome < threshold) return 0;

  // CAS base is clamped: min 12 × min wage, max 24 × min wage
  const minBase = 12 * config.minimumGrossWage;
  const maxBase = 24 * config.minimumGrossWage;
  const casBase = Math.min(Math.max(annualNetIncome, minBase), maxBase);

  return casBase * config.pfaCasRate;
}

/**
 * Calculate CASS (health insurance) for PFA.
 * Uses stepped thresholds based on multiples of minimum wage.
 * Returns 0 if employed elsewhere (CASS already paid).
 */
export function calculatePfaCASS(
  annualNetIncome: number,
  config: YearConfig,
  status: PersonalStatus
): number {
  // If employed elsewhere, CASS is already paid through employment
  if (status.isEmployedElsewhere) return 0;

  // Find the highest threshold the income exceeds
  const thresholds = [...config.pfaCassThresholds].sort(
    (a, b) => b.minIncome - a.minIncome
  );

  for (const t of thresholds) {
    if (annualNetIncome >= t.minIncome) {
      return t.cassBase * config.cassRate;
    }
  }

  // Below all thresholds  - no CASS due
  return 0;
}

/**
 * Calculate CASS on dividends for SRL owners.
 * CASS is due if total dividends exceed the threshold.
 */
export function calculateDividendCASS(
  annualDividends: number,
  config: YearConfig,
  status: PersonalStatus
): number {
  if (status.isEmployedElsewhere) return 0;

  const threshold =
    config.dividendCassThresholdMonths * config.minimumGrossWage;
  if (annualDividends < threshold) return 0;

  // CASS is calculated on the threshold base, not the full dividend amount
  return threshold * config.dividendCassRate;
}

/**
 * Calculate the cost of employing one person at minimum wage.
 * This is the total monthly cost to the SRL (gross + employer contributions).
 */
export function calculateMinWageEmployeeCost(config: YearConfig): {
  readonly monthlyGross: number;
  readonly monthlyEmployerCost: number;
  readonly monthlyTotalCost: number;
  readonly annualTotalCost: number;
} {
  const monthlyGross = config.minimumGrossWage;
  const monthlyEmployerCost = monthlyGross * config.employerContributionRate;
  const monthlyTotalCost = monthlyGross + monthlyEmployerCost;

  return {
    monthlyGross,
    monthlyEmployerCost,
    monthlyTotalCost,
    annualTotalCost: monthlyTotalCost * 12,
  };
}
