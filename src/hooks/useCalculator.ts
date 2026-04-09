"use client";

import { useState, useMemo } from "react";
import {
  compareAllStructures,
  getDefaultYear,
  type CalculatorInputs,
  type ComparisonResult,
  type PersonalStatus,
} from "@/lib/tax-engine";

const DEFAULT_STATUS: PersonalStatus = {
  isStudent: false,
  isHandicapped: false,
  isEmployedElsewhere: false,
  isPensioner: false,
};

export interface CalculatorState {
  readonly grossMonthlyIncome: number;
  readonly monthsOfActivity: number;
  readonly monthlyExpenses: number;
  readonly activityType: string;
  readonly county: string;
  readonly personalStatus: PersonalStatus;
  readonly year: number;
  readonly srlHasEmployee: boolean;
  readonly mealTicketsPerMonth: number;
  readonly mealTicketValue: number;
  readonly displayMode: "monthly" | "annual";
}

const INITIAL_STATE: CalculatorState = {
  grossMonthlyIncome: 8_000,
  monthsOfActivity: 12,
  monthlyExpenses: 0,
  activityType: "6201",
  county: "Bucuresti",
  personalStatus: DEFAULT_STATUS,
  year: getDefaultYear(),
  srlHasEmployee: false,
  mealTicketsPerMonth: 0,
  mealTicketValue: 40,
  displayMode: "monthly",
};

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);

  const inputs: CalculatorInputs = useMemo(
    () => ({
      grossMonthlyIncome: state.grossMonthlyIncome,
      monthsOfActivity: state.monthsOfActivity,
      monthlyExpenses: state.monthlyExpenses,
      activityType: state.activityType,
      county: state.county,
      personalStatus: state.personalStatus,
      year: state.year,
      srlHasEmployee: state.srlHasEmployee,
      mealTicketsPerMonth: state.mealTicketsPerMonth,
      mealTicketValue: state.mealTicketValue,
    }),
    [state]
  );

  const comparison: ComparisonResult | null = useMemo(() => {
    if (state.grossMonthlyIncome <= 0) return null;
    try {
      return compareAllStructures(inputs);
    } catch {
      return null;
    }
  }, [inputs, state.grossMonthlyIncome]);

  const updateField = <K extends keyof CalculatorState>(
    field: K,
    value: CalculatorState[K]
  ) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const updateStatus = (key: keyof PersonalStatus, value: boolean) => {
    setState((prev) => ({
      ...prev,
      personalStatus: { ...prev.personalStatus, [key]: value },
    }));
  };

  return {
    state,
    comparison,
    updateField,
    updateStatus,
  };
}
