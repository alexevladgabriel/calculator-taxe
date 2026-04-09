import type { YearConfig } from "../types";

/**
 * Romanian tax parameters for 2026.
 *
 * Sources: Solo.ro calculator 2026, Cod Fiscal actualizat.
 * - Salariu minim brut: 4,050 RON/luna
 * - CAS: 25% (include pilonul 2 de 4.75%)
 * - CASS: 10%, praguri 6x/12x/24x/72x salariu minim
 * - SRL Micro: 1% unic (fara distinctie cu/fara angajat)
 * - SRL Impozit profit: 16%
 * - SRL Impozit dividende: 16% (majorat de la 8% in 2025)
 * - PFA Norma de venit IT: 40,000 RON/an
 * - CAM: ~2.07% (84 lei pe salariu minim de 4,050)
 * - NOTA: Din 1 iulie 2026, salariul minim creste la 4,325 lei
 *   (calculele folosesc 4,050 pentru prima jumatate a anului)
 */
export const config2026: YearConfig = {
  year: 2026,
  minimumGrossWage: 4_050,

  // ── Employee ──
  casRate: 0.25, // include pilonul 2 (4.75%)
  cassRate: 0.10,
  incomeTaxRate: 0.10,
  // Art. 77 Cod Fiscal - 0 dependents
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

  // ── PFA ──
  // CAS: obligatoriu daca venit net >= 12x salariu minim
  // Baza CAS: fix 12x (48,600) sau 24x (97,200) salariu minim
  pfaCasThresholdMonths: 12,
  pfaCasRate: 0.25,
  // CASS praguri: 6x / 12x / 24x / 72x salariu minim
  // Minim CASS: 2,430 lei (6 x 4,050 x 10%)
  // Maxim CASS: 29,160 lei (72 x 4,050 x 10%)
  pfaCassThresholds: [
    { minIncome: 6 * 4_050, cassBase: 6 * 4_050 },
    { minIncome: 12 * 4_050, cassBase: 12 * 4_050 },
    { minIncome: 24 * 4_050, cassBase: 24 * 4_050 },
    { minIncome: 72 * 4_050, cassBase: 72 * 4_050 },
  ],

  // ── SRL Micro ──
  // 2026: rata unica 1% (fara distinctie cu/fara angajat)
  microTaxRateWithEmployee: 0.01,
  microTaxRateWithoutEmployee: 0.01,
  microRevenueLimitEUR: 300_000,
  eurToRon: 4.99,

  // ── SRL Standard ──
  corporateTaxRate: 0.16,

  // ── Dividends (MAJORAT in 2026: 16% vs 8% in 2025) ──
  dividendTaxRate: 0.16,
  dividendCassThresholdMonths: 6,
  dividendCassRate: 0.10,

  // ── Employer costs ──
  // CAM: 84 lei pe salariu minim 4,050 = ~2.074%
  employerContributionRate: 84 / 4_050,

  // ── Norma de Venit (actualizat 2026) ──
  normaActivities: [
    { code: "6201", label: "Activități de realizare a software-ului (IT)", annualNorma: 40_000 },
    { code: "6202", label: "Consultanță IT", annualNorma: 40_000 },
    { code: "7022", label: "Consultanță pentru afaceri și management", annualNorma: 45_000 },
    { code: "4941", label: "Transport rutier de mărfuri", annualNorma: 50_000 },
    { code: "4932", label: "Transporturi cu taxiuri", annualNorma: 38_000 },
    { code: "8621", label: "Activități de asistență medicală generală", annualNorma: 45_000 },
    { code: "8623", label: "Activități de asistență stomatologică", annualNorma: 52_000 },
    { code: "6910", label: "Activități juridice (avocatură)", annualNorma: 48_000 },
    { code: "7111", label: "Activități de arhitectură", annualNorma: 36_000 },
    { code: "7112", label: "Activități de inginerie", annualNorma: 36_000 },
    { code: "5610", label: "Restaurante", annualNorma: 42_000 },
    { code: "4711", label: "Comerț cu amănuntul", annualNorma: 30_000 },
    { code: "9602", label: "Coafură și alte activități de înfrumusețare", annualNorma: 22_000 },
    { code: "4520", label: "Întreținerea și repararea autovehiculelor", annualNorma: 34_000 },
    { code: "4321", label: "Lucrări de instalații electrice", annualNorma: 32_000 },
  ],
};
