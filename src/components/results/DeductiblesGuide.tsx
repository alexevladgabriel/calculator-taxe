"use client";

import { useState } from "react";
import { Receipt, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function DeductiblesGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-zinc-50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100">
            <Receipt className="h-4 w-4 text-zinc-600" />
          </div>
          <div>
            <span className="text-sm font-semibold text-zinc-900">
              Ce sunt cheltuielile deductibile?
            </span>
            <p className="text-xs text-zinc-500 mt-0.5">
              Cum reduci legal baza de impozitare
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-zinc-400 transition-transform shrink-0",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="px-5 pb-6 border-t border-zinc-200 space-y-6">
          <div className="pt-4">
            <p className="text-sm text-zinc-700 leading-relaxed">
              Cheltuielile deductibile sunt banii pe care firma ii cheltuieste
              si pe care statul ii accepta ca fiind necesari pentru activitatea
              firmei. Aceste cheltuieli pot fi scazute din veniturile firmei
              atunci cand calculezi impozitul.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-zinc-900 mb-2">
              Exemple de cheltuieli deductibile
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              <DeductibleItem label="Salariile angajatilor" />
              <DeductibleItem label="Chiria spatiului unde functioneaza firma" />
              <DeductibleItem label="Facturile de utilitati (curent, apa, internet)" />
              <DeductibleItem label="Materialele cumparate pentru activitate" />
              <DeductibleItem label="Cheltuielile cu publicitatea si promovarea" />
              <DeductibleItem label="Abonamente software, servicii cloud" />
            </div>
          </div>

          <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3">
            <p className="text-sm text-blue-800">
              <strong>Relevant pentru:</strong> PFA Sistem Real si SRL Impozit
              pe Profit. La aceste doua structuri, cheltuielile deductibile
              reduc direct baza pe care platesti impozit.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function DeductibleItem({ label }: { readonly label: string }) {
  return (
    <div className="flex gap-2 text-sm text-zinc-600 bg-zinc-50 rounded-lg px-3 py-2">
      <span className="text-emerald-500 shrink-0">&#x2713;</span>
      <span>{label}</span>
    </div>
  );
}
