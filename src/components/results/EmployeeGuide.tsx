"use client";

import { useState } from "react";
import { Users, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmployeeGuide() {
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
            <Users className="h-4 w-4 text-zinc-600" />
          </div>
          <div>
            <span className="text-sm font-semibold text-zinc-900">
              Ce inseamna sa ai salariati?
            </span>
            <p className="text-xs text-zinc-500 mt-0.5">
              Obligatii, taxe, exemplu de calcul cu salariu minim
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
              Sa ai salariati inseamna ca firma ta angajeaza oficial persoane,
              iar tu (ca angajator) ai anumite obligatii clare fata de ei si
              fata de stat. Acest lucru este relevant daca ai un{" "}
              <strong>SRL Micro</strong> si vrei rata de impozitare de{" "}
              <strong>1%</strong> (in loc de 3%).
            </p>
          </div>

          {/* CIM */}
          <Section title="Contractul individual de munca (CIM)">
            <p className="text-sm text-zinc-600 mb-3">
              Primul lucru pe care il faci cand angajezi pe cineva este sa
              semnezi un contract individual de munca. Contractul trebuie sa
              contina obligatoriu:
            </p>
            <ul className="space-y-1.5">
              <BulletItem>Salariul brut al angajatului</BulletItem>
              <BulletItem>
                Norma de munca (full-time 8 ore sau part-time)
              </BulletItem>
              <BulletItem>Programul de lucru</BulletItem>
              <BulletItem>
                Concediul de odihna (minim 20 zile lucratoare/an)
              </BulletItem>
              <BulletItem>
                Conditiile de munca si atributiile angajatului
              </BulletItem>
            </ul>
          </Section>

          {/* Obligatii */}
          <Section title="Ce trebuie sa faci cand angajezi un salariat?">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-zinc-800 mb-1">
                  1. Inregistrare in REVISAL
                </h4>
                <p className="text-sm text-zinc-600">
                  Orice contract de munca (nou, modificat sau incetat) se
                  inregistreaza obligatoriu electronic in sistemul REVISAL
                  (Registrul salariatilor). Se face cel tarziu cu o zi
                  inainte ca angajatul sa inceapa efectiv munca.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-800 mb-1">
                  2. Medicina muncii si protectia muncii (SSM)
                </h4>
                <p className="text-sm text-zinc-600">
                  Angajatul trebuie sa faca obligatoriu control medical de
                  medicina muncii inainte sa inceapa activitatea. Trebuie
                  sa-i faci o instruire despre regulile de protectie si
                  siguranta (SSM).
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-800 mb-1">
                  3. Taxele si contributiile salariale
                </h4>
                <p className="text-sm text-zinc-600 mb-2">
                  Pentru fiecare angajat, platesti luna de luna catre stat:
                </p>
                <ul className="space-y-1.5">
                  <BulletItem>
                    <strong>Impozit pe salariu: 10%</strong> din salariul
                    brut, retinut din salariul angajatului
                  </BulletItem>
                  <BulletItem>
                    <strong>Contributii sociale: 35%</strong> (25% CAS
                    pensie + 10% CASS sanatate), retinut din salariul brut
                  </BulletItem>
                  <BulletItem>
                    <strong>CAM: 2,25%</strong> platita in plus de catre
                    firma (peste salariul brut)
                  </BulletItem>
                </ul>
              </div>
            </div>
          </Section>

          {/* Exemplu de calcul */}
          <Section title="Exemplu: Salariul minim brut de 4.050 lei">
            <div className="space-y-4">
              <div className="rounded-xl bg-zinc-50 border border-zinc-200 overflow-hidden">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-zinc-200">
                    <tr>
                      <td className="px-4 py-2.5 text-zinc-600">
                        Salariu brut
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold text-zinc-900">
                        4.050 lei
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-zinc-600">
                        CAS pensie (25%)
                      </td>
                      <td className="px-4 py-2.5 text-right font-medium text-red-600">
                        -1.012 lei
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-zinc-600">
                        CASS sanatate (10%)
                      </td>
                      <td className="px-4 py-2.5 text-right font-medium text-red-600">
                        -405 lei
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-zinc-600">
                        Impozit pe venit (~10%)
                      </td>
                      <td className="px-4 py-2.5 text-right font-medium text-red-600">
                        -263 lei
                      </td>
                    </tr>
                    <tr className="bg-emerald-50">
                      <td className="px-4 py-2.5 font-bold text-zinc-900">
                        Salariu net (in mana)
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold text-emerald-700">
                        ~2.469 lei
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="rounded-xl bg-amber-50 border border-amber-200 overflow-hidden">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-amber-200">
                    <tr>
                      <td className="px-4 py-2.5 text-zinc-600">
                        Salariu brut
                      </td>
                      <td className="px-4 py-2.5 text-right font-medium text-zinc-900">
                        4.050 lei
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-zinc-600">
                        CAM angajator (2,25%)
                      </td>
                      <td className="px-4 py-2.5 text-right font-medium text-red-600">
                        +91 lei
                      </td>
                    </tr>
                    <tr className="bg-amber-100/50">
                      <td className="px-4 py-2.5 font-bold text-zinc-900">
                        Cost total firma / luna
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold text-amber-700">
                        ~4.141 lei
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-zinc-50 border border-zinc-200 px-3 py-3 text-center">
                  <span className="text-xs text-zinc-500 block">
                    Angajatul primeste
                  </span>
                  <span className="text-base font-bold text-zinc-900 block mt-0.5">
                    ~2.469 lei
                  </span>
                </div>
                <div className="rounded-xl bg-zinc-50 border border-zinc-200 px-3 py-3 text-center">
                  <span className="text-xs text-zinc-500 block">
                    Statul primeste
                  </span>
                  <span className="text-base font-bold text-zinc-900 block mt-0.5">
                    ~1.581 lei
                  </span>
                </div>
                <div className="rounded-xl bg-zinc-50 border border-zinc-200 px-3 py-3 text-center">
                  <span className="text-xs text-zinc-500 block">
                    Firma plateste
                  </span>
                  <span className="text-base font-bold text-zinc-900 block mt-0.5">
                    ~4.141 lei
                  </span>
                </div>
              </div>
            </div>
          </Section>

          {/* Fluturasul */}
          <Section title="Fluturasul de salariu">
            <p className="text-sm text-zinc-600">
              Lunar, ii dai angajatului un fluturas de salariu care arata clar
              salariul brut, impozitele, contributiile si suma neta primita.
              Plata salariului net se face lunar, la data stabilita in contract.
            </p>
          </Section>

          {/* Warning */}
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-red-800">
              <strong>Atentie:</strong> Este important sa respecti aceste
              reguli. Incalcarea obligatiilor legate de salariati poate aduce
              amenzi si sanctiuni mari pentru firma ta.
            </p>
          </div>
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

function BulletItem({ children }: { readonly children: React.ReactNode }) {
  return (
    <li className="flex gap-2 text-sm text-zinc-600">
      <span className="text-zinc-300 shrink-0">&#x2022;</span>
      <span>{children}</span>
    </li>
  );
}
