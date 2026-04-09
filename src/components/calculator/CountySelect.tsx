"use client";

import { COUNTIES } from "@/lib/tax-engine/norme-lookup";
import { MapPin } from "lucide-react";

interface CountySelectProps {
  readonly value: string;
  readonly onChange: (county: string) => void;
}

export function CountySelect({ value, onChange }: CountySelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          Judet (pentru PFA Norma)
        </span>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 appearance-none cursor-pointer"
      >
        {COUNTIES.map((county) => (
          <option key={county} value={county}>
            {county}
          </option>
        ))}
      </select>
      <p className="mt-1 text-xs text-zinc-500">
        Norma de venit difera pe judete (date ANAF 2025)
      </p>
    </div>
  );
}
