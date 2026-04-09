import type { YearConfig } from "../types";

/**
 * Romanian tax parameters for 2024.
 * Source: Verified spreadsheet data.
 * - Salariu minim brut: 3,300 RON/luna (HG 900/2023)
 * - SRL Impozit dividende: 8%
 * - SRL Micro prag: 300,000 EUR (redus de la 500,000)
 * - CAM: 70 lei (70/3300 = ~2.12%)
 * - Praguri CASS: 6x/12x/24x/60x
 * - Pilonul 2: 4.75% (inclus in CAS 25%)
 */
export const config2024: YearConfig = {
  year: 2024,
  minimumGrossWage: 3_300,

  casRate: 0.25, // include pilonul 2 (4.75%)
  cassRate: 0.10,
  incomeTaxRate: 0.10,
  // Art. 77 Cod Fiscal, OUG 115/2023 - 0 dependents
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
    { maxGross: 3_100, deduction: 80 },
    { maxGross: 3_200, deduction: 60 },
    { maxGross: 3_300, deduction: 40 },
    { maxGross: 3_400, deduction: 20 },
    { maxGross: Infinity, deduction: 0 },
  ],

  pfaCasThresholdMonths: 12,
  pfaCasRate: 0.25,
  pfaCassThresholds: [
    { minIncome: 6 * 3_300, cassBase: 6 * 3_300 },
    { minIncome: 12 * 3_300, cassBase: 12 * 3_300 },
    { minIncome: 24 * 3_300, cassBase: 24 * 3_300 },
  ],

  microTaxRateWithEmployee: 0.01,
  microTaxRateWithoutEmployee: 0.03,
  microRevenueLimitEUR: 300_000, // redus de la 500,000
  eurToRon: 4.97,

  corporateTaxRate: 0.16,

  dividendTaxRate: 0.08,
  dividendCassThresholdMonths: 6,
  dividendCassRate: 0.10,

  // CAM: 70 lei pe salariu minim 3,300
  employerContributionRate: 70 / 3_300,

  normaActivities: [
    { code: "6201", label: "Activități de realizare a software-ului (IT)", annualNorma: 40_000 },
    { code: "6202", label: "Consultanță IT", annualNorma: 40_000 },
    { code: "7022", label: "Consultanță pentru afaceri și management", annualNorma: 35_000 },
    { code: "4941", label: "Transport rutier de mărfuri", annualNorma: 42_000 },
    { code: "4932", label: "Transporturi cu taxiuri", annualNorma: 32_000 },
    { code: "8621", label: "Activități de asistență medicală generală", annualNorma: 38_000 },
    { code: "8623", label: "Activități de asistență stomatologică", annualNorma: 45_000 },
    { code: "6910", label: "Activități juridice (avocatură)", annualNorma: 40_000 },
    { code: "7111", label: "Activități de arhitectură", annualNorma: 30_000 },
    { code: "7112", label: "Activități de inginerie", annualNorma: 30_000 },
    { code: "5610", label: "Restaurante", annualNorma: 35_000 },
    { code: "4711", label: "Comerț cu amănuntul", annualNorma: 25_000 },
    { code: "9602", label: "Coafură și alte activități de înfrumusețare", annualNorma: 18_000 },
    { code: "4520", label: "Întreținerea și repararea autovehiculelor", annualNorma: 28_000 },
    { code: "4321", label: "Lucrări de instalații electrice", annualNorma: 26_000 },
  ],
};
