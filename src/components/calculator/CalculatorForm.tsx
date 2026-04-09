"use client";

import type { CalculatorState, useCalculator } from "@/hooks/useCalculator";
import type { PersonalStatus } from "@/lib/tax-engine";
import { YearSelector } from "./YearSelector";
import { ActivitySelect } from "./ActivitySelect";
import { formatNumber } from "@/lib/format";
import {
  GraduationCap,
  Accessibility,
  Briefcase,
  UserRound,
  Users,
  Info,
} from "lucide-react";

type Props = {
  readonly state: CalculatorState;
  readonly updateField: ReturnType<typeof useCalculator>["updateField"];
  readonly updateStatus: ReturnType<typeof useCalculator>["updateStatus"];
};

export function CalculatorForm({ state, updateField, updateStatus }: Props) {
  return (
    <div className="space-y-6">
      {/* Year Selector */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Anul fiscal
        </label>
        <YearSelector
          value={state.year}
          onChange={(y) => updateField("year", y)}
        />
      </div>

      {/* Monthly Income */}
      <div>
        <label
          htmlFor="income"
          className="block text-sm font-medium text-zinc-700 mb-1.5"
        >
          Venit brut lunar in {state.year}?
        </label>
        <div className="relative">
          <input
            id="income"
            type="number"
            min={0}
            step={100}
            value={state.grossMonthlyIncome || ""}
            onChange={(e) =>
              updateField(
                "grossMonthlyIncome",
                Math.max(0, Number(e.target.value))
              )
            }
            placeholder="Ex: 8000"
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-lg font-medium text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-500">
            RON brut / luna
          </span>
        </div>
        {state.grossMonthlyIncome > 0 && (
          <p className="mt-1 text-xs text-zinc-500">
            = {formatNumber(state.grossMonthlyIncome * state.monthsOfActivity)}{" "}
            RON brut / an ({state.monthsOfActivity} luni)
          </p>
        )}
      </div>

      {/* Activity Type (for PFA Norma) */}
      <ActivitySelect
        value={state.activityType}
        year={state.year}
        onChange={(code) => updateField("activityType", code)}
      />

      {/* Deductible Expenses */}
      <div>
        <label
          htmlFor="expenses"
          className="block text-sm font-medium text-zinc-700 mb-1.5"
        >
          Ce cheltuieli deductibile estimezi?
        </label>
        <div className="relative">
          <input
            id="expenses"
            type="number"
            min={0}
            step={100}
            value={state.monthlyExpenses}
            onChange={(e) =>
              updateField(
                "monthlyExpenses",
                Math.max(0, Number(e.target.value) || 0)
              )
            }
            placeholder="0"
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
            RON / lună
          </span>
        </div>
        <p className="mt-1 text-xs text-zinc-500 flex items-center gap-1">
          <Info className="h-3 w-3 shrink-0" />
          Chirie, utilitati, contabilitate, software, etc. Relevant pentru PFA Real si SRL Profit. Poate fi 0.
        </p>
      </div>

      {/* Meal Tickets (Angajat only) */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1.5">
          Tichete de masa (doar Angajat)
        </label>
        <div className="relative">
          <input
            type="number"
            min={0}
            max={23}
            value={state.mealTicketsPerMonth}
            onChange={(e) =>
              updateField(
                "mealTicketsPerMonth",
                Math.min(23, Math.max(0, Number(e.target.value) || 0))
              )
            }
            placeholder="0"
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
            buc / luna
          </span>
        </div>
        {state.mealTicketsPerMonth > 0 && (
          <div className="mt-2">
            <div className="relative">
              <input
                type="number"
                min={0}
                step={5}
                value={state.mealTicketValue}
                onChange={(e) =>
                  updateField(
                    "mealTicketValue",
                    Math.max(0, Number(e.target.value) || 0)
                  )
                }
                placeholder="40"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
                lei / tichet
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              = {formatNumber(state.mealTicketsPerMonth * state.mealTicketValue)} lei/luna extra
              (afecteaza CASS si impozit Angajat)
            </p>
          </div>
        )}
      </div>

      {/* Months of Activity */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1.5">
          Câte luni vei avea activitate în {state.year}?
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={12}
            value={state.monthsOfActivity}
            onChange={(e) =>
              updateField("monthsOfActivity", Number(e.target.value))
            }
            className="flex-1 h-2 appearance-none rounded-full bg-zinc-200 accent-zinc-900 cursor-pointer"
          />
          <span className="w-12 text-center rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700">
            {state.monthsOfActivity}
          </span>
        </div>
      </div>

      {/* SRL has employee */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => updateField("srlHasEmployee", !state.srlHasEmployee)}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            state.srlHasEmployee ? "bg-zinc-900" : "bg-zinc-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform shadow-sm ${
              state.srlHasEmployee ? "translate-x-5" : ""
            }`}
          />
        </button>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-zinc-500" />
          <span className="text-sm text-zinc-700">
            SRL cu angajat (taxa 1% vs 3%)
          </span>
        </div>
      </div>

      {/* Personal Status */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          În {state.year} ești?
        </label>
        <div className="space-y-2">
          <StatusCheckbox
            icon={<GraduationCap className="h-4 w-4" />}
            label="Student"
            checked={state.personalStatus.isStudent}
            onChange={(v) => updateStatus("isStudent", v)}
          />
          <StatusCheckbox
            icon={<Accessibility className="h-4 w-4" />}
            label="Persoană cu handicap grav și accentuat"
            checked={state.personalStatus.isHandicapped}
            onChange={(v) => updateStatus("isHandicapped", v)}
          />
          <StatusCheckbox
            icon={<Briefcase className="h-4 w-4" />}
            label="Angajat în altă parte"
            checked={state.personalStatus.isEmployedElsewhere}
            onChange={(v) => updateStatus("isEmployedElsewhere", v)}
          />
          <StatusCheckbox
            icon={<UserRound className="h-4 w-4" />}
            label="Pensionar"
            checked={state.personalStatus.isPensioner}
            onChange={(v) => updateStatus("isPensioner", v)}
          />
        </div>
      </div>
    </div>
  );
}

function StatusCheckbox({
  icon,
  label,
  checked,
  onChange,
}: {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly checked: boolean;
  readonly onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div
        className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${
          checked
            ? "border-zinc-900 bg-zinc-900"
            : "border-zinc-500 group-hover:border-zinc-700"
        }`}
      >
        {checked && (
          <svg
            className="h-3 w-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        )}
      </div>
      <span className="flex items-center gap-2 text-sm text-zinc-900">
        <span className="text-zinc-600">{icon}</span>
        {label}
      </span>
    </label>
  );
}
