export { compareAllStructures } from "./compare";
export { getYearConfig, getAvailableYears, getDefaultYear } from "./registry";
export { calculateAngajat } from "./calculators/angajat";
export { calculatePfaReal } from "./calculators/pfa-real";
export { calculatePfaNorma } from "./calculators/pfa-norma";
export { calculateSrlMicro } from "./calculators/srl-micro";
export { calculateSrlStandard } from "./calculators/srl-standard";
export { structureDescriptions } from "./descriptions";
export { structureColors } from "./colors";
export type { StructureColors } from "./colors";
export type { StructureDescription } from "./descriptions";
export type {
  CalculatorInputs,
  ComparisonResult,
  TaxResult,
  TaxLineItem,
  YearConfig,
  StructureType,
  PersonalStatus,
  NormaActivity,
} from "./types";
