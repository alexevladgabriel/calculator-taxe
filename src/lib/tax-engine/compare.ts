import type { CalculatorInputs, ComparisonResult, TaxResult } from "./types";
import { getYearConfig } from "./registry";
import { calculateAngajat } from "./calculators/angajat";
import { calculatePfaReal } from "./calculators/pfa-real";
import { calculatePfaNorma } from "./calculators/pfa-norma";
import { calculateSrlMicro } from "./calculators/srl-micro";
import { calculateSrlStandard } from "./calculators/srl-standard";

/**
 * Run all 5 tax structure calculators and compare results.
 * Returns results sorted by net income (highest first) with the winner identified.
 *
 * Unsustainable options (e.g. PFA Norma over 25k EUR) are sorted last
 * and can never be the winner - even if they yield the highest net income,
 * they cannot be maintained beyond the current year.
 */
export function compareAllStructures(
  inputs: CalculatorInputs
): ComparisonResult {
  const config = getYearConfig(inputs.year);

  const results: TaxResult[] = [
    calculateAngajat(inputs, config),
    calculatePfaReal(inputs, config),
    calculatePfaNorma(inputs, config),
    calculateSrlMicro(inputs, config),
    calculateSrlStandard(inputs, config),
  ];

  // Sort: sustainable first (by net income desc), then unsustainable last (by net income desc)
  const sorted = [...results].sort((a, b) => {
    if (a.sustainable !== b.sustainable) {
      return a.sustainable ? -1 : 1;
    }
    return b.netAnnualIncome - a.netAnnualIncome;
  });

  // Winner must be sustainable
  const winner =
    sorted.find((r) => r.sustainable) ?? sorted[0];

  return {
    results: sorted,
    winner,
    yearConfig: config,
  };
}
