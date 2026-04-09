import type { CalculatorInputs, TaxResult, TaxLineItem, YearConfig } from "../types";
import { calculatePfaCAS } from "../shared";
import { getNormaForCounty, isNormaEstimated } from "../norme-lookup";

/**
 * Calculate taxes for PFA - Norma de Venit (fixed income norm system).
 *
 * KEY DIFFERENCE from Sistem Real:
 * ALL taxes are calculated on the NORMA, not on actual income.
 * CAS/CASS are NOT deducted from the income tax base.
 *
 * Norma values come from ANAF county-specific PDFs (2025 data).
 * Falls back to config default if county data unavailable.
 */
export function calculatePfaNorma(
  inputs: CalculatorInputs,
  config: YearConfig
): TaxResult {
  const {
    grossMonthlyIncome,
    monthsOfActivity,
    activityType,
    county,
    personalStatus,
  } = inputs;
  const warnings: string[] = [];

  const annualGross = grossMonthlyIncome * monthsOfActivity;

  // Try county-specific norma from ANAF data first, fall back to config
  let annualNormaFull: number | null = null;
  let normaSource = "";

  if (county) {
    annualNormaFull = getNormaForCounty(county, activityType, inputs.year);
    if (annualNormaFull) {
      normaSource = county;
    }
  }

  // Fallback to config defaults
  if (!annualNormaFull) {
    const activity = config.normaActivities.find(
      (a) => a.code === activityType
    );
    if (activity) {
      annualNormaFull = activity.annualNorma;
      normaSource = "medie nationala";
    }
  }

  if (!annualNormaFull) {
    warnings.push(
      "Activitatea selectata nu are norma de venit definita pentru acest judet."
    );
    return createFallbackResult(annualGross, monthsOfActivity, warnings);
  }

  // Prorate norma by months of activity
  const annualNorma = annualNormaFull * (monthsOfActivity / 12);

  // CAS: fixed bracket based on NORMA value (not actual income)
  const cas = calculatePfaCAS(annualNorma, config, personalStatus);

  // CASS: 10% of NORMA directly (not progressive like sistem real)
  const isExempted =
    personalStatus.isEmployedElsewhere ||
    personalStatus.isStudent ||
    personalStatus.isHandicapped ||
    personalStatus.isPensioner;
  const cass = isExempted ? 0 : annualNorma * config.cassRate;

  // Income tax: 10% of NORMA directly (NO deduction of CAS/CASS)
  const incomeTax = annualNorma * config.incomeTaxRate;

  const totalTaxes = incomeTax + cas + cass;
  const netAnnualIncome = annualGross - totalTaxes;

  const estimated = isNormaEstimated(inputs.year);
  warnings.push(
    `Norma ${normaSource}: ${annualNormaFull.toLocaleString("ro-RO")} lei/an${estimated ? " (date ANAF 2025, norme " + inputs.year + " inca nepublicate)" : " (date ANAF)"}. Taxele se calculeaza pe aceasta suma fixa.`
  );

  if (personalStatus.isEmployedElsewhere) {
    warnings.push("Angajat in alta parte - CAS si CASS nu se datoreaza");
  }

  // 25,000 EUR threshold warning
  const eurThreshold = 25_000;
  const grossInEur = annualGross / config.eurToRon;
  const exceedsNormaLimit = grossInEur > eurThreshold;
  if (exceedsNormaLimit) {
    warnings.push(
      `Venit depaseste ${eurThreshold.toLocaleString()} EUR - obligatoriu trecere la sistem real anul urmator`
    );
  }

  const breakdown: TaxLineItem[] = [
    {
      label: "Venit Net",
      amount: annualGross,
      note: `${monthsOfActivity} luni`,
    },
    {
      label: "CASS (sanatate)",
      amount: -cass,
      note: cass > 0 ? `${config.cassRate * 100}% din norma` : "scutit",
    },
    {
      label: "CAS (pensie)",
      amount: -cas,
      note: cas > 0 ? "fix pe prag" : "norma sub prag",
    },
    {
      label: "Impozit pe venit",
      amount: -incomeTax,
      note: `${config.incomeTaxRate * 100}% din norma`,
    },
  ];

  return {
    structureType: "pfa-norma",
    label: "PFA (Norma)",
    grossAnnualIncome: annualGross,
    breakdown,
    totalTaxes,
    netAnnualIncome,
    effectiveTaxRate: annualGross > 0 ? totalTaxes / annualGross : 0,
    warnings,
    sustainable: !exceedsNormaLimit,
  };
}

function createFallbackResult(
  annualGross: number,
  monthsOfActivity: number,
  warnings: string[]
): TaxResult {
  return {
    structureType: "pfa-norma",
    label: "PFA (Norma)",
    grossAnnualIncome: annualGross,
    breakdown: [
      {
        label: "Venit Net",
        amount: annualGross,
        note: `${monthsOfActivity} luni`,
      },
    ],
    totalTaxes: 0,
    netAnnualIncome: annualGross,
    effectiveTaxRate: 0,
    warnings,
    sustainable: true,
  };
}
