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
 * CAS uses FIXED bracket amounts (not progressive):
 * - Income < 12x min wage: CAS not mandatory (0)
 * - Income 12x-24x min wage: CAS = 12x min wage * 25% (fixed 12,150 for 2026)
 * - Income >= 24x min wage: CAS = 24x min wage * 25% (fixed 24,300 for 2026)
 */
export function calculatePfaCAS(
  annualNetIncome: number,
  config: YearConfig,
  status: PersonalStatus
): number {
  if (status.isEmployedElsewhere) return 0;
  if (status.isPensioner) return 0;

  const bracket12 = 12 * config.minimumGrossWage;
  const bracket24 = 24 * config.minimumGrossWage;

  if (annualNetIncome < bracket12) return 0;

  // Fixed bracket amounts - you pay on the bracket base, not on actual income
  if (annualNetIncome >= bracket24) {
    return bracket24 * config.pfaCasRate;
  }

  return bracket12 * config.pfaCasRate;
}

/**
 * Calculate CASS (health insurance) for PFA.
 *
 * CASS = 10% of net income, with:
 * - Floor: 6x min wage * 10% (minimum, e.g. 2,430 lei for 2026)
 * - Cap: highest threshold * 10% (e.g. 72x for 2026 = 29,160 lei)
 *
 * Exemptions (no minimum floor, pay 10% of actual net):
 * - Employed elsewhere (with >= floor CASS through employment)
 * - Students under 26
 * - Handicap grade 1-2
 * - Pensioners
 *
 * Zero or negative income = no CASS.
 */
export function calculatePfaCASS(
  annualNetIncome: number,
  config: YearConfig,
  status: PersonalStatus
): number {
  if (annualNetIncome <= 0) return 0;

  const sorted = [...config.pfaCassThresholds].sort(
    (a, b) => a.minIncome - b.minIncome
  );
  const floorBase = sorted[0].cassBase; // lowest threshold (6x)
  const capBase = sorted[sorted.length - 1].cassBase; // highest (72x for 2026, 24x for older)

  const floor = floorBase * config.cassRate;
  const cap = capBase * config.cassRate;
  const raw = annualNetIncome * config.cassRate;

  // Exempted persons: 10% of actual net income, no minimum floor
  const isExempted =
    status.isEmployedElsewhere ||
    status.isStudent ||
    status.isHandicapped ||
    status.isPensioner;

  if (isExempted) {
    return Math.min(raw, cap);
  }

  // Normal: 10% of net income, clamped between floor and cap
  return Math.max(floor, Math.min(raw, cap));
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
