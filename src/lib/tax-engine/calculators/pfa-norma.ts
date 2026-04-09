import type { CalculatorInputs, TaxResult, TaxLineItem, YearConfig } from "../types";
import { calculatePfaCAS } from "../shared";

/**
 * Calculate taxes for PFA - Norma de Venit (fixed income norm system).
 *
 * KEY DIFFERENCE from Sistem Real:
 * ALL taxes are calculated on the NORMA, not on actual income.
 * CAS/CASS are NOT deducted from the income tax base.
 *
 * Source: universulfiscal.ro, Cod Fiscal
 * - Income tax = 10% of norma (direct, no deductions)
 * - CASS = 10% of norma (direct, not progressive)
 * - CAS = 25% fixed bracket IF norma exceeds threshold
 * - Net = actual gross income - taxes (taxes based on norma, not gross)
 */
export function calculatePfaNorma(
  inputs: CalculatorInputs,
  config: YearConfig
): TaxResult {
  const {
    grossMonthlyIncome,
    monthsOfActivity,
    activityType,
    personalStatus,
  } = inputs;
  const warnings: string[] = [];

  const annualGross = grossMonthlyIncome * monthsOfActivity;

  const activity = config.normaActivities.find(
    (a) => a.code === activityType
  );

  if (!activity) {
    warnings.push(
      "Activitatea selectata nu are norma de venit definita."
    );
    return createFallbackResult(annualGross, monthsOfActivity, warnings);
  }

  // Prorate norma by months of activity
  const annualNorma = activity.annualNorma * (monthsOfActivity / 12);

  // CAS: fixed bracket based on NORMA value (not actual income)
  const cas = calculatePfaCAS(annualNorma, config, personalStatus);

  // CASS: 10% of NORMA directly (not progressive like sistem real)
  // Exemptions: employed elsewhere, student, handicap, pensioner
  const isExempted =
    personalStatus.isEmployedElsewhere ||
    personalStatus.isStudent ||
    personalStatus.isHandicapped ||
    personalStatus.isPensioner;
  const cass = isExempted ? 0 : annualNorma * config.cassRate;

  // Income tax: 10% of NORMA directly (NO deduction of CAS/CASS)
  const incomeTax = annualNorma * config.incomeTaxRate;

  const totalTaxes = incomeTax + cas + cass;
  // "Bani in mana" = actual gross - taxes (taxes are based on norma, not gross)
  const netAnnualIncome = annualGross - totalTaxes;

  warnings.push(
    `Taxele se calculeaza pe norma fixa de ${activity.annualNorma.toLocaleString("ro-RO")} lei/an, nu pe venitul real. Cu cat castigi mai mult peste norma, cu atat e mai avantajos.`
  );

  if (personalStatus.isEmployedElsewhere) {
    warnings.push("Angajat in alta parte - CAS si CASS nu se datoreaza");
  }

  // 25,000 EUR threshold warning
  const eurThreshold = 25_000;
  const grossInEur = annualGross / config.eurToRon;
  if (grossInEur > eurThreshold) {
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
  };
}
