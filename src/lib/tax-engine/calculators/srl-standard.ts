import type { CalculatorInputs, TaxResult, TaxLineItem, YearConfig } from "../types";
import { calculateDividendCASS } from "../shared";

/**
 * Calculate taxes for SRL Standard (impozit pe profit 16%).
 *
 * Flow:
 * 1. Revenue = gross income
 * 2. Expenses = deductible expenses
 * 3. Taxable profit = revenue - expenses
 * 4. Corporate tax = 16% of profit
 * 5. Net profit = profit - corporate tax
 * 6. Dividends = net profit
 * 7. Dividend tax = 8%
 * 8. CASS on dividends if above threshold
 * 9. "Bani în mână" = dividends - dividend tax - CASS
 */
export function calculateSrlStandard(
  inputs: CalculatorInputs,
  config: YearConfig
): TaxResult {
  const {
    grossMonthlyIncome,
    monthsOfActivity,
    monthlyExpenses,
    personalStatus,
  } = inputs;
  const warnings: string[] = [];

  const annualRevenue = grossMonthlyIncome * monthsOfActivity;
  const annualExpenses = Math.min(monthlyExpenses * monthsOfActivity, annualRevenue);
  const taxableProfit = annualRevenue - annualExpenses;

  if (monthlyExpenses * monthsOfActivity > annualRevenue) {
    warnings.push("Cheltuielile depasesc venitul - limitate la venitul brut");
  }

  // Corporate income tax
  const corporateTax = taxableProfit * config.corporateTaxRate;

  // Net profit available for dividends
  const netProfit = taxableProfit - corporateTax;
  const dividends = netProfit;

  // Dividend tax
  const dividendTax = dividends * config.dividendTaxRate;

  // CASS on dividends
  const dividendCass = calculateDividendCASS(
    dividends,
    config,
    personalStatus
  );

  const totalTaxes = corporateTax + dividendTax + dividendCass;
  const netAnnualIncome = dividends - dividendTax - dividendCass;

  if (annualExpenses > 0) {
    warnings.push(
      `Cheltuieli deductibile: ${annualExpenses.toLocaleString("ro-RO")} lei/an`
    );
  }

  const breakdown: TaxLineItem[] = [
    {
      label: "Venit Net",
      amount: annualRevenue,
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
    {
      label: "Impozit pe profit",
      amount: -corporateTax,
      note: `${config.corporateTaxRate * 100}%`,
    },
    {
      label: "Impozit dividende",
      amount: -dividendTax,
      note: `${config.dividendTaxRate * 100}%`,
    },
    {
      label: "CASS (Sănătate)",
      amount: -dividendCass,
      note: dividendCass > 0 ? `${config.dividendCassRate * 100}%` : "sub prag",
    }
  );

  return {
    structureType: "srl-standard",
    label: "SRL (Impozit Profit)",
    grossAnnualIncome: annualRevenue,
    breakdown,
    totalTaxes,
    netAnnualIncome,
    effectiveTaxRate: annualRevenue > 0 ? totalTaxes / annualRevenue : 0,
    warnings,
    sustainable: true,
  };
}
