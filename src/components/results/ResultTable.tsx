"use client";

import type { TaxResult } from "@/lib/tax-engine";
import { formatRON } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Trophy, TrendingUp } from "lucide-react";

interface ResultTableProps {
  readonly results: readonly TaxResult[];
  readonly winnerType: string;
  readonly displayMode: "monthly" | "annual";
}

export function ResultTable({
  results,
  winnerType,
  displayMode,
}: ResultTableProps) {
  const divisor = displayMode === "monthly" ? 12 : 1;

  const categories = [
    { key: "Impozit pe venit", label: "Impozit" },
    { key: "Impozit pe profit", label: "Impozit pe profit" },
    { key: "CASS", label: "CASS (Sanatate)" },
    { key: "CAS", label: "CAS (Pensie) / Taxe Salariale" },
    { key: "Impozit dividende", label: "Impozit Dividende" },
    { key: "Taxe salariale", label: "Taxe salariale angajat" },
  ];

  function getAmount(result: TaxResult, categoryKey: string): number {
    const item = result.breakdown.find((b) => {
      const label = b.label.toLowerCase();
      const key = categoryKey.toLowerCase();
      return label.includes(key);
    });
    return item ? Math.abs(item.amount) : 0;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200">
            <th className="px-5 py-4 text-left text-sm font-semibold text-zinc-700">
              Categorie
            </th>
            {results.map((r) => {
              const isW = r.structureType === winnerType;
              return (
                <th
                  key={r.structureType}
                  className={cn(
                    "px-5 py-4 text-center text-sm font-semibold whitespace-nowrap",
                    isW ? "text-emerald-700 bg-emerald-50/50" : "text-zinc-700"
                  )}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    {r.label}
                    {isW && <Trophy className="h-4 w-4 text-amber-500" />}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => {
            const hasValue = results.some(
              (r) => getAmount(r, cat.key) > 0
            );
            if (!hasValue) return null;

            return (
              <tr
                key={cat.key}
                className="border-b border-zinc-100 hover:bg-zinc-50/50"
              >
                <td className="px-5 py-3 text-zinc-600">{cat.label}</td>
                {results.map((r) => {
                  const amount = getAmount(r, cat.key);
                  const isW = r.structureType === winnerType;
                  return (
                    <td
                      key={r.structureType}
                      className={cn(
                        "px-5 py-3 text-center tabular-nums whitespace-nowrap",
                        isW && "bg-emerald-50/30",
                        amount > 0 ? "font-medium text-zinc-700" : "text-zinc-300"
                      )}
                    >
                      {amount > 0 ? formatRON(amount / divisor) : "-"}
                    </td>
                  );
                })}
              </tr>
            );
          })}

          <tr className="border-b-2 border-zinc-200 bg-zinc-50/50 font-semibold">
            <td className="px-5 py-3 text-zinc-700 whitespace-nowrap">
              Total taxe {displayMode === "monthly" ? "lunare" : "anuale"}
            </td>
            {results.map((r) => {
              const isW = r.structureType === winnerType;
              return (
                <td
                  key={r.structureType}
                  className={cn(
                    "px-5 py-3 text-center tabular-nums whitespace-nowrap",
                    isW && "bg-emerald-50/50 text-emerald-700"
                  )}
                >
                  {formatRON(r.totalTaxes / divisor)}
                </td>
              );
            })}
          </tr>

          <tr className="font-bold text-base">
            <td className="px-5 py-4 text-zinc-900">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                Bani in mana {displayMode === "monthly" ? "lunar" : "anual"}
              </div>
            </td>
            {results.map((r) => {
              const isW = r.structureType === winnerType;
              return (
                <td
                  key={r.structureType}
                  className={cn(
                    "px-5 py-4 text-center tabular-nums whitespace-nowrap",
                    isW ? "bg-emerald-50/50 text-emerald-700" : "text-zinc-900"
                  )}
                >
                  {formatRON(r.netAnnualIncome / divisor)}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
