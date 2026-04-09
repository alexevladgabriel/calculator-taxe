import type { CalculatorInputs, TaxResult, TaxLineItem, YearConfig } from "../types";
import { getPersonalDeduction } from "../shared";

/**
 * Calculate taxes for an Employee (Angajat) with a standard employment contract.
 *
 * Validated against real payslips (March 2025, Dec 2024).
 *
 * Monthly deductions from gross salary:
 * 1. CAS (pension) = 25% of gross (NOT including meal tickets)
 * 2. CASS (health) = 10% of (gross + meal tickets value)
 * 3. Income tax = 10% of (gross - CAS - CASS + meal tickets - personal deduction)
 *
 * Special cases:
 * - Persoane cu handicap grav/accentuat: scutite de impozit pe venit (Art. 60 Cod Fiscal)
 * - Pensionari: pot fi scutiti de CAS
 */
export function calculateAngajat(
  inputs: CalculatorInputs,
  config: YearConfig
): TaxResult {
  const {
    grossMonthlyIncome,
    monthsOfActivity,
    personalStatus,
    mealTicketsPerMonth,
    mealTicketValue,
  } = inputs;
  const warnings: string[] = [];

  const monthlyMealTickets = mealTicketsPerMonth * mealTicketValue;

  // CAS - calculated on gross only (meal tickets NOT included)
  const monthlyCAS = personalStatus.isPensioner
    ? 0
    : grossMonthlyIncome * config.casRate;

  // CASS - calculated on gross + meal tickets
  const cassBase = grossMonthlyIncome + monthlyMealTickets;
  const monthlyCASS = cassBase * config.cassRate;

  const personalDeduction = getPersonalDeduction(grossMonthlyIncome, config);

  // Taxable base = gross - CAS - CASS + meal tickets - personal deduction
  const monthlyTaxableBase = Math.max(
    0,
    grossMonthlyIncome - monthlyCAS - monthlyCASS + monthlyMealTickets - personalDeduction
  );

  // Income tax
  const monthlyIncomeTax = personalStatus.isHandicapped
    ? 0
    : monthlyTaxableBase * config.incomeTaxRate;

  // Scale to active months
  const annualGross = grossMonthlyIncome * monthsOfActivity;
  const annualMealTickets = monthlyMealTickets * monthsOfActivity;
  const annualCAS = monthlyCAS * monthsOfActivity;
  const annualCASS = monthlyCASS * monthsOfActivity;
  const annualIncomeTax = monthlyIncomeTax * monthsOfActivity;

  const totalTaxes = annualCAS + annualCASS + annualIncomeTax;
  // Net = gross - taxes (meal tickets are received separately, not from gross)
  const netAnnual = annualGross - totalTaxes;

  // Warnings
  if (personalStatus.isHandicapped) {
    warnings.push(
      "Scutit de impozit pe venit (Art. 60 Cod Fiscal - handicap grav/accentuat)"
    );
  }

  if (personalStatus.isPensioner) {
    warnings.push("Pensionar - CAS nu se datoreaza");
  }

  if (personalStatus.isStudent) {
    warnings.push(
      "Student - verificati daca beneficiati de facilitati fiscale specifice"
    );
  }

  if (personalDeduction > 0) {
    warnings.push(
      `Deducere personala: ${personalDeduction} lei/luna aplicata`
    );
  }

  if (monthlyMealTickets > 0) {
    warnings.push(
      `Tichete de masa: ${mealTicketsPerMonth} x ${mealTicketValue} lei = ${monthlyMealTickets} lei/luna (incluse in baza CASS si impozit)`
    );
  }

  const breakdown: TaxLineItem[] = [
    { label: "Venit Brut", amount: annualGross, note: `${monthsOfActivity} luni` },
    {
      label: "CAS (pensie)",
      amount: -annualCAS,
      note: personalStatus.isPensioner ? "scutit" : `${config.casRate * 100}% (incl. pilonul 2)`,
    },
    {
      label: "CASS (sanatate)",
      amount: -annualCASS,
      note: monthlyMealTickets > 0
        ? `${config.cassRate * 100}% (incl. tichete)`
        : `${config.cassRate * 100}%`,
    },
    {
      label: "Impozit pe venit",
      amount: -annualIncomeTax,
      note: personalStatus.isHandicapped ? "scutit" : `${config.incomeTaxRate * 100}%`,
    },
  ];

  if (annualMealTickets > 0) {
    breakdown.push({
      label: "Tichete de masa",
      amount: annualMealTickets,
      note: `${mealTicketsPerMonth} buc x ${mealTicketValue} lei`,
    });
  }

  return {
    structureType: "angajat",
    label: "Angajat",
    grossAnnualIncome: annualGross,
    breakdown,
    totalTaxes,
    netAnnualIncome: netAnnual,
    effectiveTaxRate: annualGross > 0 ? totalTaxes / annualGross : 0,
    warnings,
  };
}
