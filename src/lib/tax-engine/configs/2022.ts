import type { YearConfig } from "../types";

/**
 * Romanian tax parameters for 2022.
 * Source: Verified spreadsheet data.
 * - Salariu minim brut: 2,550 RON/luna
 * - SRL Impozit dividende: 5%
 * - SRL Micro: 1% (un singur prag)
 * - Praguri CASS: doar 12x
 */
export const config2022: YearConfig = {
  year: 2022,
  minimumGrossWage: 2_550,

  casRate: 0.25,
  cassRate: 0.10,
  incomeTaxRate: 0.10,
  personalDeductionTable: [
    { maxGross: 2_000, deduction: 300 },
    { maxGross: 2_100, deduction: 280 },
    { maxGross: 2_200, deduction: 260 },
    { maxGross: 2_300, deduction: 240 },
    { maxGross: 2_400, deduction: 220 },
    { maxGross: 2_500, deduction: 200 },
    { maxGross: 2_600, deduction: 180 },
    { maxGross: 2_700, deduction: 160 },
    { maxGross: 2_800, deduction: 140 },
    { maxGross: 2_900, deduction: 120 },
    { maxGross: 3_000, deduction: 100 },
    { maxGross: Infinity, deduction: 0 },
  ],

  pfaCasThresholdMonths: 12,
  pfaCasRate: 0.25,
  pfaCassThresholds: [
    { minIncome: 12 * 2_550, cassBase: 12 * 2_550 },
  ],

  microTaxRateWithEmployee: 0.01,
  microTaxRateWithoutEmployee: 0.01, // 2022: un singur prag 1%
  microRevenueLimitEUR: 500_000,
  eurToRon: 4.95,

  corporateTaxRate: 0.16,

  dividendTaxRate: 0.05, // 5% in 2022
  dividendCassThresholdMonths: 6,
  dividendCassRate: 0.10,

  employerContributionRate: 0.0225,

  normaActivities: [
    { code: "6201", label: "Activități de realizare a software-ului (IT)", annualNorma: 37_000 },
    { code: "6202", label: "Consultanță IT", annualNorma: 37_000 },
    { code: "7022", label: "Consultanță pentru afaceri și management", annualNorma: 33_000 },
    { code: "4941", label: "Transport rutier de mărfuri", annualNorma: 40_000 },
    { code: "4932", label: "Transporturi cu taxiuri", annualNorma: 30_000 },
    { code: "8621", label: "Activități de asistență medicală generală", annualNorma: 36_000 },
    { code: "8623", label: "Activități de asistență stomatologică", annualNorma: 43_000 },
    { code: "6910", label: "Activități juridice (avocatură)", annualNorma: 38_000 },
    { code: "7111", label: "Activități de arhitectură", annualNorma: 28_000 },
    { code: "7112", label: "Activități de inginerie", annualNorma: 28_000 },
    { code: "5610", label: "Restaurante", annualNorma: 33_000 },
    { code: "4711", label: "Comerț cu amănuntul", annualNorma: 23_000 },
    { code: "9602", label: "Coafură și alte activități de înfrumusețare", annualNorma: 16_000 },
    { code: "4520", label: "Întreținerea și repararea autovehiculelor", annualNorma: 26_000 },
    { code: "4321", label: "Lucrări de instalații electrice", annualNorma: 24_000 },
  ],
};
