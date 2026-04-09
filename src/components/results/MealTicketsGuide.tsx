"use client";

import { useState } from "react";
import { UtensilsCrossed, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function MealTicketsGuide() {
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
            <UtensilsCrossed className="h-4 w-4 text-zinc-600" />
          </div>
          <div>
            <span className="text-sm font-semibold text-zinc-900">
              Ce sunt tichetele de masa?
            </span>
            <p className="text-xs text-zinc-500 mt-0.5">
              Cum functioneaza, cum afecteaza taxele, exemplu real
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
        <div className="px-5 pb-6 border-t border-zinc-200 space-y-5">
          <div className="pt-4">
            <p className="text-sm text-zinc-700 leading-relaxed">
              Tichetele de masa sunt un beneficiu acordat de angajator pe langa salariul brut.
              Primesti un numar de tichete pe luna (de obicei cate una pentru fiecare zi lucrata),
              fiecare avand o valoare fixa (max ~40 lei in 2025). Le folosesti la restaurante,
              magazine alimentare sau livrare mancare.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-zinc-900 mb-2">
              Cum functioneaza?
            </h3>
            <ul className="space-y-2">
              <li className="flex gap-2.5 text-sm text-zinc-600">
                <span className="text-emerald-500 shrink-0 font-bold">1.</span>
                Angajatorul cumpara tichetele de la o firma emitenta (Sodexo, Edenred, Up etc.)
              </li>
              <li className="flex gap-2.5 text-sm text-zinc-600">
                <span className="text-emerald-500 shrink-0 font-bold">2.</span>
                Primesti tichetele pe un card dedicat sau fizic, separat de salariu
              </li>
              <li className="flex gap-2.5 text-sm text-zinc-600">
                <span className="text-emerald-500 shrink-0 font-bold">3.</span>
                Le folosesti doar pentru mancare (nu poti scoate cash)
              </li>
              <li className="flex gap-2.5 text-sm text-zinc-600">
                <span className="text-emerald-500 shrink-0 font-bold">4.</span>
                Primesti maxim un tichet pe zi lucrata (tipic 20-22 tichete/luna)
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-zinc-900 mb-2">
              Cum afecteaza taxele?
            </h3>
            <p className="text-sm text-zinc-600 mb-3">
              Tichetele de masa NU sunt incluse in salariul brut, dar afecteaza
              calculul taxelor angajatului:
            </p>
            <div className="space-y-2">
              <div className="flex gap-2 text-sm bg-zinc-50 rounded-lg px-3 py-2.5">
                <span className="text-red-500 shrink-0 font-bold">!</span>
                <span className="text-zinc-700">
                  <strong>CASS (10%)</strong> se calculeaza pe brut + valoare tichete
                </span>
              </div>
              <div className="flex gap-2 text-sm bg-zinc-50 rounded-lg px-3 py-2.5">
                <span className="text-red-500 shrink-0 font-bold">!</span>
                <span className="text-zinc-700">
                  <strong>Impozit pe venit (10%)</strong> include tichetele in baza impozabila
                </span>
              </div>
              <div className="flex gap-2 text-sm bg-emerald-50 rounded-lg px-3 py-2.5">
                <span className="text-emerald-500 shrink-0 font-bold">&#x2713;</span>
                <span className="text-zinc-700">
                  <strong>CAS (25%)</strong> se calculeaza doar pe brut (fara tichete)
                </span>
              </div>
            </div>
          </div>

          {/* Real example */}
          <div>
            <h3 className="text-sm font-bold text-zinc-900 mb-2">
              Exemplu real: brut 10.392 lei + 21 tichete x 20 lei
            </h3>
            <div className="rounded-xl bg-zinc-50 border border-zinc-200 overflow-hidden">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-zinc-200">
                  <tr>
                    <td className="px-4 py-2 text-zinc-600">Salariu brut</td>
                    <td className="px-4 py-2 text-right font-medium text-zinc-900">10.392 lei</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-zinc-600">Tichete de masa (21 x 20 lei)</td>
                    <td className="px-4 py-2 text-right font-medium text-zinc-700">+420 lei</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-zinc-600">CAS 25% (doar pe brut)</td>
                    <td className="px-4 py-2 text-right font-medium text-red-600">-2.598 lei</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-zinc-600">CASS 10% (pe brut + tichete = 10.812)</td>
                    <td className="px-4 py-2 text-right font-medium text-red-600">-1.081 lei</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-zinc-600">Baza impozabila (10.392 - 2.598 - 1.081 + 420)</td>
                    <td className="px-4 py-2 text-right font-medium text-zinc-700">7.133 lei</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-zinc-600">Impozit 10%</td>
                    <td className="px-4 py-2 text-right font-medium text-red-600">-713 lei</td>
                  </tr>
                  <tr className="bg-emerald-50">
                    <td className="px-4 py-2 font-bold text-zinc-900">Salariu net</td>
                    <td className="px-4 py-2 text-right font-bold text-emerald-700">6.000 lei</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="px-4 py-2 font-medium text-zinc-700">+ Tichete pe card</td>
                    <td className="px-4 py-2 text-right font-medium text-blue-700">+420 lei</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              Angajatul primeste 6.000 lei in cont + 420 lei pe cardul de tichete.
              Fara tichete, salariul net ar fi mai mare (~6.080 lei) deoarece
              CASS si impozitul se calculeaza pe o baza mai mica.
            </p>
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
            <p className="text-sm text-amber-800">
              <strong>De retinut:</strong> Tichetele de masa sunt un bonus real
              (primesti bani extra pe card), dar cresc usor taxele (CASS si impozit).
              Per total tot este avantajos sa le primesti - primesti 420 lei dar
              platesti doar ~42 lei extra in taxe.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
