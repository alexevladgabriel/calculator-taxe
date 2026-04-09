import type { StructureType } from "./types";

/**
 * Header accent color per structure type.
 * Angajat = gray, PFA = yellow/amber, SRL = green.
 * Winner highlight is always emerald green regardless of structure.
 */
export interface StructureColors {
  /** Header background (always the same, winner or not) */
  readonly headerBg: string;
}

export const structureColors: Record<StructureType, StructureColors> = {
  angajat: {
    headerBg: "bg-zinc-700",
  },
  "pfa-real": {
    headerBg: "bg-amber-500",
  },
  "pfa-norma": {
    headerBg: "bg-amber-600",
  },
  "srl-micro": {
    headerBg: "bg-emerald-600",
  },
  "srl-standard": {
    headerBg: "bg-emerald-700",
  },
};
