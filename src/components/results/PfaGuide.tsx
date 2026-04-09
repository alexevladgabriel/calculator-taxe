"use client";

import { useState } from "react";
import { User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function PfaGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-zinc-50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
            <User className="h-4 w-4 text-amber-700" />
          </div>
          <div>
            <span className="text-sm font-semibold text-zinc-900">
              PFA Sistem Real vs PFA Norma de Venit
            </span>
            <p className="text-xs text-zinc-500 mt-0.5">
              Diferente, coduri CAEN, TVA, Declaratia Unica, plafoane
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
          {/* Intro */}
          <div className="pt-4">
            <p className="text-sm text-zinc-700 leading-relaxed">
              In Romania exista doua modalitati de impozitare pentru PFA:
              la <strong>norma de venit</strong> si in <strong>sistem real</strong>.
              Diferenta majora este felul in care taxele se raporteaza la veniturile anuale.
            </p>
          </div>

          {/* Side by side comparison */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Sistem Real */}
            <div className="rounded-xl border-2 border-amber-200 bg-amber-50/30 p-4">
              <h3 className="text-sm font-bold text-zinc-900 mb-2">
                PFA Sistem Real
              </h3>
              <p className="text-xs text-zinc-600 mb-3">
                Taxele se raporteaza la venitul net anual (incasari minus cheltuieli
                deductibile). Daca intr-un an nu incasezi nimic, nu platesti taxe.
              </p>
              <ul className="space-y-1.5 text-xs text-zinc-600">
                <li className="flex gap-2">
                  <span className="text-amber-500 shrink-0">&#x2713;</span>
                  Impozit 10% din venitul net
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500 shrink-0">&#x2713;</span>
                  Inregistrezi venituri SI cheltuieli
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500 shrink-0">&#x2713;</span>
                  Orice cod CAEN este acceptat
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500 shrink-0">&#x2713;</span>
                  Cheltuielile reduc baza de impozitare
                </li>
              </ul>
            </div>

            {/* Norma */}
            <div className="rounded-xl border-2 border-violet-200 bg-violet-50/30 p-4">
              <h3 className="text-sm font-bold text-zinc-900 mb-2">
                PFA Norma de Venit
              </h3>
              <p className="text-xs text-zinc-600 mb-3">
                Taxele se raporteaza la un plafon fix (norma), stabilit prin lege
                per domeniu si judet. Platesti aceleasi taxe indiferent cat castigi real.
              </p>
              <ul className="space-y-1.5 text-xs text-zinc-600">
                <li className="flex gap-2">
                  <span className="text-violet-500 shrink-0">&#x2713;</span>
                  Impozit 10% din norma (suma fixa)
                </li>
                <li className="flex gap-2">
                  <span className="text-violet-500 shrink-0">&#x2713;</span>
                  Tii doar evidenta veniturilor
                </li>
                <li className="flex gap-2">
                  <span className="text-violet-500 shrink-0">&#x2713;</span>
                  Doar anumite coduri CAEN eligibile
                </li>
                <li className="flex gap-2">
                  <span className="text-violet-500 shrink-0">&#x2713;</span>
                  Cheltuielile nu influenteaza taxele
                </li>
              </ul>
            </div>
          </div>

          {/* CAEN codes */}
          <Section title="Coduri CAEN">
            <p className="text-sm text-zinc-600 mb-2">
              Un PFA poate avea maxim <strong>5 coduri CAEN</strong> (1 principal + 4 secundare).
            </p>
            <div className="space-y-2">
              <div className="flex gap-2 text-sm bg-amber-50 rounded-lg px-3 py-2.5 border border-amber-100">
                <span className="text-amber-600 shrink-0 font-bold">!</span>
                <span className="text-zinc-700">
                  <strong>Norma:</strong> TOATE codurile CAEN trebuie sa se incadreze la norma.
                  Daca un singur cod nu se incadreaza, PFA-ul devine automat sistem real.
                </span>
              </div>
              <div className="flex gap-2 text-sm bg-amber-50 rounded-lg px-3 py-2.5 border border-amber-100">
                <span className="text-amber-600 shrink-0 font-bold">!</span>
                <span className="text-zinc-700">
                  <strong>Norma cu mai multe coduri CAEN:</strong> normele de venit
                  se cumuleaza (se aduna). Taxele cresc proportional.
                </span>
              </div>
              <div className="flex gap-2 text-sm bg-zinc-50 rounded-lg px-3 py-2.5">
                <span className="text-zinc-400 shrink-0">&#x2713;</span>
                <span className="text-zinc-600">
                  <strong>Sistem real:</strong> codurile CAEN nu afecteaza calculul taxelor.
                </span>
              </div>
            </div>
          </Section>

          {/* Plafoane importante */}
          <Section title="Plafoane importante">
            <div className="rounded-xl bg-zinc-50 border border-zinc-200 overflow-hidden">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-zinc-200">
                  <tr>
                    <td className="px-4 py-2.5 text-zinc-600">Plafon TVA</td>
                    <td className="px-4 py-2.5 text-right font-medium text-zinc-900">
                      395.000 lei
                    </td>
                    <td className="px-4 py-2.5 text-xs text-zinc-500">
                      Ambele tipuri devin platitoare de TVA daca depasesc
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-zinc-600">Plafon norma</td>
                    <td className="px-4 py-2.5 text-right font-medium text-zinc-900">
                      25.000 EUR
                    </td>
                    <td className="px-4 py-2.5 text-xs text-zinc-500">
                      PFA norma obligat sa treaca la sistem real in anul urmator
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-zinc-600">Revenire la norma</td>
                    <td className="px-4 py-2.5 text-right font-medium text-zinc-900">
                      dupa 2 ani
                    </td>
                    <td className="px-4 py-2.5 text-xs text-zinc-500">
                      Dupa trecerea la sistem real, poti reveni la norma dupa 2 ani
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          {/* TVA intracomunitar */}
          <Section title="TVA intracomunitar">
            <p className="text-sm text-zinc-600">
              Ambele tipuri de PFA pot obtine un <strong>cod de TVA intracomunitar</strong> si
              pot presta servicii catre clienti din strainatate (UE). Diferenta: pentru
              PFA sistem real, codul TVA intracomunitar este necesar si pentru achizitii
              din afara tarii inregistrate pe PFA.
            </p>
          </Section>

          {/* Declaratia Unica */}
          <Section title="Declaratia Unica (D212)">
            <p className="text-sm text-zinc-600">
              Incepand cu 2025, Declaratia Unica se completeaza in anul urmator
              realizarii veniturilor, atat pentru PFA norma cat si pentru sistem real.
              Se depune la ANAF electronic (SPV).
            </p>
          </Section>

          {/* Angajat + Norma */}
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
            <p className="text-sm text-emerald-800">
              <strong>Angajat + PFA Norma:</strong> Daca ai PFA la norma de venit si
              esti si angajat, norma se reduce cu un procent stabilit de ANAF (difera
              pe judete). Aceasta facilitate NU se aplica la PFA sistem real.
            </p>
          </div>

          {/* Summary */}
          <Section title="Cand alegi ce?">
            <div className="space-y-2">
              <div className="flex gap-2 text-sm bg-amber-50 rounded-lg px-3 py-2.5 border border-amber-100">
                <span className="text-amber-600 shrink-0 font-bold">&#x2192;</span>
                <span className="text-zinc-700">
                  <strong>Alege sistem real</strong> daca ai cheltuieli mari deductibile
                  sau daca veniturile variaza mult de la o luna la alta.
                </span>
              </div>
              <div className="flex gap-2 text-sm bg-violet-50 rounded-lg px-3 py-2.5 border border-violet-100">
                <span className="text-violet-600 shrink-0 font-bold">&#x2192;</span>
                <span className="text-zinc-700">
                  <strong>Alege norma de venit</strong> daca castigi semnificativ
                  peste norma stabilita (ex: IT cu norma 40.000 lei dar castigi 200.000+ lei).
                  Cu cat castigi mai mult, cu atat e mai avantajoasa norma.
                </span>
              </div>
            </div>
          </Section>

          <p className="text-xs text-zinc-500">
            Sursa: Cod Fiscal, Art. 68-69 (sistem real), Art. 69 (norma de venit).
            Normele de venit pe judete se publica anual de catre ANAF.
          </p>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  readonly title: string;
  readonly children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-bold text-zinc-900 mb-2">{title}</h3>
      {children}
    </div>
  );
}
