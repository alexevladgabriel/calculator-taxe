"use client";

import { useState, useEffect, useRef } from "react";
import type { ComparisonResult, StructureType, TaxResult } from "@/lib/tax-engine";
import { ResultCard } from "./ResultCard";
import { ResultTable } from "./ResultTable";
import { InfoModal } from "./InfoModal";
import { DetailedBreakdown } from "./DetailedBreakdown";
import { LayoutGrid, Table, Calendar, CalendarDays, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonViewProps {
  readonly comparison: ComparisonResult | null;
  readonly displayMode: "monthly" | "annual";
  readonly onDisplayModeChange: (mode: "monthly" | "annual") => void;
}

export function ComparisonView({
  comparison,
  displayMode,
  onDisplayModeChange,
}: ComparisonViewProps) {
  const [viewType, setViewType] = useState<"cards" | "table">("cards");
  const [infoType, setInfoType] = useState<StructureType | null>(null);
  const [detailResult, setDetailResult] = useState<TaxResult | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  // Auto-select the winner when comparison results change
  useEffect(() => {
    if (comparison) {
      setDetailResult(comparison.winner);
    }
  }, [comparison]);

  if (!comparison) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-16 w-16 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4">
          <Calendar className="h-8 w-8 text-zinc-300" />
        </div>
        <p className="text-lg font-medium text-zinc-500">
          Introdu venitul pentru a vedea comparatia
        </p>
        <p className="text-sm text-zinc-500 mt-1">
          Calculul se actualizeaza automat
        </p>
      </div>
    );
  }

  const handleCardClick = (result: TaxResult) => {
    setDetailResult(
      detailResult?.structureType === result.structureType ? null : result
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
          Cati bani iti raman in mana?
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Comparatie completa pentru {comparison.yearConfig.year}
          {" · "}
          <span className="text-zinc-500">Click pe un card pentru detalii</span>
        </p>
        {detailResult && (
          <button
            type="button"
            onClick={() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="inline-flex items-center gap-1 mt-2 text-xs text-emerald-600 hover:text-emerald-700 transition-colors animate-bounce"
          >
            <ChevronDown className="h-3.5 w-3.5" />
            Deruleaza in jos pentru vizualizare detaliata
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* View toggle */}
        <div className="flex gap-1 bg-zinc-100 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => { setViewType("cards"); setDetailResult(null); }}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
              viewType === "cards"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Carduri
          </button>
          <button
            type="button"
            onClick={() => { setViewType("table"); setDetailResult(null); }}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
              viewType === "table"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            <Table className="h-3.5 w-3.5" />
            Tabel
          </button>
        </div>

        {/* Monthly/Annual toggle */}
        <div className="flex gap-1 bg-zinc-100 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => onDisplayModeChange("monthly")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
              displayMode === "monthly"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            <Calendar className="h-3.5 w-3.5" />
            Lunar
          </button>
          <button
            type="button"
            onClick={() => onDisplayModeChange("annual")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
              displayMode === "annual"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            Anual
          </button>
        </div>
      </div>

      {/* Results */}
      {viewType === "cards" ? (
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
          {comparison.results.map((result) => (
            <div
              key={result.structureType}
              className={cn(
                "min-w-[280px] sm:min-w-0 snap-start cursor-pointer transition-all",
                detailResult?.structureType === result.structureType && "ring-2 ring-emerald-500 ring-offset-2 rounded-2xl"
              )}
              onClick={() => handleCardClick(result)}
            >
              <ResultCard
                result={result}
                isWinner={
                  result.structureType === comparison.winner.structureType
                }
                displayMode={displayMode}
                onInfoClick={setInfoType}
              />
            </div>
          ))}
        </div>
      ) : (
        <ResultTable
          results={comparison.results}
          winnerType={comparison.winner.structureType}
          displayMode={displayMode}
        />
      )}

      {/* Detailed breakdown panel */}
      {detailResult && (
        <div ref={detailRef} className="scroll-mt-4">
          <DetailedBreakdown
            result={detailResult}
            displayMode={displayMode}
            onClose={() => setDetailResult(null)}
          />
        </div>
      )}

      {/* Info modal */}
      <InfoModal
        structureType={infoType}
        onClose={() => setInfoType(null)}
      />
    </div>
  );
}
