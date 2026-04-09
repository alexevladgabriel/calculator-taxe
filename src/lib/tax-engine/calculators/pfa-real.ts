import type { CalculatorInputs, TaxResult, TaxLineItem, YearConfig } from "../types";
import { calculatePfaCAS, calculatePfaCASS } from "../shared";

/**
 * Calculate taxes for PFA  - Sistem Real (real income system).
 *
 * Net income = Gross income - Deductible expenses
 * Income tax = 10% of net income
 * CAS = 25% (if net income >= threshold, capped between 12-24 × min wage)
 * CASS = 10% (stepped thresholds at 6/12/24 × min wage)
 */
export function calculatePfaReal(
  inputs: CalculatorInputs,
  config: YearConfig
): TaxResult {
  const { grossMonthlyIncome, monthsOfActivity, monthlyExpenses, personalStatus } =
    inputs;
  const warnings: string[] = [];

  const annualGross = grossMonthlyIncome * monthsOfActivity;
  // Expenses can't exceed gross income
  const annualExpenses = Math.min(monthlyExpenses * monthsOfActivity, annualGross);
  const annualNetIncome = annualGross - annualExpenses;

  // Income tax on net income
  const incomeTax = annualNetIncome * config.incomeTaxRate;

  // CAS (pension contribution)
  const cas = calculatePfaCAS(annualNetIncome, config, personalStatus);

  // CASS (health insurance)
  const cass = calculatePfaCASS(annualNetIncome, config, personalStatus);

  const totalTaxes = incomeTax + cas + cass;

  // "Bani in mana" = gross - expenses - taxes (real money you keep)
  const netAnnualIncome = annualGross - annualExpenses - totalTaxes;

  if (monthlyExpenses * monthsOfActivity > annualGross) {
    warnings.push(
      "Cheltuielile depasesc venitul - limitate la venitul brut"
    );
  }

  if (annualExpenses > 0) {
    warnings.push(
      `Cheltuieli deductibile: ${annualExpenses.toLocaleString("ro-RO")} lei/an`
    );
  }

  if (personalStatus.isEmployedElsewhere) {
    warnings.push("Angajat în altă parte  - CAS și CASS nu se datorează");
  }

  const breakdown: TaxLineItem[] = [
    {
      label: "Venit Net",
      amount: annualGross,
      note: `${monthsOfActivity} luni`,
    },
  ];

  if (annualExpenses > 0) {
    breakdown.push({
      label: "Cheltuieli deductibile",
      amount: -annualExpenses,
    });
  }

  breakdown.push(
    { label: "CASS (sănătate)", amount: -cass, note: `${config.cassRate * 100}%` },
    { label: "CAS (pensie)", amount: -cas, note: cas > 0 ? `${config.pfaCasRate * 100}%` : "sub prag" },
    {
      label: "Impozit pe venit",
      amount: -incomeTax,
      note: `${config.incomeTaxRate * 100}%`,
    }
  );

  return {
    structureType: "pfa-real",
    label: "PFA (Sistem Real)",
    grossAnnualIncome: annualGross,
    breakdown,
    totalTaxes,
    netAnnualIncome,
    effectiveTaxRate: annualGross > 0 ? totalTaxes / annualGross : 0,
    warnings,
  };
}
