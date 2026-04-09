import type { YearConfig } from "../types";

/**
 * Romanian tax parameters for 2023.
 * Source: Verified spreadsheet data.
 * - Salariu minim brut: 3,000 RON/luna
 * - SRL Impozit dividende: 8% (majorat de la 5%)
 * - SRL Micro: 3% fara angajat / 1% cu angajat
 * - CAM: 63 lei (63/3000 = 2.1%)
 * - Praguri CASS: 6x/12x/24x
 */
export const config2023: YearConfig = {
  year: 2023,
  minimumGrossWage: 3_000,

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
    { maxGross: 3_100, deduction: 80 },
    { maxGross: 3_200, deduction: 60 },
    { maxGross: 3_300, deduction: 40 },
    { maxGross: 3_400, deduction: 20 },
    { maxGross: Infinity, deduction: 0 },
  ],

  pfaCasThresholdMonths: 12,
  pfaCasRate: 0.25,
  pfaCassThresholds: [
    { minIncome: 6 * 3_000, cassBase: 6 * 3_000 },
    { minIncome: 12 * 3_000, cassBase: 12 * 3_000 },
    { minIncome: 24 * 3_000, cassBase: 24 * 3_000 },
  ],

  microTaxRateWithEmployee: 0.01,
  microTaxRateWithoutEmployee: 0.03,
  microRevenueLimitEUR: 500_000,
  eurToRon: 4.95,

  corporateTaxRate: 0.16,

  dividendTaxRate: 0.08, // 8% din 2023
  dividendCassThresholdMonths: 6,
  dividendCassRate: 0.10,

  // CAM: 63 lei pe salariu minim 3,000
  employerContributionRate: 63 / 3_000,

  normaActivities: [
    { code: "6201", label: "Activități de realizare a software-ului (IT)", annualNorma: 38_000 },
    { code: "6202", label: "Consultanță IT", annualNorma: 38_000 },
    { code: "7022", label: "Consultanță pentru afaceri și management", annualNorma: 34_000 },
    { code: "4941", label: "Transport rutier de mărfuri", annualNorma: 41_000 },
    { code: "4932", label: "Transporturi cu taxiuri", annualNorma: 31_000 },
    { code: "8621", label: "Activități de asistență medicală generală", annualNorma: 37_000 },
    { code: "8623", label: "Activități de asistență stomatologică", annualNorma: 44_000 },
    { code: "6910", label: "Activități juridice (avocatură)", annualNorma: 39_000 },
    { code: "7111", label: "Activități de arhitectură", annualNorma: 29_000 },
    { code: "7112", label: "Activități de inginerie", annualNorma: 29_000 },
    { code: "5610", label: "Restaurante", annualNorma: 34_000 },
    { code: "4711", label: "Comerț cu amănuntul", annualNorma: 24_000 },
    { code: "9602", label: "Coafură și alte activități de înfrumusețare", annualNorma: 17_000 },
    { code: "4520", label: "Întreținerea și repararea autovehiculelor", annualNorma: 27_000 },
    { code: "4321", label: "Lucrări de instalații electrice", annualNorma: 25_000 },
  ],
};
