import normeData2024 from "./norme-venit-2024.json";
import normeData2025 from "./norme-venit-2025.json";

interface NormaEntry {
  caen: string;
  label: string;
  norma: number;
}

type NormeByCounty = Record<string, NormaEntry[]>;

const dataByYear: Record<number, NormeByCounty> = {
  2024: normeData2024 as NormeByCounty,
  2025: normeData2025 as NormeByCounty,
  // 2026 uses 2025 data until ANAF publishes new norms
  2026: normeData2025 as NormeByCounty,
};

/** Get the norma dataset for a specific year. Falls back to 2025. */
function getDataForYear(year: number): NormeByCounty {
  return dataByYear[year] || dataByYear[2025];
}

/** All available counties (union of all years) sorted alphabetically */
export const COUNTIES: readonly string[] = (() => {
  const all = new Set<string>();
  for (const data of Object.values(dataByYear)) {
    for (const county of Object.keys(data)) {
      all.add(county);
    }
  }
  return [...all].sort();
})();

/**
 * Get the norma de venit for a specific CAEN code in a specific county and year.
 * Returns the norma value in RON, or null if not found.
 */
export function getNormaForCounty(
  county: string,
  caenCode: string,
  year: number = 2025
): number | null {
  const data = getDataForYear(year);
  const activities = data[county];
  if (!activities) return null;

  const match = activities.find((a) => a.caen === caenCode);
  return match ? match.norma : null;
}

/**
 * Get all activities available for norma de venit in a specific county and year.
 */
export function getActivitiesForCounty(
  county: string,
  year: number = 2025
): readonly NormaEntry[] {
  const data = getDataForYear(year);
  return data[county] || [];
}

/**
 * Check if a year uses estimated (previous year) norma data.
 */
export function isNormaEstimated(year: number): boolean {
  return year >= 2026;
}
