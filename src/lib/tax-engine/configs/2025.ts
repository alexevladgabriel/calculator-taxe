import type { YearConfig } from "../types";

/**
 * Romanian tax parameters for 2025.
 * Source: HG 1396/2024, Cod Fiscal.
 * - Salariu minim brut: 3,700 RON/luna
 * - SRL Impozit dividende: 8%
 * - SRL Micro prag: 300,000 EUR
 * - CAM: proportional (~2.1%)
 */
export const config2025: YearConfig = {
  year: 2025,
  minimumGrossWage: 3_700,

  casRate: 0.25, // include pilonul 2 (4.75%)
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
    { maxGross: 3_100, deduction: 80 },
    { maxGross: 3_200, deduction: 60 },
    { maxGross: 3_300, deduction: 40 },
    { maxGross: 3_400, deduction: 20 },
    { maxGross: Infinity, deduction: 0 },
  ],

  pfaCasThresholdMonths: 12,
  pfaCasRate: 0.25,
  pfaCassThresholds: [
    { minIncome: 6 * 3_700, cassBase: 6 * 3_700 },
    { minIncome: 12 * 3_700, cassBase: 12 * 3_700 },
    { minIncome: 24 * 3_700, cassBase: 24 * 3_700 },
  ],

  microTaxRateWithEmployee: 0.01,
  microTaxRateWithoutEmployee: 0.03,
  microRevenueLimitEUR: 300_000,
  eurToRon: 4.98,

  corporateTaxRate: 0.16,

  dividendTaxRate: 0.08,
  dividendCassThresholdMonths: 6,
  dividendCassRate: 0.10,

  // CAM proportional (similar la 2024)
  employerContributionRate: 78 / 3_700,

  normaActivities: [
    { code: "6201", label: "Activități de realizare a software-ului (IT)", annualNorma: 40_000 },
    { code: "6202", label: "Consultanță IT", annualNorma: 40_000 },
    { code: "7022", label: "Consultanță pentru afaceri și management", annualNorma: 36_000 },
    { code: "4941", label: "Transport rutier de mărfuri", annualNorma: 43_000 },
    { code: "4932", label: "Transporturi cu taxiuri", annualNorma: 33_000 },
    { code: "8621", label: "Activități de asistență medicală generală", annualNorma: 39_000 },
    { code: "8623", label: "Activități de asistență stomatologică", annualNorma: 46_000 },
    { code: "6910", label: "Activități juridice (avocatură)", annualNorma: 41_000 },
    { code: "7111", label: "Activități de arhitectură", annualNorma: 31_000 },
    { code: "7112", label: "Activități de inginerie", annualNorma: 31_000 },
    { code: "5610", label: "Restaurante", annualNorma: 36_000 },
    { code: "4711", label: "Comerț cu amănuntul", annualNorma: 26_000 },
    { code: "9602", label: "Coafură și alte activități de înfrumusețare", annualNorma: 19_000 },
    { code: "4520", label: "Întreținerea și repararea autovehiculelor", annualNorma: 29_000 },
    { code: "4321", label: "Lucrări de instalații electrice", annualNorma: 27_000 },
  ],
};
