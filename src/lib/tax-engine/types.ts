// ─── Core Input/Output Types ────────────────────────────────────

export interface CalculatorInputs {
  /** Monthly gross income in RON */
  readonly grossMonthlyIncome: number;
  /** Number of months of activity (1-12) */
  readonly monthsOfActivity: number;
  /** Estimated monthly deductible expenses in RON (for PFA real / SRL) */
  readonly monthlyExpenses: number;
  /** Activity type key for PFA Norma de Venit */
  readonly activityType: string;
  /** Personal status flags */
  readonly personalStatus: PersonalStatus;
  /** Tax year */
  readonly year: number;
  /** Whether the SRL has at least one employee (affects micro rate: 1% vs 3%) */
  readonly srlHasEmployee: boolean;
  /** Number of meal tickets per month (tichete de masa) - only for Angajat */
  readonly mealTicketsPerMonth: number;
  /** Value per meal ticket in RON */
  readonly mealTicketValue: number;
}

export interface PersonalStatus {
  readonly isStudent: boolean;
  readonly isHandicapped: boolean;
  readonly isEmployedElsewhere: boolean;
  readonly isPensioner: boolean;
}

// ─── Tax Result ─────────────────────────────────────────────────

export type StructureType =
  | "angajat"
  | "pfa-real"
  | "pfa-norma"
  | "srl-micro"
  | "srl-standard";

export interface TaxResult {
  readonly structureType: StructureType;
  readonly label: string;
  readonly grossAnnualIncome: number;
  readonly breakdown: readonly TaxLineItem[];
  readonly totalTaxes: number;
  readonly netAnnualIncome: number;
  readonly effectiveTaxRate: number;
  readonly warnings: readonly string[];
}

export interface TaxLineItem {
  readonly label: string;
  readonly amount: number;
  readonly note?: string;
}

// ─── Year Configuration ─────────────────────────────────────────

export interface PersonalDeductionBracket {
  /** Max gross monthly salary for this bracket (inclusive) */
  readonly maxGross: number;
  /** Deduction amount in RON */
  readonly deduction: number;
}

export interface CassThreshold {
  /** Minimum annual income to trigger this bracket (in RON) */
  readonly minIncome: number;
  /** The base on which CASS is calculated (in RON) */
  readonly cassBase: number;
}

export interface NormaActivity {
  readonly code: string;
  readonly label: string;
  /** Annual norma de venit in RON */
  readonly annualNorma: number;
}

export interface YearConfig {
  readonly year: number;
  /** Salariul minim brut pe economie (monthly) */
  readonly minimumGrossWage: number;

  // ── Employee ──
  readonly casRate: number;
  readonly cassRate: number;
  readonly incomeTaxRate: number;
  readonly personalDeductionTable: readonly PersonalDeductionBracket[];

  // ── PFA ──
  /** CAS is due if annual net income >= this many months × min wage */
  readonly pfaCasThresholdMonths: number;
  readonly pfaCasRate: number;
  /** CASS thresholds (sorted ascending by minIncome) */
  readonly pfaCassThresholds: readonly CassThreshold[];

  // ── SRL Micro ──
  readonly microTaxRateWithEmployee: number;
  readonly microTaxRateWithoutEmployee: number;
  /** EUR revenue limit for micro-enterprise regime */
  readonly microRevenueLimitEUR: number;
  /** Approximate EUR/RON rate for the year */
  readonly eurToRon: number;

  // ── SRL Standard ──
  readonly corporateTaxRate: number;

  // ── Dividends (SRL) ──
  readonly dividendTaxRate: number;
  /** CASS on dividends: threshold and rate */
  readonly dividendCassThresholdMonths: number;
  readonly dividendCassRate: number;

  // ── Employer costs (for SRL micro with employee) ──
  /** Employer-side contributions: CAS, CASS, work insurance, etc. as total rate */
  readonly employerContributionRate: number;

  // ── Norma de Venit ──
  readonly normaActivities: readonly NormaActivity[];
}

// ─── Comparison Result ──────────────────────────────────────────

export interface ComparisonResult {
  readonly results: readonly TaxResult[];
  readonly winner: TaxResult;
  readonly yearConfig: YearConfig;
}
