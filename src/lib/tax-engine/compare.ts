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

  // Sort by net annual income descending (best option first)
  const sorted = [...results].sort(
    (a, b) => b.netAnnualIncome - a.netAnnualIncome
  );

  return {
    results: sorted,
    winner: sorted[0],
    yearConfig: config,
  };
}
