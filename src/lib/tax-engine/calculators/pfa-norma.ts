import type { CalculatorInputs, TaxResult, TaxLineItem, YearConfig } from "../types";
import { calculatePfaCAS, calculatePfaCASS } from "../shared";

/**
 * Calculate taxes for PFA  - Norma de Venit (fixed income norm system).
 *
 * The taxable base is a fixed "norma" amount set by authorities per activity.
 * Income tax = 10% of norma (prorated by months of activity)
 * CAS/CASS are determined by the norma value as the income base.
 * Net = Actual gross income - taxes (taxes are based on norma, not actual income).
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

  // Find the norma for this activity
  const activity = config.normaActivities.find(
    (a) => a.code === activityType
  );

  if (!activity) {
    warnings.push(
      "Activitatea selectată nu are normă de venit definită. Calculul folosește PFA Sistem Real."
    );
    // Fall back to a zero norma  - effectively no PFA norma calculation
    return createFallbackResult(annualGross, monthsOfActivity, warnings);
  }

  // Prorate norma by months of activity
  const annualNorma = activity.annualNorma * (monthsOfActivity / 12);

  // Income tax on norma
  const incomeTax = annualNorma * config.incomeTaxRate;

  // CAS/CASS are based on norma value (the "declared income")
  const cas = calculatePfaCAS(annualNorma, config, personalStatus);
  const cass = calculatePfaCASS(annualNorma, config, personalStatus);

  const totalTaxes = incomeTax + cas + cass;
  const netAnnualIncome = annualGross - totalTaxes;

  if (personalStatus.isEmployedElsewhere) {
    warnings.push("Angajat în altă parte  - CAS și CASS nu se datorează");
  }

  warnings.push(
    `Norma de venit: ${activity.annualNorma.toLocaleString("ro-RO")} lei/an (${activity.label})`
  );

  const breakdown: TaxLineItem[] = [
    {
      label: "Venit Net",
      amount: annualGross,
      note: `${monthsOfActivity} luni`,
    },
    {
      label: "CASS (sănătate)",
      amount: -cass,
      note: `${config.cassRate * 100}%`,
    },
    {
      label: "CAS (pensie)",
      amount: -cas,
      note: cas > 0 ? `${config.pfaCasRate * 100}%` : "sub prag",
    },
    {
      label: "Impozit pe venit",
      amount: -incomeTax,
      note: `${config.incomeTaxRate * 100}% din normă`,
    },
  ];

  return {
    structureType: "pfa-norma",
    label: "PFA (Normă)",
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
    label: "PFA (Normă)",
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
