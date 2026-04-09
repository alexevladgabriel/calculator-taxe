"use client";

import type { TaxResult, StructureType } from "@/lib/tax-engine";
import { structureDescriptions } from "@/lib/tax-engine/descriptions";
import { formatRON, formatRONSigned } from "@/lib/format";
import { Trophy, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  readonly result: TaxResult;
  readonly isWinner: boolean;
  readonly displayMode: "monthly" | "annual";
  readonly onInfoClick: (type: StructureType) => void;
}

export function ResultCard({ result, isWinner, displayMode, onInfoClick }: ResultCardProps) {
  const divisor = displayMode === "monthly" ? 12 : 1;
  const suffix = displayMode === "monthly" ? "/luna" : "/an";
  const desc = structureDescriptions[result.structureType];

  return (
    <div
      className={cn(
        "rounded-2xl border-2 p-5 transition-all h-full flex flex-col",
        isWinner
          ? "border-emerald-500 bg-emerald-50/40 shadow-lg shadow-emerald-100"
          : "border-zinc-200 bg-white hover:border-zinc-300"
      )}
    >
      {/* Header - green for winner, grey for the rest */}
      <div className={cn("rounded-xl px-4 py-3 mb-4", isWinner ? "bg-emerald-600" : "bg-zinc-700")}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-white truncate" title={result.label}>
            {result.label}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onInfoClick(result.structureType)}
              className="rounded-full p-0.5 transition-colors text-white/70 hover:text-white hover:bg-white/20"
              aria-label={`Ce inseamna ${result.label}?`}
            >
              <Info className="h-3.5 w-3.5" />
            </button>
            {isWinner && <Trophy className="h-4 w-4 text-yellow-300" />}
          </div>
        </div>
        <p className="text-xs mt-0.5 line-clamp-2 text-white/80" title={desc.subtitle}>
          {desc.subtitle}
        </p>
        <div className="text-2xl font-bold text-white tracking-tight mt-1 whitespace-nowrap">
          {formatRON(result.netAnnualIncome / divisor)}
        </div>
        {isWinner && (
          <span className="text-xs text-white/90 font-medium">
            Cea mai avantajoasa optiune
          </span>
        )}
      </div>

      {/* Breakdown */}
      <div className="flex-1">
        {result.breakdown.map((item, i) => (
          <div
            key={`${item.label}-${i}`}
            className={cn(
              "flex items-baseline justify-between gap-3 py-2 border-b border-zinc-100 last:border-b-0",
              !isWinner && "opacity-80"
            )}
          >
            <span className="text-sm text-zinc-600 shrink-0">
              {item.label}
            </span>
            <span
              className={cn(
                "text-sm font-semibold tabular-nums whitespace-nowrap",
                item.amount < 0 ? "text-red-600" : "text-zinc-900"
              )}
            >
              {formatRONSigned(item.amount / divisor)}
            </span>
          </div>
        ))}
      </div>

      {/* Total taxes */}
      <div className="mt-3 pt-3 border-t-2 border-zinc-200">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm text-zinc-500">Taxe de plata</span>
          <span className="text-sm font-semibold text-zinc-700 tabular-nums whitespace-nowrap">
            {formatRON(result.totalTaxes / divisor)}
            <span className="text-xs text-zinc-500 ml-1">{suffix}</span>
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-3 mt-2">
          <span className="text-sm font-bold text-zinc-900 whitespace-nowrap">
            Bani in mana
          </span>
          <span
            className={cn(
              "text-lg font-bold tabular-nums whitespace-nowrap",
              isWinner ? "text-emerald-700" : "text-zinc-900"
            )}
          >
            {formatRON(result.netAnnualIncome / divisor)}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-3 mt-1">
          <span className="text-xs text-zinc-500">Rata efectiva taxare</span>
          <span className="text-xs font-medium text-zinc-600 tabular-nums whitespace-nowrap">
            {(result.effectiveTaxRate * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Warnings - collapsed */}
      {result.warnings.length > 0 && (
        <details className="mt-3 group">
          <summary className="flex items-center gap-1.5 text-xs text-amber-600 cursor-pointer hover:text-amber-700 list-none">
            <AlertTriangle className="h-3 w-3 shrink-0" />
            <span>
              {result.warnings.length}{" "}
              {result.warnings.length === 1 ? "nota" : "note"}
            </span>
            <span className="text-amber-500 group-open:rotate-180 transition-transform">
              ▾
            </span>
          </summary>
          <div className="mt-1.5 space-y-1">
            {result.warnings.map((w, i) => (
              <div
                key={i}
                className="text-xs text-amber-700 bg-amber-50 rounded-lg px-2.5 py-1.5"
              >
                {w}
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
