"use client";

import { getAvailableYears } from "@/lib/tax-engine";
import { cn } from "@/lib/utils";

interface YearSelectorProps {
  readonly value: number;
  readonly onChange: (year: number) => void;
}

export function YearSelector({ value, onChange }: YearSelectorProps) {
  const years = getAvailableYears();

  return (
    <div className="flex gap-1.5">
      {years.map((year) => (
        <button
          key={year}
          type="button"
          onClick={() => onChange(year)}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition-all",
            value === year
              ? "bg-zinc-900 text-white shadow-sm"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          )}
        >
          {year}
        </button>
      ))}
    </div>
  );
}
