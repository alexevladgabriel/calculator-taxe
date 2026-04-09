"use client";

import { useState } from "react";
import { Landmark, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function TaxTypesGuide() {
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
            <Landmark className="h-4 w-4 text-zinc-600" />
          </div>
          <div>
            <span className="text-sm font-semibold text-zinc-900">
              Ce este impozitul? Micro vs Profit
            </span>
            <p className="text-xs text-zinc-500 mt-0.5">
              Cum functioneaza cele doua tipuri de impozit pentru firme
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
              Impozitul este suma de bani pe care firma ta trebuie sa o
              plateasca statului. Este modul in care statul colecteaza bani de
              la firme pentru bugetul public. Exista doua tipuri principale:
            </p>
          </div>

          {/* Two types side by side */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Micro */}
            <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-600 text-white text-xs font-bold">
                  1%
                </span>
                <h3 className="text-sm font-bold text-zinc-900">
                  Impozit micro-intreprindere
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li className="flex gap-2">
                  <span className="text-emerald-500 shrink-0">&#x2713;</span>
                  Firme cu venituri sub 500.000 EUR/an
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 shrink-0">&#x2713;</span>
                  Platesti <strong>1%</strong> din toate incasarile (cu angajat)
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 shrink-0">&#x2713;</span>
                  Sau <strong>3%</strong> fara angajat
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 shrink-0">&#x2713;</span>
                  Nu conteaza cheltuielile - platesti pe incasari
                </li>
              </ul>
            </div>

            {/* Profit */}
            <div className="rounded-xl border-2 border-zinc-200 bg-zinc-50/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-zinc-700 text-white text-xs font-bold">
                  16%
                </span>
                <h3 className="text-sm font-bold text-zinc-900">
                  Impozit pe profit
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li className="flex gap-2">
                  <span className="text-zinc-400 shrink-0">&#x2713;</span>
                  Firme fara angajati sau peste 500.000 EUR/an
                </li>
                <li className="flex gap-2">
                  <span className="text-zinc-400 shrink-0">&#x2713;</span>
                  Platesti <strong>16%</strong> din profit
                </li>
                <li className="flex gap-2">
                  <span className="text-zinc-400 shrink-0">&#x2713;</span>
                  Profit = venituri - cheltuieli deductibile
                </li>
                <li className="flex gap-2">
                  <span className="text-zinc-400 shrink-0">&#x2713;</span>
                  Avantajos daca ai cheltuieli mari
                </li>
              </ul>
            </div>
          </div>

          {/* Example */}
          <div>
            <h3 className="text-sm font-bold text-zinc-900 mb-3">
              Exemplu comparativ
            </h3>
            <p className="text-sm text-zinc-600 mb-3">
              Firma ta are venituri de <strong>10.000 lei</strong> si cheltuieli
              de <strong>7.000 lei</strong> (profit = 3.000 lei):
            </p>
            <div className="rounded-xl bg-zinc-50 border border-zinc-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-100/50">
                    <th className="px-4 py-2.5 text-left font-semibold text-zinc-700">
                      &nbsp;
                    </th>
                    <th className="px-4 py-2.5 text-center font-semibold text-emerald-700 whitespace-nowrap">
                      Micro (1%)
                    </th>
                    <th className="px-4 py-2.5 text-center font-semibold text-zinc-700 whitespace-nowrap">
                      Profit (16%)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  <tr>
                    <td className="px-4 py-2.5 text-zinc-600">Baza de calcul</td>
                    <td className="px-4 py-2.5 text-center text-zinc-700">
                      10.000 lei (venituri)
                    </td>
                    <td className="px-4 py-2.5 text-center text-zinc-700">
                      3.000 lei (profit)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-zinc-600">Rata impozit</td>
                    <td className="px-4 py-2.5 text-center text-zinc-700">1%</td>
                    <td className="px-4 py-2.5 text-center text-zinc-700">16%</td>
                  </tr>
                  <tr className="bg-amber-50/50">
                    <td className="px-4 py-2.5 font-bold text-zinc-900">
                      Impozit de plata
                    </td>
                    <td className="px-4 py-2.5 text-center font-bold text-emerald-700">
                      100 lei
                    </td>
                    <td className="px-4 py-2.5 text-center font-bold text-zinc-900">
                      480 lei
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              In acest exemplu, micro-intreprinderea plateste de ~5x mai putin
              impozit. Dar daca cheltuielile ar fi fost 9.500 lei (profit doar
              500 lei), impozitul pe profit ar fi doar 80 lei vs 100 lei la
              micro.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
