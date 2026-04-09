import normeData from "./norme-venit-2025.json";

interface NormaEntry {
  caen: string;
  label: string;
  norma: number;
}

type NormeByCounty = Record<string, NormaEntry[]>;

const data = normeData as NormeByCounty;

/** All available counties sorted alphabetically */
export const COUNTIES: readonly string[] = Object.keys(data).sort();

/**
 * Get the norma de venit for a specific CAEN code in a specific county.
 * Returns the norma value in RON, or null if not found.
 */
export function getNormaForCounty(
  county: string,
  caenCode: string
): number | null {
  const activities = data[county];
  if (!activities) return null;

  const match = activities.find((a) => a.caen === caenCode);
  return match ? match.norma : null;
}

/**
 * Get all activities available for norma de venit in a specific county.
 */
export function getActivitiesForCounty(
  county: string
): readonly NormaEntry[] {
  return data[county] || [];
}

/**
 * Get unique CAEN codes that exist across all counties.
 */
export function getAllCaenCodes(): readonly string[] {
  const codes = new Set<string>();
  for (const activities of Object.values(data)) {
    for (const a of activities) {
      codes.add(a.caen);
    }
  }
  return [...codes].sort();
}
