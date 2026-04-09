import type { CalculatorInputs, TaxResult, TaxLineItem, YearConfig } from "../types";
import { calculatePfaCAS, calculatePfaCASS } from "../shared";

/**
 * Calculate taxes for PFA - Sistem Real (real income system).
 *
 * Art. 68 Cod Fiscal: CAS and CASS are deductible expenses for PFA.
 *
 * 1. Net income = Gross - Deductible expenses
 * 2. CAS = fixed bracket (25% of 12x or 24x min wage)
 * 3. CASS = 10% of net income (floor 6x, cap 72x min wage)
 * 4. Income tax = 10% of (net income - CAS - CASS)  <-- CAS/CASS are deductible!
 * 5. Bani in mana = gross - expenses - CAS - CASS - income tax
 */
export function calculatePfaReal(
  inputs: CalculatorInputs,
  config: YearConfig
): TaxResult {
  const { grossMonthlyIncome, monthsOfActivity, monthlyExpenses, personalStatus } =
    inputs;
  const warnings: string[] = [];

  const annualGross = grossMonthlyIncome * monthsOfActivity;
  const annualExpenses = Math.min(monthlyExpenses * monthsOfActivity, annualGross);
  const annualNetIncome = annualGross - annualExpenses;

  // CAS and CASS are calculated on net income (gross - expenses)
  const cas = calculatePfaCAS(annualNetIncome, config, personalStatus);
  const cass = calculatePfaCASS(annualNetIncome, config, personalStatus);

  // Income tax: 10% of (net income - CAS - CASS)
  // Art. 68 Cod Fiscal: CAS and CASS paid by PFA are deductible expenses
  const taxableIncome = Math.max(0, annualNetIncome - cas - cass);
  const incomeTax = taxableIncome * config.incomeTaxRate;

  const totalTaxes = incomeTax + cas + cass;

  // "Bani in mana" = gross - expenses - all taxes
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
    warnings.push("Angajat in alta parte - CAS si CASS nu se datoreaza");
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
    { label: "CASS (sanatate)", amount: -cass, note: `${config.cassRate * 100}% din venit` },
    { label: "CAS (pensie)", amount: -cas, note: cas > 0 ? "fix pe prag" : "sub prag" },
    {
      label: "Impozit pe venit",
      amount: -incomeTax,
      note: `${config.incomeTaxRate * 100}% din (venit - CAS - CASS)`,
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
    sustainable: true,
  };
}
