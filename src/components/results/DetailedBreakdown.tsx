"use client";

import type { TaxResult } from "@/lib/tax-engine";
import { structureDescriptions } from "@/lib/tax-engine/descriptions";
import { formatRON, formatNumber } from "@/lib/format";
import { DonutChart } from "./DonutChart";
import { X } from "lucide-react";

interface DetailedBreakdownProps {
  readonly result: TaxResult;
  readonly displayMode: "monthly" | "annual";
  readonly onClose: () => void;
}

export function DetailedBreakdown({
  result,
  displayMode,
  onClose,
}: DetailedBreakdownProps) {
  const d = displayMode === "monthly" ? 12 : 1;
  const desc = structureDescriptions[result.structureType];

  const netAmount = result.netAnnualIncome;
  const totalTaxes = result.totalTaxes;
  const effectivePct = result.grossAnnualIncome > 0
    ? Math.round((netAmount / result.grossAnnualIncome) * 100)
    : 0;

  // Build breakdown items with explanations
  const taxItems = result.breakdown.filter((b) => b.amount < 0);
  const incomeItems = result.breakdown.filter((b) => b.amount >= 0);

  // Donut segments
  const segments = [
    { label: "Venit net", value: Math.max(0, netAmount), color: "#10b981" },
    ...taxItems.map((item, i) => ({
      label: item.label,
      value: Math.abs(item.amount),
      color: ["#f59e0b", "#3b82f6", "#ef4444", "#8b5cf6", "#6b7280"][i % 5],
    })),
  ];

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-100">
        <div>
          <h3 className="text-lg font-bold text-zinc-900">{result.label}</h3>
          <p className="text-sm text-zinc-500">{desc.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg p-1.5 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-3 gap-3 px-6 py-4">
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
          <span className="text-xs font-medium text-emerald-700">
            Venit net {displayMode === "monthly" ? "lunar" : "anual"}
          </span>
          <div className="text-xl font-bold text-emerald-800 mt-0.5 tabular-nums">
            {formatNumber(Math.round(netAmount / d))} lei
          </div>
          <span className="text-xs text-emerald-600">
            din {formatNumber(Math.round(result.grossAnnualIncome / d))} lei incasat
          </span>
        </div>
        <div className="rounded-xl bg-zinc-50 border border-zinc-200 px-4 py-3">
          <span className="text-xs font-medium text-zinc-600">
            Total taxe anuale
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-0.5 tabular-nums">
            {formatNumber(Math.round(totalTaxes))} lei
          </div>
          <span className="text-xs text-zinc-500">
            {result.effectiveTaxRate > 0
              ? `${(result.effectiveTaxRate * 100).toFixed(0)}% din venitul brut`
              : ""}
          </span>
        </div>
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
          <span className="text-xs font-medium text-red-700">
            Impozit efectiv
          </span>
          <div className="text-xl font-bold text-red-800 mt-0.5 tabular-nums">
            {formatNumber(
              Math.round(
                Math.abs(
                  taxItems.find((t) =>
                    t.label.toLowerCase().includes("impozit")
                  )?.amount || 0
                )
              )
            )}{" "}
            lei
          </div>
          <span className="text-xs text-red-600">
            10% dupa deducerea CAS + CASS
          </span>
        </div>
      </div>

      {/* Donut Chart */}
      <div className="px-6 py-4 border-t border-zinc-100">
        <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-4">
          Distributia venitului
        </h4>
        <DonutChart
          segments={segments}
          centerLabel="net"
          centerValue={`${effectivePct}%`}
        />
      </div>

      {/* Step by Step */}
      <div className="px-6 py-4 border-t border-zinc-100">
        <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-4">
          Calcul detaliat pas cu pas
        </h4>

        <div className="space-y-0 divide-y divide-zinc-100">
          {/* Gross income */}
          {incomeItems.map((item, i) => (
            <StepRow
              key={`inc-${i}`}
              label={item.label}
              sublabel={item.note}
              amount={item.amount}
              positive
            />
          ))}

          {/* Deductible expenses - show if any negative non-tax items */}
          {result.breakdown
            .filter(
              (b) =>
                b.amount < 0 &&
                b.label.toLowerCase().includes("cheltuieli")
            )
            .map((item, i) => (
              <StepRow
                key={`exp-${i}`}
                label={item.label}
                sublabel="acceptate integral"
                amount={item.amount}
              />
            ))}

          {/* Net contabil */}
          <StepRow
            label="Venit net contabil"
            sublabel="baza de calcul pentru CAS si CASS"
            amount={
              result.grossAnnualIncome -
              Math.abs(
                result.breakdown
                  .filter((b) => b.label.toLowerCase().includes("cheltuieli"))
                  .reduce((s, b) => s + b.amount, 0)
              )
            }
            bold
          />
        </div>

        {/* Social contributions */}
        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wide mt-6 mb-3">
          Contributii sociale
        </h4>
        <div className="space-y-0 divide-y divide-zinc-100">
          {taxItems
            .filter(
              (t) =>
                t.label.toLowerCase().includes("cas") ||
                t.label.toLowerCase().includes("salarial")
            )
            .map((item, i) => (
              <StepRow
                key={`soc-${i}`}
                label={item.label}
                sublabel={item.note}
                amount={item.amount}
              />
            ))}

          {/* Tax base */}
          {taxItems.some((t) => t.label.toLowerCase().includes("impozit")) && (
            <StepRow
              label="Baza impozit venit"
              sublabel="venit net contabil minus CAS minus CASS"
              amount={
                result.grossAnnualIncome -
                Math.abs(
                  result.breakdown
                    .filter((b) => b.label.toLowerCase().includes("cheltuieli"))
                    .reduce((s, b) => s + b.amount, 0)
                ) -
                Math.abs(
                  taxItems
                    .filter(
                      (t) =>
                        t.label.toLowerCase().includes("cas") ||
                        t.label.toLowerCase().includes("salarial")
                    )
                    .reduce((s, t) => s + t.amount, 0)
                )
              }
              bold
            />
          )}
        </div>

        {/* Income tax */}
        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wide mt-6 mb-3">
          Impozit venit
        </h4>
        <div className="space-y-0 divide-y divide-zinc-100">
          {taxItems
            .filter(
              (t) =>
                t.label.toLowerCase().includes("impozit") ||
                t.label.toLowerCase().includes("dividende")
            )
            .map((item, i) => (
              <StepRow
                key={`tax-${i}`}
                label={item.label}
                sublabel={item.note}
                amount={item.amount}
              />
            ))}
        </div>

        {/* Totals */}
        <div className="mt-6 pt-4 border-t-2 border-zinc-200 space-y-3">
          <StepRow
            label="TOTAL OBLIGATII FISCALE"
            sublabel={`${(result.effectiveTaxRate * 100).toFixed(0)}% din venitul brut`}
            amount={-totalTaxes}
            bold
          />
          <div className="flex items-baseline justify-between gap-4 pt-2">
            <div>
              <div className="text-base font-bold text-emerald-800">
                VENIT NET RAMAS
              </div>
              <div className="text-xs text-zinc-500">
                {formatNumber(Math.round(netAmount / 12))} lei/luna
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-700 tabular-nums whitespace-nowrap">
              + {formatNumber(Math.round(netAmount))} lei
            </div>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50/50 space-y-2">
          {result.warnings.map((w, i) => (
            <p key={i} className="text-xs text-zinc-600">
              <span className="font-medium">%</span> {w}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function StepRow({
  label,
  sublabel,
  amount,
  bold,
  positive,
}: {
  readonly label: string;
  readonly sublabel?: string;
  readonly amount: number;
  readonly bold?: boolean;
  readonly positive?: boolean;
}) {
  const formatted = `${amount >= 0 ? (positive ? "+ " : "") : "- "}${formatNumber(Math.round(Math.abs(amount)))} lei`;

  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <div className="min-w-0">
        <div
          className={`text-sm ${bold ? "font-bold text-zinc-900" : "text-zinc-700"}`}
        >
          {label}
        </div>
        {sublabel && (
          <div className="text-xs text-zinc-500 mt-0.5">{sublabel}</div>
        )}
      </div>
      <div
        className={`text-sm tabular-nums whitespace-nowrap shrink-0 ${
          bold
            ? "font-bold text-zinc-900"
            : amount < 0
              ? "font-semibold text-red-600"
              : "font-semibold text-zinc-900"
        }`}
      >
        {formatted}
      </div>
    </div>
  );
}
