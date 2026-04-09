import type { CalculatorInputs, TaxResult, TaxLineItem, YearConfig } from "../types";
import { calculateDividendCASS, calculateMinWageEmployeeCost } from "../shared";

/**
 * Calculate taxes for SRL Micro-enterprise.
 *
 * Turnover tax: 1% (with employee) or 3% (without employee)
 * Must pay at least 1 employee at minimum wage (if hasEmployee)
 * Remaining profit → dividends → 8% dividend tax + CASS if above threshold
 *
 * Flow:
 * 1. Revenue = gross income
 * 2. Turnover tax = 1% or 3% of revenue
 * 3. Employee cost (if applicable) = gross salary + employer contributions
 * 4. Net company profit = revenue - turnover tax - employee cost
 * 5. Dividend tax = 8% of dividends distributed
 * 6. CASS on dividends if above threshold
 * 7. "Bani în mână" = dividends - dividend tax - dividend CASS
 */
export function calculateSrlMicro(
  inputs: CalculatorInputs,
  config: YearConfig
): TaxResult {
  const { grossMonthlyIncome, monthsOfActivity, personalStatus, srlHasEmployee } =
    inputs;
  const warnings: string[] = [];

  const annualRevenue = grossMonthlyIncome * monthsOfActivity;

  // Check micro revenue limit
  const microLimitRON = config.microRevenueLimitEUR * config.eurToRon;
  if (annualRevenue > microLimitRON) {
    warnings.push(
      `Venituri depășesc plafonul micro (${config.microRevenueLimitEUR.toLocaleString()} EUR). Se aplică impozit pe profit.`
    );
  }

  // Turnover tax
  const microRate = srlHasEmployee
    ? config.microTaxRateWithEmployee
    : config.microTaxRateWithoutEmployee;
  const turnoverTax = annualRevenue * microRate;

  // Employee cost (the SRL must pay at least 1 employee at min wage)
  let annualEmployeeCost = 0;
  let annualEmployeeTaxes = 0; // The taxes part the employee pays (CAS+CASS+income tax)
  if (srlHasEmployee) {
    const empCost = calculateMinWageEmployeeCost(config);
    annualEmployeeCost = empCost.annualTotalCost;

    // The employee also pays their own CAS, CASS, income tax from gross
    // These are withheld by the company but are a cost to the company
    // (the company pays gross, not net)
    annualEmployeeTaxes =
      empCost.monthlyGross *
      (config.casRate + config.cassRate) *
      12;
    // Plus employer's contribution (CAM)
    annualEmployeeTaxes += empCost.monthlyEmployerCost * 12;
  }

  // Net profit in the company
  const netCompanyProfit = Math.max(
    0,
    annualRevenue - turnoverTax - annualEmployeeCost
  );

  // Dividends = all remaining profit distributed
  const dividends = netCompanyProfit;
  const dividendTax = dividends * config.dividendTaxRate;
  const dividendCass = calculateDividendCASS(
    dividends,
    config,
    personalStatus
  );

  // Total taxes = turnover tax + employee salaries/taxes + dividend tax + CASS
  const totalTaxes = turnoverTax + annualEmployeeCost + dividendTax + dividendCass;

  // "Bani în mână" = dividends - dividend tax - dividend CASS
  const netAnnualIncome = dividends - dividendTax - dividendCass;

  if (srlHasEmployee) {
    warnings.push(
      `Include cost angajat pe salariu minim (${config.minimumGrossWage.toLocaleString("ro-RO")} lei/lună brut)`
    );
  }

  const breakdown: TaxLineItem[] = [
    {
      label: "Venit Net",
      amount: annualRevenue,
      note: `${monthsOfActivity} luni`,
    },
    {
      label: "Impozit pe venit",
      amount: -turnoverTax,
      note: `${microRate * 100}% cifra de afaceri`,
    },
    {
      label: "Impozit dividende",
      amount: -dividendTax,
      note: `${config.dividendTaxRate * 100}%`,
    },
    {
      label: "CASS (sănătate)",
      amount: -dividendCass,
      note: dividendCass > 0 ? `${config.dividendCassRate * 100}%` : "sub prag",
    },
  ];

  if (srlHasEmployee) {
    breakdown.push({
      label: "Taxe salariale",
      amount: -annualEmployeeCost,
      note: "angajat pe salariu minim",
    });
  }

  return {
    structureType: "srl-micro",
    label: srlHasEmployee ? "SRL Micro (1%)" : "SRL Micro (3%)",
    grossAnnualIncome: annualRevenue,
    breakdown,
    totalTaxes,
    netAnnualIncome,
    effectiveTaxRate: annualRevenue > 0 ? totalTaxes / annualRevenue : 0,
    warnings,
    sustainable: true,
  };
}
